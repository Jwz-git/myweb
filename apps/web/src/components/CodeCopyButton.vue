<template>
  <button
    class="code-copy-btn"
    :class="{ copied: isCopied, failed: hasFailed }"
    @click="handleCopy"
    :title="tooltipText"
  >
    <svg v-if="!isCopied && !hasFailed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
    <svg v-else-if="isCopied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  codeContent: {
    type: String,
    required: true
  }
})

const isCopied = ref(false)
const hasFailed = ref(false)

const tooltipText = computed(() => {
  if (isCopied.value) return '已复制'
  if (hasFailed.value) return '复制失败'
  return '复制代码'
})

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.codeContent)
    isCopied.value = true
    hasFailed.value = false

    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    hasFailed.value = true
    isCopied.value = false

    setTimeout(() => {
      hasFailed.value = false
    }, 2000)

    // 备用复制方法
    fallbackCopy(props.codeContent)
  }
}

// 备用复制方法（兼容较老的浏览器）
const fallbackCopy = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
    isCopied.value = true
    hasFailed.value = false
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('备用复制方法也失败了:', err)
  }

  document.body.removeChild(textArea)
}
</script>

<style src="../styles/code-copy-button.css"></style>