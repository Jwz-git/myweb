<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-mark">
          <img :src="brandIcon" alt="" />
        </span>
        <span class="brand-text">JWZ <small>FIELD NOTES</small></span>
      </router-link>

      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </div>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <transition name="fade">
      <div class="menu-backdrop" v-if="menuOpen" @click="menuOpen = false"></div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const brandIcon = '/myweb/image/icon.png'
const menuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/article', label: '文章' },
  { path: '/friendlink', label: '友链' },
  { path: '/about', label: '关于' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped src="../styles/navbar.css"></style>
