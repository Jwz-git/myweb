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

const router = useRouter()

const goHome = () => {
  router.push('/Home')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}



/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 600px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 404标题 */
.not-found-title {
  font-size: 12rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(45deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 副标题 */
.not-found-subtitle {
  font-size: 2.5rem;
  color: #303133;
  margin: 1rem 0;
  font-weight: 600;
}

/* 描述文本 */
.not-found-desc {
  font-size: 1.25rem;
  color: #606266;
  margin: 1rem 0 2.5rem;
  line-height: 1.6;
}

/* 返回按钮 */
.not-found-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #409eff, #67c23a);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
}

.not-found-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.4);
  background: linear-gradient(45deg, #66b1ff, #85ce61);
}

.not-found-btn:active {
  transform: translateY(-1px);
}

/* 按钮图标 */
.btn-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.not-found-btn:hover .btn-icon {
  transform: translateX(-3px);
}

/* 装饰性文字 */
.decorative-text {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.1);
  font-weight: 900;
  letter-spacing: 10px;
  text-transform: uppercase;
  z-index: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-title {
    font-size: 8rem;
  }
  
  .not-found-subtitle {
    font-size: 2rem;
  }
  
  .not-found-desc {
    font-size: 1.1rem;
  }
  
  .not-found-btn {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
  
  .circle {
    opacity: 0.08;
  }
  
  .circle-1 {
    width: 200px;
    height: 200px;
  }
  
  .circle-2 {
    width: 150px;
    height: 150px;
  }
  
  .circle-3 {
    width: 100px;
    height: 100px;
  }
}
</style>