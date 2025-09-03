<template>
    <NavBar />
    <div class="stroll">
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
        <!-- <div class="container"> -->
        <div class="content-card">
            <div class="article-content" v-html="articleContent"></div>
        </div>

        <div class="button-container">
            <Back text="返回" to="/Article" />
        </div>
        <!-- </div> -->
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
    html: true
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

/* .container {
    margin-top: -3rem;
    padding: 0;
    height: calc(120vh - 240px);
    scroll-behavior: smooth;
} */

.content-card {
    padding: 0;
    height: auto;
    scroll-behavior: smooth;
    min-height: 70vh;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2px);
    border-radius: 12px;
    padding: 1rem 2rem 1rem 2rem;
    margin: -3% auto 0 auto;
    max-width: 60%;
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

/* 标签样式 */
.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3%;
    margin: 12px 0;
    justify-content: center;
}

.tag {
    margin: -1%;
    text-align: center;
    background: linear-gradient(145deg, rgba(92, 219, 149, 0.2) 0%, rgba(52, 152, 219, 0.2) 100%);
    color: #7af0ad;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(122, 240, 173, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122, 240, 173, 0.3);
    background: linear-gradient(145deg, rgba(92, 219, 149, 0.3) 0%, rgba(52, 152, 219, 0.3) 100%);
}

.article-meta {
    margin: 2% auto;
    text-align: center;
    color: #9e9e9e;
    margin-bottom: 2rem;
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
    justify-content: center;
}

.article-content {
    color: #d0d0d0;
    line-height: 1.8;
    font-size: 1.1rem;
    /* margin-bottom: 4rem; */
    white-space: pre-wrap;
    overflow-x: auto;
    max-width: 100%;
}

.button-container {
    margin-top: 2rem;
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

    .content-card {
        max-width: 100%;
        margin: -10% auto;
    }

    .tag {
        padding: 3px 10px;
        font-size: 0.8rem;
    }

    .article-tags {
        gap: 13%;
    }

    .article-meta {
        gap: 5%;

    }

}

@media (max-width: 900px) {
    .content-card {
        max-width: 100%;
        margin: -8% auto;
    }

    .article-title{
        width: 200%;
        margin: auto auto auto -50%;

    }

    .tag {
        padding: 3px 10px;
        font-size: 0.8rem;
    }

    .article-tags {
        gap: 5%;
    }

}
</style>