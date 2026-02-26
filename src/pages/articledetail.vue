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
            <!-- 文章内容 -->
            <div class="content-card">
                <div class="article-content" v-html="articleContent"></div>
            </div>
        </div>

        <div class="button-container">
            <Back text="返回" to="/article" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
import MarkdownIt from 'markdown-it';
import { ref, onMounted, nextTick } from 'vue';
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



onMounted(async () => {
    try {
        const response = await fetch(article.value.mdPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mdText = await response.text();

        // 渲染Markdown
        articleContent.value = md.render(mdText);

        // 等待DOM更新后添加复制按钮
        await nextTick();
        addCopyButtons();
    } catch (error) {
        console.error('加载 Markdown 文件出错:', error);
        articleContent.value = `<div style="color: red; padding: 2rem;">加载文章失败：${error.message}</div>`;
    }
});
</script>

<style scoped>
@import '../css/pages/article-detail.css';
</style>