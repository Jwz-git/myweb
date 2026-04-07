<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-text">Jwz's Blog</span>
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

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 1000;
  background: rgba(10, 10, 11, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-normal), background var(--transition-normal);
}

.navbar.scrolled {
  border-bottom-color: var(--border-subtle);
  background: rgba(10, 10, 11, 0.9);
}

.navbar-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-text {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  transition: color var(--transition-fast);
}

.navbar-brand:hover .brand-text {
  color: var(--accent);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--text-secondary);
  position: relative;
  padding: 4px 0;
  transition: color var(--transition-fast);
  letter-spacing: 0.02em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--accent);
  transition: width var(--transition-normal);
  border-radius: 1px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}

.nav-link.router-link-active::after,
.nav-link:hover::after {
  width: 100%;
}

/* Hamburger */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  gap: 5px;
  z-index: 1001;
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 1.5px;
  background: var(--text-secondary);
  border-radius: 1px;
  transition: all var(--transition-normal);
  transform-origin: center;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
  background: var(--text-primary);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
  background: var(--text-primary);
}

/* Mobile Drawer */
.menu-backdrop {
  display: none;
}

/* Mobile */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 240px;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0;
    background: var(--bg-surface);
    border-left: 1px solid var(--border-subtle);
    padding: 40px 32px;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
    z-index: 1000;
  }

  .navbar-links.open {
    transform: translateX(0);
  }

  .nav-link {
    font-size: 1.05rem;
    padding: 14px 0;
    width: 100%;
    border-bottom: 1px solid var(--border-subtle);
  }

  .nav-link::after {
    display: none;
  }

  .menu-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
