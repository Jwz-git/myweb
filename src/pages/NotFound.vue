<template>
  <div class="notfound page-enter">
    <div class="container">
      <div class="notfound-inner">
        <h1 class="notfound-code">404</h1>
        <p class="notfound-msg">页面未找到</p>
        <p class="notfound-desc">你访问的页面不存在或已被移除。</p>
        <router-link to="/" class="notfound-link">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  padding: 120px 0 80px;
}

.notfound-inner {
  text-align: center;
}

.notfound-code {
  font-family: var(--font-serif);
  font-size: 5rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 16px;
  opacity: 0.8;
}

.notfound-msg {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.notfound-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.notfound-link {
  display: inline-block;
  padding: 10px 28px;
  font-size: 0.9rem;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
}

.notfound-link:hover {
  background: var(--accent);
  color: var(--bg-primary);
}
</style>
