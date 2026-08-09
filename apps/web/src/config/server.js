export const serverFeaturesEnabled = import.meta.env.VITE_SERVER_FEATURES === 'true'
export const apiBase = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api/v1`
