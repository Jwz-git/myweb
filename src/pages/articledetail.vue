<template>
  <div class="article-detail page-enter">
    <div class="container detail-container">
      <!-- Back Button -->
      <router-link to="/article" class="back-link">
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
        <router-link to="/article" class="back-home-link">返回文章列表</router-link>
      </div>

      <!-- Article -->
      <template v-else>
        <!-- Header: title left, cover right -->
        <header class="article-header" :class="{ 'has-cover': article.cover }">
          <div class="header-text">
            <span class="type-badge" :class="article.type === '技术' ? 'type-tech' : 'type-essay'">
              {{ article.type }}
            </span>
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
              </div>
              <span class="article-date">{{ article.date }}</span>
            </div>
          </div>
          <div class="header-cover" v-if="article.cover">
            <img :src="article.cover" :alt="article.title" />
          </div>
        </header>

        <!-- Content + TOC -->
        <div class="article-body">
          <article class="article-content" v-html="articleContent"></article>

          <!-- TOC: right of content area -->
          <aside class="toc-sidebar" v-if="headings.length > 0">
            <div class="toc-header">目录</div>
            <nav class="toc-nav">
              <a
                v-for="heading in headings"
                :key="heading.id"
                :href="'#' + heading.id"
                class="toc-link"
                :class="'toc-level-' + heading.level"
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
            :to="`/article/${prevArticle.id}`"
            class="nav-card nav-prev"
          >
            <span class="nav-label">上一篇</span>
            <span class="nav-title">{{ prevArticle.title }}</span>
          </router-link>
          <div v-else class="nav-card nav-empty"></div>

          <router-link
            v-if="nextArticle"
            :to="`/article/${nextArticle.id}`"
            class="nav-card nav-next"
          >
            <span class="nav-label">下一篇</span>
            <span class="nav-title">{{ nextArticle.title }}</span>
          </router-link>
          <div v-else class="nav-card nav-empty"></div>
        </nav>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, createApp } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import { articles } from '../data/articles.js'
import CodeCopyButton from '@/components/CodeCopyButton.vue'

import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import '@/styles/article.css'

const route = useRoute()

const article = ref({ title: '', date: '', tags: [], type: '', id: -1 })
const articleContent = ref('')
const headings = ref([])
const loading = ref(true)
const notFound = ref(false)
const prevArticle = ref(null)
const nextArticle = ref(null)
const tocOpen = ref(false)

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
const updatePrevNext = (id) => {
  const index = articles.findIndex(a => a.id === Number(id))
  prevArticle.value = index > 0 ? articles[index - 1] : null
  nextArticle.value = index < articles.length - 1 ? articles[index + 1] : null
}

// Load article
const loadArticle = async (id) => {
  loading.value = true
  notFound.value = false
  articleContent.value = ''
  headings.value = []
  tocOpen.value = false

  const current = articles.find(a => a.id === Number(id))

  if (!current) {
    notFound.value = true
    loading.value = false
    updatePrevNext(id)
    return
  }

  article.value = current
  updatePrevNext(id)

  try {
    const response = await fetch(current.mdPath)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    let mdText = await response.text()

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
    // 添加一个小延迟确保DOM完全渲染
    setTimeout(addCopyButtons, 100)
  } catch (err) {
    console.error('Failed to load article:', err)
    articleContent.value = `<div style="padding: 2rem; color: var(--text-muted);">加载文章失败：${err.message}</div>`
  }

  loading.value = false
}

watch(() => route.params.id, (newId) => {
  if (newId) loadArticle(newId)
}, { immediate: true })

// Scroll spy for TOC
const handleScroll = () => {
  if (headings.value.length === 0) return
  const links = document.querySelectorAll('.toc-link')
  let activeId = ''

  for (let i = headings.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(headings.value[i].id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 100) {
        activeId = headings.value[i].id
        break
      }
    }
  }

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + activeId)
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-detail {
  padding: 32px 0 80px;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 32px;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--accent);
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 80px 0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-primary);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Error */
.error-state {
  text-align: center;
  padding: 80px 0;
}

.error-state h2 {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.error-state p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.back-home-link {
  display: inline-block;
  padding: 8px 20px;
  font-size: 0.88rem;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
}

.back-home-link:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

/* Article Header */
.article-header {
  margin-bottom: 36px;
  display: flex;
  align-items: flex-start;
  gap: 28px;
}

.article-header.has-cover {
  align-items: center;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-cover {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.header-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  display: inline-block;
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 16px;
}

.type-tech {
  background: var(--accent-muted);
  color: var(--accent);
}

.type-essay {
  background: rgba(120, 140, 200, 0.12);
  color: #8b9dc3;
}

.article-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.article-tags {
  display: flex;
  gap: 6px;
}

.tag-pill {
  font-size: 0.72rem;
  padding: 2px 8px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
}

.article-date {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Article Body: content + TOC side by side */
.article-body {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
}

.article-body .article-content {
  /* keep original width */
}

/* TOC Sidebar — right of content */
.toc-sidebar {
  width: 200px;
  flex-shrink: 0;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.toc-header {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.toc-link {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 6px 0;
  border-left: 2px solid var(--border-subtle);
  transition: all var(--transition-fast);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-link:hover {
  color: var(--text-secondary);
  border-left-color: var(--text-muted);
}

.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
}

.toc-level-3 {
  font-size: 0.8rem;
}

.toc-level-4 {
  font-size: 0.78rem;
}

/* Article Navigation */
.article-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border-subtle);
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.nav-card:hover {
  border-color: var(--border-primary);
  background: var(--bg-surface-hover);
}

.nav-prev:hover {
  transform: translateX(-4px);
}

.nav-next:hover {
  transform: translateX(4px);
  text-align: right;
}

.nav-next {
  text-align: right;
}

.nav-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nav-title {
  font-family: var(--font-serif);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.nav-card:hover .nav-title {
  color: var(--accent);
}

.nav-empty {
  pointer-events: none;
  opacity: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .toc-sidebar {
    display: none;
  }

  .article-body {
    display: block;
  }

  .header-cover {
    width: 120px;
    height: 90px;
  }
}

@media (max-width: 768px) {
  .article-detail {
    padding: 24px 0 60px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-cover {
    display: none;
  }

  .type-badge {
    display: block;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .article-title {
    text-align: center;
  }

  .article-meta {
    justify-content: center;
  }

  .article-nav {
    grid-template-columns: 1fr;
  }

  .nav-next {
    text-align: left;
  }

  .nav-next:hover {
    transform: translateX(4px);
  }
}
</style>
