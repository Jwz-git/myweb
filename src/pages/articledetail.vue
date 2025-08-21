<template>
    <NavBar />
    <div class="stroll">
        <div class="title-container" style="transform: translateY(-5rem);">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
                <span>{{ article.date }}</span>
            </div>
        </div>
        <div class="container">
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
import { ref, onMounted } from 'vue';

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
});

onMounted(async () => {
    try {
        const response = await fetch(article.value.mdPath);
        const mdText = await response.text();
        articleContent.value = md.render(mdText);
    } catch (error) {
        console.error('加载 Markdown 文件出错:', error);
    }
});
</script>

<style scoped>
.stroll {
    padding: 0;
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: auto;
    padding: 6rem 1rem 2rem;
}

.stroll::-webkit-scrollbar {
    width: 3px;
    height: 16px;
    background-color: #383333;
}

.stroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgb(27, 23, 23);
}

.stroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #4e5153;
}

.stroll::-webkit-scrollbar-thumb:hover {
    border-radius: 10px;
    background-color: #acb3b7;
}

.title-container {
    transform: translateY(-5rem);
    height: 10vh;
    padding: 6rem;
}

.container {
    transform: translateY(-5rem);
    padding: 0;
    height: calc(120vh - 240px);
    scroll-behavior: smooth;
}

.content-card {
    min-height: 70%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2px);
    border-radius: 12px;
    padding: 1rem 2rem 1rem 2rem;
    margin: 0 auto;
    max-width: 70%;
    animation: fadeIn 0.6s ease-out;
}

.article-title {
    font-weight: bolder;
    font-family: SimSun;
    font-size: 2rem;
    color: #e0e0e0;
    margin-bottom: 1.5rem;
    background: linear-gradient(120deg, rgb(255, 255, 255) 0%, #7af0ad 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
}

.article-meta {
    color: #9e9e9e;
    margin-bottom: 2rem;
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
    justify-content: center;
}

.article-content {
    color: #d0d0d0;
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 3rem;
    white-space: pre-wrap;
    overflow-x: auto;
    max-width: 100%;
}

.button-container {
    transform: translateY(-5rem);
    margin-top: auto;
    width: 100%;
    max-width: 800px;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
}

@media (max-width: 768px) {
    .nav-link {
        margin: 0.5rem 0;
        text-align: center;
    }
}

@media (max-width: 900px) {
    .content-card {
        max-width: 100%;
    }
}
</style>