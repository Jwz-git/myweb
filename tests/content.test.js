import { describe, expect, it } from 'vitest'
import { articles } from '../apps/web/src/generated/articles.js'
describe('generated content index', () => {
  it('contains unique valid slugs and derived fields', () => {
    expect(new Set(articles.map(article => article.slug)).size).toBe(articles.length)
    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(article.summary.length).toBeGreaterThan(0)
      expect(article.readingMinutes).toBeGreaterThan(0)
      expect(article.markdown.length).toBeGreaterThan(0)
      expect(article.summary).not.toMatch(/&(?:emsp|ensp|nbsp);/i)
      expect(article.searchText).not.toMatch(/&(?:emsp|ensp|nbsp);/i)
    }
  })
  it('is sorted newest first', () => expect(articles.map(a=>a.date)).toEqual([...articles.map(a=>a.date)].sort().reverse()))
})
