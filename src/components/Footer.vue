<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-links">
        <router-link to="/">首页</router-link>
        <span class="footer-divider">/</span>
        <router-link to="/article">文章</router-link>
        <span class="footer-divider">/</span>
        <router-link to="/friendlink">友链</router-link>
        <span class="footer-divider">/</span>
        <router-link to="/about">关于</router-link>
      </div>
      <p class="footer-copyright">
        &copy; {{ currentYear }} Jwz's Blog. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: auto;
  padding: 40px 24px 32px;
  border-top: 1px solid var(--border-subtle);
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.footer-links a {
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--accent);
}

.footer-divider {
  color: var(--border-primary);
  font-size: 0.75rem;
}

.footer-copyright {
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
</style>
