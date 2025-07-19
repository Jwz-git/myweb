<template>
  <router-view class="main-content" />
</template>

<script setup>
import NavBar from '../src/components/NavBar.vue'
</script>

<style>
.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}
</style>