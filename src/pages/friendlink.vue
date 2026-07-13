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

<style scoped src="../styles/friendlink.css"></style>
