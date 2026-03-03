<template>
    <NavBar />
    <div class="scroll">
        <div class="title-container">
            <h1 class="article-title">
                {{ article.title }}
            </h1>
            <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag">
                    {{ tag }}
                </span>
            </div>
            <div class="article-meta">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-time" width="24"
                    height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round" data-v-26cf2bfd="">
                    <path stroke="none" d="M0 0h24v24H0z" data-v-26cf2bfd=""></path>
                    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"
                        data-v-26cf2bfd=""></path>
                    <circle cx="18" cy="18" r="4" data-v-26cf2bfd=""></circle>
                    <path d="M15 3v4" data-v-26cf2bfd=""></path>
                    <path d="M7 3v4" data-v-26cf2bfd=""></path>
                    <path d="M3 11h16" data-v-26cf2bfd=""></path>
                    <path d="M18 16.496v1.504l1 1" data-v-26cf2bfd="">
                    </path>
                </svg>
                <span>{{ article.date }}</span>
            </div>
        </div>

        <div class="article-detail-container">
            <aside class="toc-container" :class="{ collapsed: !tocExpanded }">
                <h2 class="toc-title" @click="tocExpanded ? null : toggleToc()">
                    <span class="toc-title-text" @click.stop="toggleArticleList">{{ showArticleList ? '文章目录' : '页内导航' }}</span>
                    <span class="toc-toggle-icon toc-collapse-icon" @click.stop="toggleToc">◀</span>
                    <span class="toc-toggle-icon toc-expand-icon" @click.stop="toggleToc">▶</span>
                </h2>
                <!-- 页内导航 -->
                <div v-if="!showArticleList && tocExpanded" class="toc-items toc-headings">
                    <button v-for="heading in headings" :key="heading.id" class="toc-item toc-heading-item"
                        :class="`toc-heading-level-${heading.level}`" @click="scrollToHeading(heading.id)">
                        {{ heading.text }}
                    </button>
                </div>
                <!-- 全部文章列表 -->
                <div v-if="showArticleList && tocExpanded" class="toc-items">
                    <button v-for="item in articles" :key="item.id" class="toc-item"
                        :class="{ active: item.id === article.id }" @click="goToArticle(item.id)">
                        {{ item.title }}
                    </button>
                </div>
            </aside>

            <div class="content-card">
                <div class="article-content" v-html="articleContent"></div>
            </div>
        </div>

        <div class="button-container">
            <div class="prev-next-buttons" v-if="isMobile">
                <RouterLink v-if="prevArticle" :to="`/article/${prevArticle.id}`" class="custom-btn prev-btn" title="上一篇">
                    <button class="button">
                        <div class="state">
                            <p>
                                <span style="--i:0"> <i class="btn-icon"></i></span>
                                <span style="--i:0"><a class="temp">4</a></span>
                                <span style="--i:1">上</span>
                                <span style="--i:2">一</span>
                                <span style="--i:3">篇</span>
                            </p>
                        </div>
                    </button>
                </RouterLink>
                <Back text="返回" to="/article" />
                <RouterLink v-if="nextArticle" :to="`/article/${nextArticle.id}`" class="custom-btn next-btn" title="下一篇">
                    <button class="button">
                        <div class="state">
                            <p>
                                <span style="--i:0"> <i class="btn-icon next-icon"></i></span>
                                <span style="--i:0"><a class="temp">4</a></span>
                                <span style="--i:1">下</span>
                                <span style="--i:2">一</span>
                                <span style="--i:3">篇</span>
                            </p>
                        </div>
                    </button>
                </RouterLink>
            </div>
            <div class="desktop-back-btn" v-else>
                <Back text="返回" to="/article" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
import MarkdownIt from 'markdown-it';
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import hljs from 'highlight.js'
import CodeCopy from '../components/CodeCopy.vue'
// 新增：导入Vue3动态创建组件的工具
import { createVNode, render } from 'vue'

// 数学公式渲染
import 'highlight.js/styles/github-dark.css'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import 'katex/dist/katex.min.css'

const route = useRoute()
const router = useRouter()
import { articles } from '../data/articles.js'

const article = ref({
    title: '文章不存在',
    date: '',
    tags: [],
    mdPath: '',
    id: -1
})

const articleContent = ref('');
const headings = ref([]);

const isMobile = ref(window.innerWidth <= 1024);
const tocExpanded = ref(!isMobile.value);
const prevArticle = ref(null);
const nextArticle = ref(null);
const showArticleList = ref(false);

const handleResize = () => {
    isMobile.value = window.innerWidth <= 1024;
    if (!isMobile.value) {
        tocExpanded.value = true;
    }
};

const toggleToc = () => {
    tocExpanded.value = !tocExpanded.value;
};

const toggleArticleList = () => {
    showArticleList.value = !showArticleList.value;
};

const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
        const scrollContainer = document.querySelector('.scroll');

        if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const middleOffset = scrollContainer.clientHeight / 3;

            let scrollPosition = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - middleOffset;
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

            scrollPosition = Math.min(scrollPosition, maxScroll);
            scrollPosition = Math.max(scrollPosition, 0);

            scrollContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            return;
        }

        // 兜底：当页面没有使用内部滚动容器时，回退到 window 滚动
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middleOffset = window.innerHeight / 3;
        let scrollPosition = absoluteElementTop - middleOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        scrollPosition = Math.min(scrollPosition, maxScroll);
        scrollPosition = Math.max(scrollPosition, 0);

        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }
};

