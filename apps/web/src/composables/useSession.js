import { ref } from 'vue'
import { apiBase, serverFeaturesEnabled } from '../config/server.js'

export const currentUser = ref(null)
export const sessionLoading = ref(false)
let loaded = false
let loadPromise = null

export async function loadSession(force = false) {
  if (!serverFeaturesEnabled) return currentUser.value
  if (loadPromise) return loadPromise
  if (loaded && !force) return currentUser.value
  loaded = true
  sessionLoading.value = true
  loadPromise = (async () => {
    try {
      const response = await fetch(`${apiBase}/me`, { credentials: 'include' })
      currentUser.value = response.ok ? await response.json() : null
    } catch {
      currentUser.value = null
    } finally {
      sessionLoading.value = false
      loadPromise = null
    }
    return currentUser.value
  })()
  return loadPromise
}

export async function logout() {
  await fetch(`${apiBase}/auth/logout`, { method: 'POST', credentials: 'include' })
  currentUser.value = null
}
