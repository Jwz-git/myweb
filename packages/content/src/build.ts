import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import matter from 'gray-matter'

type FrontMatter = {
  title: string; slug: string; date: string | Date; updated?: string | Date
  type: string; tags: string[]; cover?: string; coverPosition?: string
  summary?: string; draft?: boolean; featured?: boolean; series?: string | null
}

const root = resolve(import.meta.dirname, '../../..')
const contentDir = join(root, 'content/articles')
const publicDir = join(root, 'apps/web/public')
const outputFile = join(root, 'apps/web/src/generated/articles.js')
const production = process.env.NODE_ENV === 'production' || process.argv.includes('--production')
const checkOnly = process.argv.includes('--check')
const base = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '')
const siteUrl = (process.env.SITE_URL || 'https://jwz-git.github.io/Blog').replace(/\/$/, '')

const plain = (markdown: string) => markdown
  .replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:emsp|ensp|nbsp|thinsp);/gi, ' ')
  .replace(/&(?:amp|lt|gt|quot|apos);/gi, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }[entity.toLowerCase()] || ' '))
  .replace(/&#(?:x[0-9a-f]+|\d+);/gi, ' ')
  .replace(/[#>*_~|=-]/g, ' ').replace(/\s+/g, ' ').trim()

const isoDate = (value: string | Date, field: string, file: string) => {
  const raw = value instanceof Date ? value.toISOString().slice(0, 10) : String(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error(`${file}: ${field} 必须为 YYYY-MM-DD`)
  const date = new Date(`${raw}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`${file}: ${field} 日期无效`)
  if (date.toISOString().slice(0,10) !== raw) throw new Error(`${file}: ${field} 日期无效`)
  return raw
}

async function run() {
  const files = (await readdir(contentDir)).filter(file => file.endsWith('.md')).sort()
  const slugs = new Set<string>()
  const articles = []
  for (const file of files) {
    const source = await readFile(join(contentDir, file), 'utf8')
    const { data, content } = matter(source)
    const fm = data as FrontMatter
    for (const key of ['title', 'slug', 'date', 'type', 'tags'] as const) {
      if (!fm[key] || (Array.isArray(fm[key]) && !fm[key].length)) throw new Error(`${file}: 缺少 ${key}`)
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.slug)) throw new Error(`${file}: slug 仅允许小写字母、数字和连字符`)
    if (slugs.has(fm.slug)) throw new Error(`${file}: slug 重复: ${fm.slug}`)
    slugs.add(fm.slug)
    if (fm.cover && !existsSync(join(publicDir, fm.cover.replace(/^\//, '')))) throw new Error(`${file}: 封面不存在: ${fm.cover}`)
    for (const match of content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)) {
      const resource = decodeURIComponent(match[1])
      if (!/^(https?:|data:)/.test(resource) && !existsSync(join(publicDir, resource.replace(/^\//, '')))) throw new Error(`${file}: 正文资源不存在: ${resource}`)
    }
    if (production && fm.draft) continue
    const text = plain(content)
    const headings = [...content.matchAll(/^(#{1,4})\s+(.+)$/gm)].map((match, index) => ({
      id: `heading-${index}`, level: match[1].length, text: plain(match[2])
    }))
    articles.push({
      title: fm.title, slug: fm.slug, date: isoDate(fm.date, 'date', file),
      updated: isoDate(fm.updated || fm.date, 'updated', file), type: fm.type,
      tags: fm.tags, cover: fm.cover || '', coverPosition: fm.coverPosition || 'center',
      summary: fm.summary || text.slice(0, 140), draft: Boolean(fm.draft),
      featured: Boolean(fm.featured), series: fm.series || null,
      words: text.replace(/\s/g, '').length,
      readingMinutes: Math.max(1, Math.ceil(text.replace(/\s/g, '').length / 400)),
      headings, markdown: content, searchText: text.toLowerCase(), source: basename(file)
    })
  }
  articles.sort((a, b) => b.date.localeCompare(a.date))
  if (checkOnly) return console.log(`内容校验通过：${articles.length} 篇文章`)
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `// 此文件由 packages/content/src/build.ts 自动生成\nexport const articles = ${JSON.stringify(articles, null, 2)}\n`, 'utf8')
  const absolute = (slug = '') => `${siteUrl}/articles/${slug}`
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Jwz's Blog</title><link>${siteUrl}</link><description>技术笔记与生活随笔</description>${articles.map(a => `<item><title><![CDATA[${a.title}]]></title><link>${absolute(a.slug)}</link><guid>${absolute(a.slug)}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description><![CDATA[${a.summary}]]></description></item>`).join('')}</channel></rss>`
  const tags = [...new Set(articles.flatMap(article => article.tags))]
  const types = [...new Set(articles.map(article => article.type))]
  const series = [...new Set(articles.map(article => article.series).filter(Boolean))]
  const urls = ['', '/articles', ...articles.map(a => `/articles/${a.slug}`), ...tags.map(value => `/tags/${encodeURIComponent(value)}`), ...types.map(value => `/categories/${encodeURIComponent(value)}`), ...series.map(value => `/series/${encodeURIComponent(value)}`)]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`
  await writeFile(join(publicDir, 'rss.xml'), rss)
  await writeFile(join(publicDir, 'sitemap.xml'), sitemap)
  await writeFile(join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
  const index = await readFile(join(root, 'apps/web/index.html'), 'utf8')
  await writeFile(join(publicDir, '404.html'), index.replace('</head>', `<script>sessionStorage.redirect=location.href</script></head>`))
  console.log(`内容构建完成：${articles.length} 篇文章，base=${base || '/'}`)
}

run().catch(error => { console.error(error.message); process.exit(1) })
