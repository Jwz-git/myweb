<template>
  <div class="not-found-container">
    <!-- 404主内容区 -->
    <div class="content-wrapper">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-subtitle">Oops! 页面未找到</p>
      <p class="not-found-desc">抱歉，您访问的页面不存在或已被移除。让我们带您回到安全地带。</p>
      <button class="not-found-btn" @click="goHome">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        返回首页
      </button>
    </div>
    
    <!-- 装饰性文字 -->
    <div class="decorative-text">PAGE NOT FOUND</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import '../css/pages/404.css'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>