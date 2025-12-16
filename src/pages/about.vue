<template>
  <NavBar />
  <div class="scroll">
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
@import '../css/pages/about.css';
</style>