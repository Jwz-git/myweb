<template>
  <NavBar />
  <div class="scroll">
    <div class="container">
      <div class="content-card">
        <ul class="article-list">
          <li v-for="article in articles" :key="article.id" class="article-item" @click="goToArticle(article.id)"
            title="阅读本文">
            <div>
              <h3 class="article-title" @click="stopBubble(event)">
                {{ article.title }}
              </h3>

              <div class="article-tags" @click="stopBubble(event)">
                <span v-for="tag in article.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>

              <div class="article-meta" @click="stopBubble(event)">
                <span>
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
                  {{ article.date }}
                </span>
              </div>
            </div>
            <img :src="article.image" alt="图片加载失败" class="article-image">
          </li>
        </ul>
      </div>
      <div class="button-container">
        <Back />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
import { useRouter } from 'vue-router'
import { articles } from '../data/articles.js'

const router = useRouter()
// 点击卡片跳转方法
const goToArticle = (id) => {
  router.push(`/Article/${id}`)
}

function stopBubble(event) {
  event = event || window.event; // 兼容旧浏览器
  if (event.stopPropagation) {
    event.stopPropagation(); // 标准浏览器
  } else {
    event.cancelBubble = true; // IE旧版本（可选，现代浏览器无需）
  }
}
</script>

<style scoped>
@import '../css/pages/article.css';
</style>