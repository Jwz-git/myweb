<template>
  <div class="home page-enter">
    <div class="container">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> PERSONAL FIELD NOTES · 2026</div>
          <h1 class="hero-title">在代码与生活的<br><em>缝隙里写字。</em></h1>
          <p class="hero-subtitle">你好，我是 Jwz。这里收集学习途中留下的技术笔记，也保存那些不太好归类的想法。</p>
          <div class="hero-actions">
            <router-link to="/articles" class="primary-action">翻阅文章 <span>↗</span></router-link>
            <router-link to="/about" class="text-action">认识我 <span>→</span></router-link>
          </div>
        </div>

        <div class="hero-object" aria-hidden="true">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="hero-monogram">
            <img :src="profileImage" alt="Jwz 的头像" />
          </div>
          <span class="object-note note-top">STUDY / THINK / WRITE</span>
          <span class="object-note note-bottom">31.2304° N</span>
        </div>

        <div class="hero-meta">
          <div><strong>{{ articles.length }}</strong><span>ENTRIES</span></div>
          <div><strong>{{ uniqueTagsCount }}</strong><span>TOPICS</span></div>
          <div class="currently"><i></i><span>CURRENTLY<br>LEARNING</span></div>
        </div>
      </section>

      <section class="recent-section">
        <header class="section-header">
          <div>
            <span class="section-index">01 / RECENT</span>
            <h2 class="section-title">最近文章</h2>
          </div>
          <router-link to="/articles" class="view-all-link">全部文章 <span>↗</span></router-link>
        </header>

        <div class="recent-grid">
          <router-link
            v-for="(article, index) in recentArticles"
            :key="article.id"
            :to="`/articles/${article.id}`"
            class="recent-card"
            :class="{ featured: index === 0 }"
          >
            <div class="card-cover">
              <img :src="article.cover" :alt="article.title" />
              <span class="card-number">0{{ index + 1 }}</span>
              <span class="type-badge">{{ article.type }}</span>
            </div>
            <div class="card-content">
              <div class="recent-date">{{ formatDate(article.date) }}</div>
              <h3 class="recent-title">{{ article.title }}</h3>
              <div class="card-bottom">
                <div class="recent-tags">
                  <span v-for="tag in article.tags" :key="tag"># {{ tag }}</span>
                </div>
                <span class="card-arrow">↗</span>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <section class="closing-section">
        <div class="closing-copy">
          <span class="section-index">02 / ELSEWHERE</span>
          <h2>偶尔输出，<br>长期生长。</h2>
        </div>
        <p>如果你也喜欢编程、音乐与漫无目的的思考，欢迎在其他角落找到我。</p>
        <div class="social-links">
          <a href="https://github.com/Jwz-git" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>
          <a href="https://space.bilibili.com/454733262" target="_blank" rel="noopener noreferrer">bilibili <span>↗</span></a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articles } from '../data/articles.js'

// 修改这里即可更换首页头像，例如：'/Blog/image/avatar.jpg'
const profileImage = '/Blog/image/avatar.jpg'
const recentArticles = computed(() => articles.slice(0, 3))
const uniqueTagsCount = computed(() => new Set(articles.flatMap(article => article.tags)).size)
const formatDate = date => date.replaceAll('-', '.')
</script>

<style scoped src="../styles/home.css"></style>

<style scoped src="../styles/home-cards.css"></style>
