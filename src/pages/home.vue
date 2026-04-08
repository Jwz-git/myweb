<template>
  <div class="home page-enter">
    <div class="container">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero-title">你好，我是 Jwz</h1>
        <p class="hero-subtitle">一个喜欢折腾的学生，偶尔写写代码，偶尔发发牢骚。</p>
      </section>

      <!-- Stats -->
      <section class="stats">
        <div class="stat-item">
          <span class="stat-number">{{ articles.length }}</span>
          <span class="stat-label">篇文章</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ uniqueTagsCount }}</span>
          <span class="stat-label">个标签</span>
        </div>
      </section>

      <!-- Recent Articles -->
      <section class="recent-section">
        <h2 class="section-title">最近文章</h2>
        <div class="recent-list">
          <router-link v-for="article in recentArticles" :key="article.id" :to="`/article/${article.id}`"
            class="recent-card">
            <div class="recent-card-header">
              <span class="type-badge" :class="article.type === '技术' ? 'type-tech' : 'type-essay'">
                {{ article.type }}
              </span>
              <span class="recent-date">{{ article.date }}</span>
            </div>
            <h3 class="recent-title">{{ article.title }}</h3>
            <div class="recent-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </router-link>
        </div>
        <router-link to="/article" class="view-all-link">
          查看全部文章 &rarr;
        </router-link>
      </section>

      <!-- Social Links -->
      <section class="social-section">
        <h2 class="section-title">找到我</h2>
        <div class="social-links">
          <a href="https://github.com/Jwz-git" target="_blank" rel="noopener noreferrer" class="social-card">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://space.bilibili.com/454733262" target="_blank" rel="noopener noreferrer" class="social-card">
            <svg width="22" height="22" viewBox="0 0 18 18" fill="currentColor">
              <path data-v-2b0eee96="" fill-rule="evenodd" clip-rule="evenodd"
                d="M3.73252 2.67094C3.33229 
                                        2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 
                                        10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 
                                        15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 
                                        14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 
                                        7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 
                                        11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path>
            </svg>
            <span>bilibili</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articles } from '../data/articles.js'

const recentArticles = computed(() => articles.slice(0, 3))

const uniqueTagsCount = computed(() => {
  const tags = new Set()
  articles.forEach(a => a.tags.forEach(t => tags.add(t)))
  return tags.size
})
</script>

<style scoped>
.home {
  padding: 60px 0 80px;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Stats */
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding: 24px 0;
  margin-bottom: 48px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-primary);
}

/* Section Title */
.section-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  letter-spacing: 0.02em;
}

/* Recent Articles */
.recent-section {
  margin-bottom: 48px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-card {
  display: block;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  border-left: 3px solid transparent;
}

.recent-card:hover {
  background: var(--bg-surface-hover);
  border-left-color: var(--accent);
  transform: translateX(4px);
}

.recent-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.type-badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.type-tech {
  background: var(--accent-muted);
  color: var(--accent);
}

.type-essay {
  background: rgba(120, 140, 200, 0.12);
  color: #8b9dc3;
}

.recent-date {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.recent-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  transition: color var(--transition-fast);
}

.recent-card:hover .recent-title {
  color: var(--accent);
}

.recent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-pill {
  font-size: 0.72rem;
  padding: 2px 8px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
}

.view-all-link {
  display: inline-block;
  margin-top: 16px;
  font-size: 0.88rem;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.view-all-link:hover {
  color: var(--accent);
}

/* Social */
.social-section {
  margin-bottom: 32px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all var(--transition-normal);
}

.social-card:hover {
  color: var(--text-primary);
  border-color: var(--border-primary);
  background: var(--bg-surface-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .home {
    padding: 40px 0 60px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .social-links {
    flex-direction: column;
  }
}
</style>
