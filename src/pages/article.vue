<template>
  <NavBar />
  <div class="stroll">
    <div class="container">
      <div class="content-card">
        <ul class="article-list">
          <li v-for="article in articles" :key="article.id" class="article-item" @click="goToArticle(article.id)"
            title="阅读本文">
            <div>
              <h3 class="article-title" @click="stopBubble(event)">
                {{ article.title }}
              </h3>

              <div class="article-tags" @click="stopBubble(event)">
                <span v-for="tag in article.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>

              <div class="article-meta" @click="stopBubble(event)">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-time" width="24"
                    height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round" data-v-26cf2bfd="">
                    <path stroke="none" d="M0 0h24v24H0z" data-v-26cf2bfd=""></path>
                    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"
                      data-v-26cf2bfd=""></path>
                    <circle cx="18" cy="18" r="4" data-v-26cf2bfd=""></circle>
                    <path d="M15 3v4" data-v-26cf2bfd=""></path>
                    <path d="M7 3v4" data-v-26cf2bfd=""></path>
                    <path d="M3 11h16" data-v-26cf2bfd=""></path>
                    <path d="M18 16.496v1.504l1 1" data-v-26cf2bfd="">
                    </path>
                  </svg>
                  {{ article.date }}
                </span>
              </div>
            </div>
            <img :src="article.image" alt="图片加载失败" class="article-image">
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
import { useRouter } from 'vue-router'
import { articles } from '../data/articles.js'

const router = useRouter()
// 点击卡片跳转方法
const goToArticle = (id) => {
  router.push(`/Article/${id}`)
}

function stopBubble(event) {
  event = event || window.event; // 兼容旧浏览器
  if (event.stopPropagation) {
    event.stopPropagation(); // 标准浏览器
  } else {
    event.cancelBubble = true; // IE旧版本（可选，现代浏览器无需）
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

.article-item::after {
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

.article-item:hover::after {
  width: 100%;
}

.article-item:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.article-title {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: linear-gradient(120deg, aqua 0%, #7af0ad 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: SimSun;
  font-weight: bolder;
  color: #e0e0e0;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}

.article-title:hover {
  cursor: default;
  transform: translateY(-2px);
  font-size: 1.3rem;
}

/* 标签样式 */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.tag {
  background: linear-gradient(145deg, rgba(92, 219, 149, 0.2) 0%, rgba(52, 152, 219, 0.2) 100%);
  color: #7af0ad;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(122, 240, 173, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.tag:hover {
  cursor: default;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(122, 240, 173, 0.3);
  background: linear-gradient(145deg, rgba(92, 219, 149, 0.3) 0%, rgba(52, 152, 219, 0.3) 100%);
  font-size: 0.95rem;
}

.article-meta {
  cursor: default;
  color: #7ebac7;
  font-size: 1rem;
  display: flex;
  gap: 1rem;
}


.article-image {
  color: #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: linear-gradient(120deg, aqua 0%, #7af0ad 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 140px;
  height: 120px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.article-image:hover {
  width: 150px;
  height: 130px;
}

.button-container {
  margin-top: auto;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto 0;
  display: flex;
  justify-content: center;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .article-item {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.1rem;
  }

  .content-card {
    width: 100%;
  }

  .article-image {
    width: 110px;
    height: 100px;
  }

  .tag {
    padding: 3px 10px;
    font-size: 0.8rem;
  }

  .article-tags {
    gap: 6px;
    margin: 8px 0;
  }
}
</style>