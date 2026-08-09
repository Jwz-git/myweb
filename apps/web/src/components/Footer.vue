<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-sign">JWZ<span>°</span></div>
      <div class="footer-links">
        <router-link to="/">首页</router-link>
        <span class="footer-divider">/</span>
        <router-link to="/articles">文章</router-link>
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

<style scoped src="../styles/footer.css"></style>
