<template>
  <NavBar />
  <div class="stroll">
    <div class="content-card">
      <p class="about-text">
        一时兴起做的网站😎，虽然算不上纯手搓😢
      </p>
    </div>
    <div class="button-container">
      <Back />
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
</script>

<style scoped>
.stroll {
  padding: 0;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: auto;
  padding: 6rem 0 2rem;
  width: 100%;
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

.container {
  min-height: 0vh;
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
  backdrop-filter: blur(2px);
  width: 50%;
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