const updatePrevNextArticles = (currentId) => {
    const currentIndex = articles.findIndex(a => a.id === Number(currentId));
    prevArticle.value = currentIndex > 0 ? articles[currentIndex - 1] : null;
    nextArticle.value = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: false,
    typographer: false,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                // 使用指定语言高亮
                const result = hljs.highlight(str, { language: lang });
                return `<pre class="hljs"><code class="language-${lang}">${result.value}</code></pre>`;
            } catch (__) {
                console.error('Highlight error:', __);
            }
        }
        // 没有指定语言或高亮失败，使用自动高亮
        try {
            const result = hljs.highlightAuto(str);
            return `<pre class="hljs"><code>${result.value}</code></pre>`;
        } catch (__) {
            console.error('Auto highlight error:', __);
        }
        // 最终降级方案
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

// 自定义链接渲染器，添加 target="_blank" 属性
const defaultLinkRenderer = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  // 添加 target="_blank" 和 rel="noopener noreferrer" 属性
  tokens[idx].attrPush(['target', '_blank']);
  tokens[idx].attrPush(['rel', 'noopener noreferrer']);
  
  // 添加自定义的 class 用于样式控制
  tokens[idx].attrPush(['class', 'md-link']);
  
  return defaultLinkRenderer(tokens, idx, options, env, self);
};

md.use(markdownItKatex);

// 提取文章中的标题并添加锚点
const extractHeadings = (htmlContent) => {
    let processedHtml = htmlContent;
    const extractedHeadings = [];
    let index = 0;

    // 使用正则表达式匹配标题标签并添加ID
    // 使用更宽松的匹配，支持标题中包含其他标签
    processedHtml = processedHtml.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, text) => {
        const id = `heading-${index++}`;
        const level = parseInt(tag[1]);
        // 提取纯文本内容（去除HTML标签）
        const plainText = text.replace(/<[^>]*>/g, '').trim();
        extractedHeadings.push({
            id: id,
            text: plainText,
            level: level
        });
        return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
    });

    return {
        html: processedHtml,
        headings: extractedHeadings
    };
};

//为代码块添加复制按钮
const addCopyButtons = () => {
    const preElements = document.querySelectorAll('pre.hljs:not(.code-copy-added)');
    console.log('找到pre元素数量:', preElements.length);

    preElements.forEach((el, index) => {
        console.log(`处理第 ${index + 1} 个pre元素`);

        const codeElement = el.querySelector('code');
        const code = codeElement ? codeElement.innerText : el.innerText;

        const container = document.createElement('div');
        container.className = 'copy-content';
        el.style.position = 'relative';
        el.style.paddingTop = '40px';
        el.appendChild(container);

        const vnode = createVNode(CodeCopy, { code });
        render(vnode, container);

        el.classList.add('code-copy-added');
    });
};

const goToArticle = (id) => {
    if (id === article.value.id) {
        return;
    }
    router.push(`/article/${id}`);
};

const loadArticle = async (id) => {
    const currentArticle = articles.find(a => a.id === Number(id));

    if (!currentArticle) {
        article.value = {
            title: '文章不存在',
            date: '',
            tags: [],
            mdPath: '',
            id: -1
        };
        articleContent.value = '<div style="padding: 2rem;">该文章已被移除或不存在</div>';
        headings.value = [];
        showArticleList.value = true;
        updatePrevNextArticles(id);
        return;
    }

    article.value = currentArticle;
    updatePrevNextArticles(id);

    try {
        const response = await fetch(currentArticle.mdPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let mdText = await response.text();

        // 手动处理 ~~ 删除线标记，避免渲染混乱
        mdText = mdText.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        const rawHtml = md.render(mdText);
        const { html, headings: extractedHeadings } = extractHeadings(rawHtml);
        articleContent.value = html;
        headings.value = extractedHeadings;
        showArticleList.value = extractedHeadings.length === 0;

        await nextTick();
        addCopyButtons();
    } catch (error) {
        console.error('加载 Markdown 文件出错:', error);
        headings.value = [];
        showArticleList.value = true;
        articleContent.value = `<div style="color: red; padding: 2rem;">加载文章失败：${error.message}</div>`;
    }
};

watch(() => route.params.id, async (newId) => {
    await loadArticle(newId);
}, {
    immediate: true
});
</script>

<style scoped>
@import '../css/components/back.css';

.prev-next-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.prev-btn, .next-btn {
    margin: 0;
}

.next-icon::before {
    content: '>';
}
</style>

<style>
.article-content pre.hljs {
    position: relative;
    margin: 0.75rem 0;
    padding: 3rem 1rem 1rem 1rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #1a1d23 0%, #0d1117 100%);
    border: 1px solid rgba(122, 240, 173, 0.15);
    box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(122, 240, 173, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    overflow-x: auto;
}

.article-content pre.hljs::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 16px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff5f56;
    box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
}

.article-content pre.hljs code {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    display: block !important;
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Monaco, 'Andale Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.7;
    letter-spacing: 0.02em;
}

.article-content pre.hljs::-webkit-scrollbar {
    height: 8px;
}

.article-content pre.hljs::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.article-content pre.hljs::-webkit-scrollbar-thumb {
    background: rgba(122, 240, 173, 0.3);
    border-radius: 4px;
}

.article-content pre.hljs::-webkit-scrollbar-thumb:hover {
    background: rgba(122, 240, 173, 0.5);
}

.article-content .md-link {
    text-decoration: none;
}

.article-content .md-link:hover {
    text-decoration: none;
}
</style>