<template>
  <NavBar />
  <div class="container">
    <div class="content-card">
      <ul class="article-list">
        <li v-for="article in articles" :key="article.id" class="article-item">
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-meta">
            <span>{{ article.date }}</span>
            <span>·</span>
            <span>{{ article.views }} 阅读</span>
          </div>
        </li>
      </ul>
      <BackButton />
    </div>
    <div class="button-container">
      <BackToHome />
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import BackToHome from '../components/BackToHome.vue'
</script>

<script>
export default {
  data() {
    return {
      articles: [
        { id: 1, title: '-', date: '-', views: 0 },
        { id: 2, title: '-', date: '-', views: 0 },
        { id: 3, title: '-', date: '-', views: 0 }
      ]
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 6rem 1rem;
}

.content-card {
    width: 60%;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 1s ease-out;
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
}

.article-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.article-title {
  color: #e0e0e0;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}

.article-meta {
  color: #9e9e9e;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .article-item {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.1rem;
  }
}

.button-container {
  margin-top: auto;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto 0;
  display: flex;
  justify-content: center;
}
</style>