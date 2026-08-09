import { ref, watch } from 'vue'
const saved = localStorage.getItem('theme') || 'system'
export const theme = ref(saved)
const apply = value => {
  const dark = value === 'dark' || (value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}
watch(theme, value => { localStorage.setItem('theme', value); apply(value) }, { immediate: true })
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => theme.value === 'system' && apply('system'))
