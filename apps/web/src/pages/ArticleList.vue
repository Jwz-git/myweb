<template>
  <div class="article-list-page page-enter">
    <div class="container">
      <h1 class="page-title">文章</h1>
      <p class="page-desc">记录学习与思考，技术笔记与生活随笔。</p>

      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索文章标题或标签..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="tag-filter" aria-label="分类和年份筛选">
        <button v-for="type in allTypes" :key="type" class="tag-filter-btn" :class="{ active: activeType === type }" @click="activeType = activeType === type ? '' : type">{{ type }}</button>
        <button v-for="year in allYears" :key="year" class="tag-filter-btn" :class="{ active: activeYear === year }" @click="activeYear = activeYear === year ? '' : year">{{ year }}</button>
      </div>

      <!-- Tag Filter -->
      <div class="tag-filter">
        <button
          class="tag-filter-btn"
          :class="{ active: activeTag === '' }"
          @click="activeTag = ''"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-filter-btn"
          :class="{ active: activeTag === tag }"
          @click="activeTag = activeTag === tag ? '' : tag"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Articles -->
      <div class="articles" v-if="pagedArticles.length > 0">
        <router-link
          v-for="article in pagedArticles"
          :key="article.slug"
          :to="`/articles/${article.slug}`"
          class="article-card"
        >
          <div class="article-card-body">
            <div class="article-card-top">
              <span class="type-badge" :class="article.type === '知识' ? 'type-tech' : 'type-essay'">
                {{ article.type }}
              </span>
              <span class="article-card-date">发布 {{ article.date }} · 修改 {{ article.updated || article.date }}</span>
            </div>
            <h3 class="article-card-title">{{ article.title }}</h3>
            <p class="article-card-summary">{{ article.summary }}</p>
            <div class="article-card-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>
          <div class="article-card-media">
            <img v-if="article.cover" :src="assetUrl(article.cover)" :alt="article.title" loading="lazy" :style="{ objectPosition: article.coverPosition || 'center' }" />
          </div>
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </router-link>
      </div>

      <!-- Empty -->
      <div class="empty-state" v-else>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <p class="empty-text">没有找到匹配的文章</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-num"
            :class="{ active: p === currentPage, dots: p === '...' }"
            :disabled="p === '...'"
            @click="p !== '...' && (currentPage = p)"
          >
            {{ p }}
          </button>
        </div>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { publishedArticles as articles } from '../composables/useManagedArticles.js'
import { assetUrl } from '../utils/assets.js'

const route = useRoute()
const router = useRouter()
const searchQuery = ref(String(route.query.q || ''))
const activeTag = ref(String(route.query.tag || ''))
const activeType = ref(String(route.query.type || ''))
const activeYear = ref(String(route.query.year || ''))
const activeSeries = ref(String(route.query.series || ''))
const currentPage = ref(Number(route.query.page) || 1)
const perPage = 5

const allTags = computed(() => {
  const tags = new Set()
  articles.value.forEach(a => a.tags.forEach(t => tags.add(t)))
  return [...tags].sort()
})
const allTypes = computed(() => [...new Set(articles.value.map(article => article.type))].sort())
const allYears = computed(() => [...new Set(articles.value.map(article => article.date.slice(0,4)))].sort().reverse())

const filteredArticles = computed(() => {
  let result = articles.value

  if (activeTag.value) {
    result = result.filter(a => a.tags.includes(activeTag.value))
  }
  if (activeType.value) result = result.filter(a => a.type === activeType.value)
  if (activeYear.value) result = result.filter(a => a.date.startsWith(activeYear.value))
  if (activeSeries.value) result = result.filter(a => a.series === activeSeries.value)

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) || a.summary.toLowerCase().includes(q) || a.searchText.includes(q)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / perPage))

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredArticles.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

watch([searchQuery, activeTag, activeType, activeYear, activeSeries], () => {
  currentPage.value = 1
})
watch([searchQuery, activeTag, activeType, activeYear, activeSeries, currentPage], () => {
  const query = { q: searchQuery.value || undefined, tag: activeTag.value || undefined, type: activeType.value || undefined, year: activeYear.value || undefined, series: activeSeries.value || undefined, page: currentPage.value > 1 ? currentPage.value : undefined }
  router.replace({ query })
})
</script>

<style scoped src="../styles/article-list.css"></style>
