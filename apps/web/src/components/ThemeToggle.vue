<template>
  <button class="theme-toggle" type="button" :aria-label="`当前主题：${labels[theme]}`" @click="cycle">
    {{ theme === 'dark' ? '☾' : theme === 'light' ? '☀' : '◐' }}
  </button>
</template>
<script setup>
import { theme } from '../composables/useTheme.js'
const values = ['system', 'light', 'dark']
const labels = { system: '跟随系统', light: '浅色', dark: '深色' }
const cycle = () => { theme.value = values[(values.indexOf(theme.value) + 1) % values.length] }
</script>
<style scoped>.theme-toggle{margin-left:8px;border:1px solid var(--border-primary);background:var(--bg-surface);color:var(--text-primary);width:36px;height:36px;border-radius:50%;cursor:pointer;flex:0 0 36px}.theme-toggle:focus-visible{outline:2px solid currentColor;outline-offset:2px}@media(max-width:768px){.theme-toggle{margin-left:auto}}</style>
