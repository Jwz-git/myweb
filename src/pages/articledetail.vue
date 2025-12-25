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
            <!-- 文章目录 -->
            <div class="toc-container" v-if="toc.length > 0">
                <div class="toc-title">目录</div>
                <ul class="toc-list">
                    <li 
                        v-for="(item, index) in toc" 
                        :key="index" 
                        :class="['toc-item', `toc-level-${item.level}`, { active: activeTocIndex === index }]"
                        @click="scrollToSection(item.id)"
                    >
                        {{ item.text }}
                    </li>
                </ul>
            </div>
            
            <!-- 文章内容 -->
            <div class="content-card">
                <div class="article-content" v-html="articleContent"></div>
            </div>
        </div>

        <div class="button-container">
            <Back text="返回" to="/Article" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
import MarkdownIt from 'markdown-it';
import { ref, onMounted, watch } from 'vue';
import hljs from 'highlight.js'
import CodeCopy from '../components/CodeCopy.vue'
// 新增：导入Vue3动态创建组件的工具
import { createVNode, render } from 'vue'

// 数学公式渲染
import 'highlight.js/styles/github-dark.css'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import 'katex/dist/katex.min.css'

const route = useRoute()
const articleId = route.params.id
import { articles } from '../data/articles.js'

const article = ref(articles.find(a => a.id === parseInt(articleId)) || {
    title: '文章不存在',
    content: '该文章已被移除或不存在'
})

const articleContent = ref('');
const toc = ref([]); // 目录数据
const activeTocIndex = ref(0); // 当前激活的目录项索引
let observer = null; // 用于监听滚动的IntersectionObserver

// 生成唯一ID的函数
const generateId = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
};

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

md.use(markdownItKatex);

// 自定义Markdown渲染规则，为标题添加ID
md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const level = parseInt(token.tag.slice(1)); // h1 -> 1, h2 -> 2
    const nextToken = tokens[idx + 1];
    
    if (nextToken && nextToken.type === 'inline') {
        const text = md.utils.escapeHtml(nextToken.content);
        const id = generateId(text);
        token.attrSet('id', id);
        
        // 存储目录数据
        if (!env.toc) env.toc = [];
        env.toc.push({
            level,
            text,
            id
        });
    }
    
    // 使用默认渲染器或直接渲染
    return self.renderToken(tokens, idx, options);
};

