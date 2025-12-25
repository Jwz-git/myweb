<template>
  <NavBar />
  <div class="scroll">
    <div class="container">
      <div class="search-container">
        <div class="search-box">
          <input type="text" v-model="searchKeyword" placeholder="搜索文章/标签..." class="search-input">
        </div>
      </div>
      <div class="content-card">
        <ul class="article-list">
          <li v-for="article in paginatedArticles" :key="article.id" class="article-item" @click="goToArticle(article.id)"
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
                    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" data-v-26cf2bfd=""></path>
                    <circle cx="18" cy="18" r="4" data-v-26cf2bfd=""></circle>
                    <path d="M15 3v4" data-v-26cf2bfd=""></path>
                    <path d="M7 3v4" data-v-26cf2bfd=""></path>
                    <path d="M3 11h16" data-v-26cf2bfd=""></path>
                    <path d="M18 16.496v1.504l1 1" data-v-26cf2bfd=""></path>
                  </svg>
                  {{ article.date }}
                </span>
              </div>
            </div>
            <img :src="article.image" alt="图片加载失败" class="article-image">
          </li>
        </ul>
        
        <!-- 分页组件 -->
        <div class="pagination" v-if="totalPages > 1">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
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
import { ref, computed, watch } from 'vue'
import { articles } from '../data/articles.js'

const router = useRouter()

// 搜索关键字
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)

// 点击卡片跳转方法
const goToArticle = (id) => {
  router.push(`/Article/${id}`)
}

// 搜索过滤文章
const filteredArticles = computed(() => {
  if (!searchKeyword.value.trim()) {
    return articles
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  return articles.filter(article => {
    // 检查标题是否包含关键字
    const titleMatch = article.title.toLowerCase().includes(keyword)
    // 检查标签是否包含关键字
    const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(keyword))
    
    return titleMatch || tagMatch
  })
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / pageSize.value)
})

// 当前页显示的文章
const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredArticles.value.slice(startIndex, endIndex)
})

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 搜索时重置页码
watch(searchKeyword, () => {
  currentPage.value = 1
})

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