<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-mark">
          <img :src="brandIcon" alt="" />
        </span>
        <span class="brand-text">JWZ <small>FIELD NOTES</small></span>
      </router-link>

      <div id="site-navigation" class="navbar-links" :class="{ open: menuOpen }">
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
      <ThemeToggle />
      <UserMenu />

      <button
        class="menu-toggle"
        type="button"
        aria-label="切换导航菜单"
        :aria-expanded="menuOpen"
        aria-controls="site-navigation"
        @click="menuOpen = !menuOpen"
        :class="{ active: menuOpen }"
      >
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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { assetUrl } from '../utils/assets.js'
import ThemeToggle from './ThemeToggle.vue'
import UserMenu from './UserMenu.vue'
import { serverFeaturesEnabled } from '../config/server.js'
import { currentUser } from '../composables/useSession.js'

const brandIcon = assetUrl('/image/icon.png')
const menuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

const navLinks = computed(() => [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  ...(serverFeaturesEnabled && (import.meta.env.DEV || currentUser.value?.role === 'admin') ? [{ path: '/write', label: '写作' }] : []),
  { path: '/friendlink', label: '友链' },
  { path: '/about', label: '关于' }
])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleResize = () => {
  if (window.innerWidth > 768) menuOpen.value = false
}

const handleKeyDown = event => {
  if (event.key === 'Escape') menuOpen.value = false
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

watch(menuOpen, isOpen => {
  document.body.classList.toggle('menu-open', isOpen)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  document.body.classList.remove('menu-open')
})
</script>

<style scoped src="../styles/navbar.css"></style>
