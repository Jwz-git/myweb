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
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://space.bilibili.com/454733262" target="_blank" rel="noopener noreferrer" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

<style scoped>
.about-page {
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
  margin-bottom: 40px;
}

/* Sections */
.about-section {
  margin-bottom: 40px;
}

.section-heading {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-subtle);
}

/* About Content */
.about-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.85;
  margin-bottom: 14px;
}

.about-content p:last-child {
  margin-bottom: 0;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.tech-item:hover {
  border-color: var(--border-primary);
  background: var(--bg-surface-hover);
}

.tech-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-muted);
  color: var(--accent);
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tech-name {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
}

.tech-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--border-primary);
}

.timeline-item {
  position: relative;
  padding-bottom: 28px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--accent);
  z-index: 1;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-date {
  font-size: 0.78rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 500;
}

.timeline-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.timeline-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Contact */
.contact-list {
  display: flex;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all var(--transition-normal);
}

.contact-item:hover {
  color: var(--text-primary);
  border-color: var(--border-primary);
  background: var(--bg-surface-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .about-page {
    padding: 36px 0 60px;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .contact-list {
    flex-direction: column;
  }
}
</style>
