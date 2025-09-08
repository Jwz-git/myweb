<template>
  <router-view class="main-content" />
  <MusicPlayer v-if="$route.path !== '/'" />
</template>

<script setup>
import MusicPlayer from './components/MusicPlayer.vue'
import { useRoute } from 'vue-router'

// 为了使$route在模板中可用
const $route = useRoute()
</script>

<style>
.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}
</style>