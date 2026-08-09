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
  const existingSlugs = new Set(initial.map(item => item.content?.slug))
  staticArticles.forEach((article, index) => {
    if (!existingSlugs.has(article.slug)) initial.push(fromStatic(article, index))
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
    .sort((a, b) => (b.updatedAt || b.publishedAt).localeCompare(a.updatedAt || a.publishedAt))
    .map(toPublicArticle)
})

export const createManagedArticle = content => {
  const record = { id: crypto.randomUUID(), status: 'draft', draftOrder: -Date.now(), publishedAt: null, updatedAt: now(), content }
  managedArticleRecords.value.unshift(record)
  persistManagedArticles()
  return record
}
