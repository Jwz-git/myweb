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
          :key="article.id"
          :to="`/article/${article.id}`"
          class="article-card"
        >
          <div class="article-card-body">
            <div class="article-card-top">
              <span class="type-badge" :class="article.type === '技术' ? 'type-tech' : 'type-essay'">
                {{ article.type }}
              </span>
              <span class="article-card-date">{{ article.date }}</span>
            </div>
            <h3 class="article-card-title">{{ article.title }}</h3>
            <div class="article-card-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
import { articles } from '../data/articles.js'

const searchQuery = ref('')
const activeTag = ref('')
const currentPage = ref(1)
const perPage = 5

const allTags = computed(() => {
  const tags = new Set()
  articles.forEach(a => a.tags.forEach(t => tags.add(t)))
  return [...tags].sort()
})

const filteredArticles = computed(() => {
  let result = articles

  if (activeTag.value) {
    result = result.filter(a => a.tags.includes(activeTag.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
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

watch([searchQuery, activeTag], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.article-list-page {
  padding: 48px 0 80px;
}

.page-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

/* Search */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 42px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--accent);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  padding: 4px;
  display: flex;
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--text-primary);
}

/* Tag Filter */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.tag-filter-btn {
  padding: 5px 14px;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  transition: all var(--transition-fast);
}

.tag-filter-btn:hover {
  color: var(--text-secondary);
  border-color: var(--border-primary);
}

.tag-filter-btn.active {
  color: var(--accent);
  background: var(--accent-muted);
  border-color: rgba(201, 169, 110, 0.3);
}

/* Article Cards */
.articles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  border-left: 3px solid transparent;
  transition: all var(--transition-normal);
  gap: 16px;
}

.article-card:hover {
  background: var(--bg-surface-hover);
  border-left-color: var(--accent);
  transform: translateX(4px);
}

.article-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.article-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.type-tech {
  background: var(--accent-muted);
  color: var(--accent);
}

.type-essay {
  background: rgba(120, 140, 200, 0.12);
  color: #8b9dc3;
}

.article-card-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  transition: color var(--transition-fast);
}

.article-card:hover .article-card-title {
  color: var(--accent);
}

.article-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-pill {
  font-size: 0.7rem;
  padding: 1px 7px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border-radius: 4px;
}

.article-card-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.arrow-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.article-card:hover .arrow-icon {
  color: var(--accent);
  transform: translateX(3px);
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  color: var(--text-muted);
  opacity: 0.4;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-num {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.page-num:hover:not(:disabled):not(.dots) {
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.page-num.active {
  color: var(--accent);
  background: var(--accent-muted);
  border-color: rgba(201, 169, 110, 0.3);
}

.page-num.dots {
  border: none;
  background: none;
  cursor: default;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .article-list-page {
    padding: 36px 0 60px;
  }

  .article-card {
    padding: 14px 16px;
  }

  .pagination {
    gap: 4px;
  }

  .page-btn {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
}
</style>