//为代码块添加复制按钮
const addCopyButtons = () => {
    // 直接在markdown-it的highlight函数中添加复制按钮HTML，避免二次DOM操作
    const preElements = document.querySelectorAll('pre.hljs:not(.code-copy-added)');
    preElements.forEach(el => {
        // 创建复制按钮HTML
        const copyButtonHTML = `
            <div class="copy-content">
                <div class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('pre').innerText).then(() => {
                    const btn = this;
                    btn.innerHTML = '<svg class="icon success-icon" viewBox="0 0 1024 1024"><path d="M953.472 174.976L385.152 759.168l-275.328-282.794667-53.290667 50.346667L385.194667 857.6l616.021333-632.32z" fill="#4CAF50"></path></svg>';
                    setTimeout(() => {
                        btn.innerHTML = '<svg class="icon" viewBox="0 0 1024 1024"><path d="M96.1 575.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="aqua"></path><path d="M742.1 450.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.1 26-13.8 26-31s-11.7-31.3-26-31.4zM742.1 577.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.2 26-13.8 26-31s-11.7-31.3-26-31.4z" fill="aqua"></path><path d="M736.1 63.9H417c-70.4 0-128 57.6-128 128h-64.9c-70.4 0-128 57.6-128 128v128c-0.1 17.7 14.4 32 32.2 32 17.8 0 32.2-14.4 32.2-32.1V320c0-35.2 28.8-64 64-64H289v447.8c0 70.4 57.6 128 128 128h255.1c-0.1 35.2-28.8 63.8-64 63.8H224.5c-35.2 0-64-28.8-64-64V703.5c0-17.7-14.4-32.1-32.2-32.1-17.8 0-32.3 14.4-32.3 32.1v128.3c0 70.4 57.6 128 128 128h384.1c70.4 0 128-57.6 128-128h65c70.4 0 128-57.6 128-128V255.9l-193-192z m0.1 63.4l127.7 128.3H800c-35.2 0-64-28.8-64-64v-64.3h0.2z m64 641H416.1c-35.2 0-64-28.8-64-64v-513c0-35.2 28.8-64 64-64H671V191c0 70.4 57.6 128 128 128h65.2v385.3c0 35.2-28.8 64-64 64z" fill="aqua"></path></svg>';
                    }, 2000);
                })">
                    <svg class="icon" viewBox="0 0 1024 1024">
                        <path d="M96.1 575.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="aqua"></path>
                        <path d="M742.1 450.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.1 26-13.8 26-31s-11.7-31.3-26-31.4zM742.1 577.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.2 26-13.8 26-31s-11.7-31.3-26-31.4z" fill="aqua"></path>
                        <path d="M736.1 63.9H417c-70.4 0-128 57.6-128 128h-64.9c-70.4 0-128 57.6-128 128v128c-0.1 17.7 14.4 32 32.2 32 17.8 0 32.2-14.4 32.2-32.1V320c0-35.2 28.8-64 64-64H289v447.8c0 70.4 57.6 128 128 128h255.1c-0.1 35.2-28.8 63.8-64 63.8H224.5c-35.2 0-64-28.8-64-64V703.5c0-17.7-14.4-32.1-32.2-32.1-17.8 0-32.3 14.4-32.3 32.1v128.3c0 70.4 57.6 128 128 128h384.1c70.4 0 128-57.6 128-128h65c70.4 0 128-57.6 128-128V255.9l-193-192z m0.1 63.4l127.7 128.3H800c-35.2 0-64-28.8-64-64v-64.3h0.2z m64 641H416.1c-35.2 0-64-28.8-64-64v-513c0-35.2 28.8-64 64-64H671V191c0 70.4 57.6 128 128 128h65.2v385.3c0 35.2-28.8 64-64 64z" fill="aqua"></path>
                    </svg>
                </div>
            </div>
        `;
        
        // 直接插入HTML，避免创建Vue组件实例
        el.insertAdjacentHTML('beforeend', copyButtonHTML);
        el.classList.add('code-copy-added');
    });
};

// 生成目录并监听滚动
const generateTocAndSetupObserver = () => {
    // 清除旧的observer
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    
    // 获取所有标题元素
    const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
    
    if (headings.length === 0) {
        toc.value = [];
        return;
    }
    
    // 设置IntersectionObserver来监听标题可见性
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 找到当前可见标题在目录中的索引
                const headingId = entry.target.id;
                const index = toc.value.findIndex(item => item.id === headingId);
                if (index !== -1) {
                    activeTocIndex.value = index;
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px', // 调整触发阈值
        threshold: 0.1
    });
    
    // 观察每个标题
    headings.forEach(heading => {
        observer.observe(heading);
    });
};

// 滚动到指定章节
const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        const offsetTop = element.offsetTop;
        const container = document.querySelector('.scroll');
        container.scrollTo({
            top: offsetTop - 100, // 顶部留100px的边距
            behavior: 'smooth'
        });
    }
};

onMounted(async () => {
    try {
        const response = await fetch(article.value.mdPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const mdText = await response.text();
        
        // 渲染Markdown并获取目录数据
        const env = {};
        articleContent.value = md.render(mdText, env);
        toc.value = env.toc || [];
        
        // 直接添加复制按钮
        addCopyButtons();
        
        // 生成目录并设置滚动监听
        generateTocAndSetupObserver();
    } catch (error) {
        console.error('加载 Markdown 文件出错:', error);
        articleContent.value = `<div style="color: red; padding: 2rem;">加载文章失败：${error.message}</div>`;
    }
});

// 监听文章内容变化，重新生成目录
watch(articleContent, () => {
    generateTocAndSetupObserver();
});
</script>

<style scoped>
@import '../css/pages/article-detail.css';
</style>