<template>
  <div class="article-detail page-enter">
    <Teleport to="body">
      <div v-if="headings.length === 0" class="reading-progress" :style="{ width: readingProgress + '%' }" role="progressbar" aria-label="文章阅读进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(readingProgress)"></div>
    </Teleport>
    <div class="container detail-container">
      <!-- Back Button -->
      <router-link to="/articles" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        返回文章列表
      </router-link>

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- Error -->
      <div class="error-state" v-else-if="notFound">
        <h2>文章不存在</h2>
        <p>该文章已被移除或不存在。</p>
        <router-link to="/articles" class="back-home-link">返回文章列表</router-link>
      </div>

      <!-- Article -->
      <template v-else>
        <!-- Header -->
        <header class="article-header">
          <div class="header-text">
            <span class="type-badge" :class="article.type === '知识' ? 'type-tech' : 'type-essay'">
              {{ article.type }}
            </span>
            <h1 class="article-title">{{ article.title }}</h1>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
              </div>
              <span class="article-date">发布于 {{ article.date }} · 最后修改于 {{ article.updated || article.date }}</span>
            </div>
          </div>
        </header>

        <!-- Content + TOC -->
        <div class="article-body" :class="{ 'has-toc': headings.length > 0 }">
          <article class="article-content" v-html="articleContent"></article>

          <!-- TOC: visually placed on the left of content -->
          <aside class="toc-sidebar" v-if="headings.length > 0">
            <div class="toc-header">
              <span>目录</span>
            </div>
            <nav class="toc-nav" :style="{ '--toc-progress': readingProgress + '%' }">
              <a
                v-for="heading in headings"
                :key="heading.id"
                :href="'#' + heading.id"
                class="toc-link"
                :class="['toc-level-' + heading.level, { active: activeHeadingId === heading.id }]"
                :style="{ paddingLeft: (heading.level - 2) * 10 + 12 + 'px' }"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </nav>
          </aside>
        </div>

        <!-- Prev/Next Navigation -->
        <nav class="article-nav">
          <router-link
            v-if="prevArticle"
            :to="`/articles/${prevArticle.slug}`"
            class="nav-card nav-prev"
          >
            <span class="nav-label">上一篇</span>
            <span class="nav-title">{{ prevArticle.title }}</span>
          </router-link>
          <div v-else class="nav-card nav-empty"></div>

          <router-link
            v-if="nextArticle"
            :to="`/articles/${nextArticle.slug}`"
            class="nav-card nav-next"
          >
            <span class="nav-label">下一篇</span>
            <span class="nav-title">{{ nextArticle.title }}</span>
          </router-link>
          <div v-else class="nav-card nav-empty"></div>
        </nav>
        <section class="related" v-if="relatedArticles.length">
          <h2>相关文章</h2>
          <router-link v-for="item in relatedArticles" :key="item.slug" :to="`/articles/${item.slug}`">{{ item.title }}</router-link>
        </section>
        <button class="share-button" type="button" @click="shareArticle">{{ shareLabel }}</button>
        <ArticleInteractions :slug="article.slug" />
      </template>
      <div v-if="lightboxSrc" class="lightbox" role="dialog" aria-modal="true" aria-label="图片预览" @click="lightboxSrc = ''">
        <img :src="lightboxSrc" alt="文章图片预览" @click.stop />
        <button type="button" aria-label="关闭图片预览" @click="lightboxSrc = ''">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, createApp, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import { publishedArticles as articles } from '../composables/useManagedArticles.js'
import CodeCopyButton from '@/components/CodeCopyButton.vue'
import ArticleInteractions from '../components/ArticleInteractions.vue'

import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import '@/styles/article.css'

const route = useRoute()
const router = useRouter()

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)

const article = ref({ title: '', date: '', tags: [], type: '', slug: '' })
const articleContent = ref('')
const headings = ref([])
const loading = ref(true)
const notFound = ref(false)
const prevArticle = ref(null)
const nextArticle = ref(null)
const tocOpen = ref(false)
const readingProgress = ref(0)
const activeHeadingId = ref('')
const lightboxSrc = ref('')
const shareLabel = ref('分享文章')
let headingObserver
const relatedArticles = computed(() => articles.value.filter(item => item.slug !== article.value.slug).map(item => ({ item, score: item.tags.filter(tag => article.value.tags.includes(tag)).length + (item.series && item.series === article.value.series ? 3 : 0) })).filter(entry => entry.score > 0).sort((a,b) => b.score-a.score).slice(0,3).map(entry => entry.item))

// Markdown-it setup
const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: false,
  typographer: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(str, { language: lang })
        return `<pre class="hljs"><code class="language-${lang}">${result.value}</code></pre>`
      } catch (_) {}
    }
    try {
      const result = hljs.highlightAuto(str)
      return `<pre class="hljs"><code>${result.value}</code></pre>`
    } catch (_) {}
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// Use KaTeX plugin (uses ~ for math, so we handle strikethrough via pre-processing)
md.use(markdownItKatex)

