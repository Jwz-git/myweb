<template>
    <!-- 装饰性粒子 - 在404页面不显示 -->
    <div v-if="$route.name !== '404'" class="particle" v-for="n in 8" :key="n" :style="{
        left: `${Math.random() * 100}%`, animationDelay:
            `${Math.random() * 8}s`, animationDuration: `${6 + Math.random() * 4}s`
    }">
    </div>
  <div class="app-container">
    <router-view class="main-content" />
    <!-- 装饰性粒子 - 所有页面共享，404页面不显示 -->
    <div v-if="$route.name !== '404'" class="particle" v-for="n in 8" :key="n" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${6 + Math.random() * 4}s` }"></div>
    <MusicPlayer v-if="$route.path !== '/' && $route.name !== '404'" />
  </div>
</template>

<style scoped>
.app-container {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

/* 确保粒子在main-content上方但在其他内容下方 */
.particle {
    z-index: 1;
}
</style>

<script setup>
import MusicPlayer from './components/MusicPlayer.vue'
import { useRoute } from 'vue-router'

// 为了使$route在模板中可用
const $route = useRoute()
</script>

