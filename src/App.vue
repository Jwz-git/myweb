<template>
  <router-view class="main-content" />
  <MusicPlayer />
</template>

<script setup>
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<style>
.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}
</style>