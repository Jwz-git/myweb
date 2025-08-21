<template>
  <NavBar />
  <div class="stroll">
    <div class="container">
      <div class="content-card">
        <ul class="article-list">
          <li v-for="article in articles" :key="article.id" class="article-item">
            <div>
              <h3 class="article-title">
                <RouterLink :to="`/Article/${article.id}`" class="article-link" :title="article.title">
                  {{ article.title }}
                </RouterLink>
              </h3>
              <div class="article-meta">
                <span>{{ article.date }}</span>
              </div>
            </div>
            <RouterLink :to="`/Article/${article.id}`" class="article-link">
              <img :src="article.image" alt="图片加载失败" class="article-image" title="阅读本文">
            </RouterLink>
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
</script>

<script>
import { articles } from '../data/articles.js'

export default {
  data() {
    return {
      articles: articles.reverse()
    }
  }
}
</script>

<style scoped>
.stroll {
  padding: 0;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: auto;
  padding: 6rem 1rem 2rem;
}

.stroll::-webkit-scrollbar {
  width: 3px;
  height: 16px;
  background-color: #383333;
}

.stroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(27, 23, 23);
}

.stroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #4e5153;
}

.stroll::-webkit-scrollbar-thumb:hover {
  border-radius: 10px;
  background-color: #acb3b7;
}

.article-link {
  color: #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: linear-gradient(120deg, aqua 0%, #7af0ad 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.article-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgb(221, 243, 115) 0%, #7af0ad 100%);
  transition: width 0.3s ease;
  z-index: -1;
}

.article-link:hover::after {
  width: 100%;
}

.container {
  min-height: 80vh;
  padding: 0rem 1rem;
}

.content-card {
  width: 60%;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(2px);
  max-width: 800px;
  margin: 0 auto;
}

.article-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.article-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.article-title {
  font-family: SimSun;
  font-weight: bolder;
  color: #e0e0e0;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}

.article-meta {
  color: #7eb1c7;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

.article-image {
  width: 140px;
  height: 120px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.button-container {
  margin-top: auto;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .article-item {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.1rem;
  }
  
  .content-card{
    width: 100%;
  }
  .article-image{
    width: 110px;
    height: 100px;
  }
}
</style>