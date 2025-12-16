<template>
    <NavBar />
    <div class="scroll">
        <div class="title-container" style="transform: translateY(-5rem);">
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
        <div class="content-card">
            <div class="article-content" v-html="articleContent"></div>
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
import { ref, onMounted } from 'vue';
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
                const result = hljs.highlightAuto(str, [lang]);
                return `<pre class="hljs"><code class="language-${lang}">${result.value}</code></pre>`;
            } catch (__) { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

md.use(markdownItKatex);

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
}

onMounted(async () => {
    try {
        const response = await fetch(article.value.mdPath);
        const mdText = await response.text();
        articleContent.value = md.render(mdText);

        // 直接添加复制按钮，无需再次高亮
        addCopyButtons();
    } catch (error) {
        console.error('加载 Markdown 文件出错:', error);
    }
});
</script>

<style scoped>
@import '../css/pages/article-detail.css';
</style>