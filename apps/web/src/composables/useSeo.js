import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { articles } from '../generated/articles.js'
import { assetUrl } from '../utils/assets.js'
const setMeta = (selector, attr, value) => {
  let element = document.head.querySelector(selector)
  if (!element) { element = document.createElement('meta'); document.head.appendChild(element) }
  Object.entries(attr).forEach(([key,val]) => element.setAttribute(key,val))
  element.setAttribute('content', value)
}
export function useSeo() {
  const route = useRoute()
  watch(() => route.fullPath, () => {
    const article = route.name === 'ArticleDetail' ? articles.find(item => item.slug === route.params.slug) : null
    const title = article ? `${article.title} · Jwz's Blog` : `${route.meta.title || 'Jwz’s Blog'}`
    const description = article?.summary || '记录学习与思考，技术笔记与生活随笔。'
    const canonical = new URL(route.path.replace(/^\//,''), import.meta.env.VITE_SITE_URL || location.origin + import.meta.env.BASE_URL).href
    document.title = title
    setMeta('meta[name="description"]', { name:'description' }, description)
    setMeta('meta[property="og:title"]', { property:'og:title' }, title)
    setMeta('meta[property="og:description"]', { property:'og:description' }, description)
    setMeta('meta[property="og:url"]', { property:'og:url' }, canonical)
    if (article?.cover) setMeta('meta[property="og:image"]', { property:'og:image' }, new URL(assetUrl(article.cover), location.origin).href)
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) { link=document.createElement('link'); link.rel='canonical'; document.head.appendChild(link) }
    link.href = canonical
    document.getElementById('article-jsonld')?.remove()
    if (article) { const script=document.createElement('script'); script.id='article-jsonld'; script.type='application/ld+json'; script.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:article.title,datePublished:article.date,dateModified:article.updated,description:article.summary,url:canonical}); document.head.appendChild(script) }
  }, { immediate:true })
}
