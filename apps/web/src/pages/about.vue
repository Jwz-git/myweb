<template>
  <div class="about-page page-enter">
    <div class="container">
      <h1 class="page-title">关于</h1>
      <p class="page-desc">关于这个博客和它的作者。</p>

      <!-- About Me -->
      <section class="about-section">
        <h2 class="section-heading">关于我</h2>
        <div class="about-content">
          <p>
            你好，我是 Jwz，一名在校大学生。这个博客是我记录学习过程和生活感悟的地方。
            我对编程和技术有着浓厚的兴趣，平时喜欢折腾各种新东西，偶尔也会写一些随笔来整理自己的思绪。
          </p>
          <p>
            博客中的文章既有技术笔记，也有生活随笔。技术类文章主要记录我在学习过程中学到的东西，
            而随笔类文章则是我对生活和学习的思考与感悟。
          </p>
          <p>
            我相信持续学习和记录是成长的重要方式，希望这个博客能见证我的进步。
          </p>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="about-section">
        <h2 class="section-heading">技术栈</h2>
        <div class="tech-grid">
          <div class="tech-item" v-for="tech in techStack" :key="tech.name">
            <span class="tech-icon">{{ tech.icon }}</span>
            <div class="tech-info">
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-desc">{{ tech.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="about-section">
        <h2 class="section-heading">博客历程</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in timeline" :key="index">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-date">{{ item.date }}</span>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section class="about-section">
        <h2 class="section-heading">联系方式</h2>
        <div class="contact-list">
          <a href="https://github.com/Jwz-git" target="_blank" rel="noopener noreferrer" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://space.bilibili.com/454733262" target="_blank" rel="noopener noreferrer" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
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
const techStack = [
  { icon: 'V', name: 'Vue.js', desc: '前端框架' },
  { icon: 'W', name: 'Web', desc: 'HTML/CSS/JS' },
  { icon: 'G', name: 'Git', desc: '版本控制' }
]

const timeline = [
  {
    date: '2025.02',
    title: '念头萌芽',
    desc: '在学习前端相关技术时，决定搭建一个个人博客，记录学习过程和生活感悟。'
  },
  {
    date: '2025.07',
    title: '博客诞生',
    desc: '搭建了个人博客，开始记录学习和生活。'
  },
  {
    date: '2026.04',
    title: '博客重构',
    desc: '采用极简现代的设计风格 重构了博客。'
  }
]
</script>

<style scoped src="../styles/about.css"></style>
