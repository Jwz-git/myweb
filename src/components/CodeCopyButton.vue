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

<style>
/* 使用非 scoped 样式以便能与父元素交互 */
.code-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: color-mix(in srgb, var(--accent) 70%, var(--text-muted) 30%);
  background: color-mix(in srgb, var(--accent-muted) 60%, var(--bg-elevated) 40%);
  border: 1px solid color-mix(in srgb, var(--accent) 60%, var(--border-primary) 40%);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast);
  opacity: 0.9;
  z-index: 10;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 代码块悬停时只改变透明度，强制保持原有颜色 */
.article-content pre:hover .code-copy-btn:not(:hover) {
  color: color-mix(in srgb, var(--accent) 70%, var(--text-muted) 30%);
  background: color-mix(in srgb, var(--accent-muted) 60%, var(--bg-elevated) 40%);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border-primary) 40%);
}

/* 只有直接悬停按钮时才改变颜色 */
.code-copy-btn:hover,
.code-copy-btn:focus {
  opacity: 1;
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-muted);
}

/* 成功状态 */
.code-copy-btn.copied {
  color: #98c379;
  border-color: #98c379;
  background: rgba(152, 195, 121, 0.15);
}

.code-copy-btn.copied:hover {
  color: #98c379;
  border-color: #98c379;
  background: rgba(152, 195, 121, 0.2);
}

/* 失败状态 */
.code-copy-btn.failed {
  color: #e06c75;
  border-color: #e06c75;
  background: rgba(224, 108, 117, 0.15);
}

.code-copy-btn.failed:hover {
  color: #e06c75;
  border-color: #e06c75;
  background: rgba(224, 108, 117, 0.2);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .code-copy-btn {
    opacity: 0.8;
    top: 6px;
    right: 6px;
    width: 28px;
    height: 28px;
  }

  .code-copy-btn svg {
    width: 14px;
    height: 14px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .code-copy-btn {
    border-width: 2px;
  }
}

/* 减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .code-copy-btn {
    transition: none;
  }
}

/* 备用方案 - 适用于不支持 color-mix 的浏览器 */
@supports not (color: color-mix(in srgb, white, black)) {
  .code-copy-btn {
    color: var(--text-secondary);
    background: color-mix(in srgb, var(--accent) 20%, var(--bg-elevated) 80%);
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border-primary) 60%);
  }

  .article-content pre:hover .code-copy-btn:not(:hover) {
    color: var(--text-secondary);
    background: color-mix(in srgb, var(--accent) 20%, var(--bg-elevated) 80%);
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border-primary) 60%);
  }
}
</style>