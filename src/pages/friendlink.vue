<template>
  <div class="friendlink-page page-enter">
    <div class="container">
      <h1 class="page-title">友情链接</h1>
      <p class="page-desc">志同道合的朋友们的博客。</p>

      <div class="friend-grid">
        <a
          v-for="link in friendLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-card"
        >
          <div class="friend-avatar">
            <img :src="link.avatar" :alt="link.name" loading="lazy" />
          </div>
          <div class="friend-info">
            <h3 class="friend-name">{{ link.name }}</h3>
            <p class="friend-desc">{{ link.description }}</p>
          </div>
          <svg class="friend-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      <!-- Exchange -->
      <div class="exchange-section">
        <div class="exchange-inner">
          <h3 class="exchange-title">交换友链</h3>
          <p class="exchange-desc">
            欢迎交换友链！请在评论区或通过邮件联系我，提供以下信息：
          </p>
          <ul class="exchange-list">
            <li>博客名称</li>
            <li>博客地址</li>
            <li>博客描述</li>
            <li>头像链接</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { friendLinks } from '../data/friendlink.js'
</script>

<style scoped>
.friendlink-page {
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
  margin-bottom: 36px;
}

/* Grid */
.friend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.friend-card:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border-subtle);
  transition: border-color var(--transition-fast);
}

.friend-card:hover .friend-avatar {
  border-color: var(--accent);
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  transition: color var(--transition-fast);
}

.friend-card:hover .friend-name {
  color: var(--accent);
}

.friend-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-normal);
}

.friend-card:hover .friend-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--accent);
}

/* Exchange */
.exchange-section {
  border-top: 1px solid var(--border-subtle);
  padding-top: 40px;
}

.exchange-inner {
  max-width: 520px;
}

.exchange-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.exchange-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.7;
}

.exchange-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.exchange-list li {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding-left: 16px;
  position: relative;
}

.exchange-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 768px) {
  .friendlink-page {
    padding: 36px 0 60px;
  }

  .friend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
