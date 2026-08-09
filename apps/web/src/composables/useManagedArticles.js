import { computed, ref } from 'vue'
import { articles as staticArticles } from '../generated/articles.js'
import { serverFeaturesEnabled } from '../config/server.js'

const storageKey = 'jwz-managed-articles-v1'
const now = () => new Date().toISOString()
const read = () => {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]') }
  catch { return [] }
}
const fromStatic = (article, index) => ({
  id: `static-${article.slug}`,
  status: 'published',
  draftOrder: index,
  createdAt: `${article.date}T00:00:00.000Z`,
  publishedAt: `${article.date}T00:00:00.000Z`,
  updatedAt: `${article.updated || article.date}T00:00:00.000Z`,
  content: {
    title: article.title, slug: article.slug, date: article.date, type: article.type,
    tags: article.tags, series: article.series || '', summary: article.summary || '',
    cover: article.cover || '', coverPosition: article.coverPosition || 'center', body: article.markdown || ''
  }
})

const initial = serverFeaturesEnabled ? read() : []
if (serverFeaturesEnabled) {
  initial.forEach(item => {
    if (item.status === 'published') {
      item.createdAt ||= item.publishedAt || (item.content?.date ? `${item.content.date}T00:00:00.000Z` : item.updatedAt) || now()
      item.publishedAt ||= item.createdAt
    }
  })
  const existingSlugs = new Set(initial.map(item => item.content?.slug))
  staticArticles.forEach((article, index) => {
    if (!existingSlugs.has(article.slug)) initial.push(fromStatic(article, index))
    else {
      // 将仓库中新增的人工摘要一次性同步给已缓存在浏览器中的静态文章。
      const existing = initial.find(item => item.content?.slug === article.slug)
      if (existing?.id?.startsWith('static-') && existing.summaryRevision !== 1) {
        existing.content.summary = article.summary || existing.content.summary
        existing.summaryRevision = 1
      }
    }
  })
}
export const managedArticleRecords = ref(initial)

export const persistManagedArticles = () => {
  if (serverFeaturesEnabled) localStorage.setItem(storageKey, JSON.stringify(managedArticleRecords.value))
}
if (serverFeaturesEnabled) persistManagedArticles()

const toPublicArticle = record => {
  const content = record.content
  const text = String(content.body || '').replace(/[#>*_`~[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim()
  return {
    ...content,
    tags: Array.isArray(content.tags) ? content.tags : [],
    updated: record.updatedAt.slice(0, 10),
    markdown: content.body || '',
    searchText: `${content.title} ${content.summary} ${text}`.toLowerCase(),
    words: text.replace(/\s/g, '').length,
    readingMinutes: Math.max(1, Math.ceil(text.replace(/\s/g, '').length / 400)),
    headings: [],
    publishedAt: record.publishedAt,
    recordId: record.id
  }
}

export const publishedArticles = computed(() => {
  if (!serverFeaturesEnabled) return staticArticles
  return managedArticleRecords.value
    .filter(item => item.status === 'published')
    .sort((a, b) => (b.createdAt || b.publishedAt || b.content.date).localeCompare(a.createdAt || a.publishedAt || a.content.date))
    .map(toPublicArticle)
})

export const createManagedArticle = content => {
  // randomUUID 只在安全上下文可用；内网 HTTP 调试时使用兼容 ID。
  const id = globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const record = { id, status: 'draft', draftOrder: -Date.now(), createdAt: null, publishedAt: null, updatedAt: now(), content }
  managedArticleRecords.value.unshift(record)
  persistManagedArticles()
  return record
}