// Custom link renderer
const defaultLinkRenderer = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrPush(['target', '_blank'])
  tokens[idx].attrPush(['rel', 'noopener noreferrer'])
  tokens[idx].attrPush(['class', 'md-link'])
  return defaultLinkRenderer(tokens, idx, options, env, self)
}

// Extract headings and add IDs
const extractHeadings = (html) => {
  let processed = html
  const extracted = []
  let idx = 0

  processed = processed.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, text) => {
    const id = `heading-${idx++}`
    const level = parseInt(tag[1])
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    extracted.push({ id, text: plainText, level })
    return `<${tag}${attrs} id="${id}">${text}</${tag}>`
  })

  return { html: processed, headings: extracted }
}

// Add copy buttons to code blocks
const addCopyButtons = () => {
  const pres = document.querySelectorAll('.article-content pre.hljs:not(.copy-added)')

  pres.forEach((pre) => {
    const code = pre.querySelector('code')
    const text = code ? code.innerText : pre.innerText

    // 创建Vue组件容器
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'copy-btn-container'

    // 创建Vue应用实例并挂载组件
    const app = createApp(CodeCopyButton, {
      codeContent: text
    })

    app.mount(buttonContainer)

    // 设置代码块样式并添加按钮
    pre.style.position = 'relative'
    pre.appendChild(buttonContainer)
    pre.classList.add('copy-added')
  })
}

// Scroll to heading
const scrollToHeading = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 80
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
    tocOpen.value = false
  }
}

// Update prev/next
const updatePrevNext = (slug) => {
  const index = articles.value.findIndex(a => a.slug === slug)
  prevArticle.value = index > 0 ? articles.value[index - 1] : null
  nextArticle.value = index < articles.value.length - 1 ? articles.value[index + 1] : null
}

// Load article
const loadArticle = async (slug) => {
  loading.value = true
  notFound.value = false
  articleContent.value = ''
  headings.value = []
  tocOpen.value = false

  const current = articles.value.find(a => a.slug === slug)

  if (!current) {
    notFound.value = true
    loading.value = false
    updatePrevNext(slug)
    return
  }

  article.value = current
  updatePrevNext(slug)

  try {
    let mdText = current.markdown

    // Pre-process strikethrough before markdown-it (KaTeX uses ~ for math, conflicts with ~~)
    const strikethroughs = []
    mdText = mdText.replace(/~~([^~]+)~~/g, (_, text) => {
      strikethroughs.push(text)
      return `%%STRIKE_${strikethroughs.length - 1}%%`
    })

    let rawHtml = md.render(mdText)

    // Restore strikethrough HTML
    rawHtml = rawHtml.replace(/%%STRIKE_(\d+)%%/g, (_, idx) => {
      return `<del>${strikethroughs[parseInt(idx)]}</del>`
    })

    const { html, headings: extractedHeadings } = extractHeadings(rawHtml)
    articleContent.value = html
    headings.value = extractedHeadings

    await nextTick()
    headingObserver?.disconnect()
    headingObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) activeHeadingId.value = visible[0].target.id
    }, { rootMargin: '-80px 0px -65% 0px', threshold: [0, 1] })
    headings.value.forEach(heading => { const element = document.getElementById(heading.id); if (element) headingObserver.observe(element) })
    requestAnimationFrame(handleScroll)
    // 添加一个小延迟确保DOM完全渲染
    setTimeout(addCopyButtons, 100)
  } catch (err) {
    console.error('Failed to load article:', err)
    articleContent.value = `<div class="article-load-error">加载文章失败：${err.message}</div>`
  }

  loading.value = false
}

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) loadArticle(newSlug)
}, { immediate: true })

// Scroll spy for TOC
const handleScroll = () => {
  const content = document.querySelector('.article-content')
  if (!content) { readingProgress.value = 0; return }
  const top = content.getBoundingClientRect().top + scrollY
  const start = Math.max(0, top - 120)
  const end = Math.max(start + 1, top + content.offsetHeight - innerHeight * 0.72)
  readingProgress.value = Math.min(100, Math.max(0, (scrollY - start) / (end - start) * 100))
}

const shareArticle = async () => {
  try { if (navigator.share) await navigator.share({ title: article.value.title, text: article.value.summary, url: location.href }); else await navigator.clipboard.writeText(location.href); shareLabel.value='链接已复制'; setTimeout(()=>shareLabel.value='分享文章',1800) } catch (_) {}
}
const handleContentClick = event => { const image=event.target.closest?.('.article-content img'); if(image) lightboxSrc.value=image.src }

// Handle keyboard navigation
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && lightboxSrc.value) { lightboxSrc.value = ''; return }
  if (event.key === 'ArrowLeft' && prevArticle.value) {
    router.push(`/articles/${prevArticle.value.slug}`)
  } else if (event.key === 'ArrowRight' && nextArticle.value) {
    router.push(`/articles/${nextArticle.value.slug}`)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleContentClick)
})

onUnmounted(() => {
  headingObserver?.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleContentClick)
})
</script>

<style scoped src="../styles/article-detail.css"></style>
