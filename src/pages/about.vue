<template>
  <NavBar />
  <div class="container">
    <div class="content-card">
      <p class="about-text">
        一时兴起做的网站😎，虽然算不上纯手搓😢
      </p>
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

<style scoped>
.container {
  min-height: 100vh;
  padding: 6rem 1rem 4rem;
  display: flex;
  flex-direction: column;
}

.button-container {
  margin-top: auto;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto 0;
  display: flex;
  justify-content: center;
}

.blog-title {
  font-size: 2.4rem;
  color: white;
}

.content-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  width: 60%;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 1s ease-out;
}

.about-text {
  font-size: 1.5rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 2rem;
}

</style>