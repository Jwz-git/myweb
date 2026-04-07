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
          <router-link
            v-for="article in recentArticles"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="recent-card"
          >
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
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://space.bilibili.com/454733262" target="_blank" rel="noopener noreferrer" class="social-card">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM9.333 11.333c-.746 0-1.333-.6-1.333-1.333 0-.733.587-1.333 1.333-1.333s1.334.6 1.334 1.333c0 .734-.588 1.334-1.334 1.334zm5.334 0c-.746 0-1.334-.6-1.334-1.333 0-.733.588-1.333 1.334-1.333.746 0 1.333.6 1.333 1.333 0 .734-.587 1.334-1.333 1.334z"/>
            </svg>
            <span>Bilibili</span>
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
