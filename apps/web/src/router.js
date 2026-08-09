import { createRouter, createWebHistory } from 'vue-router'
import { serverFeaturesEnabled } from './config/server.js'
import { loadSession } from './composables/useSession.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: "首页 · Jwz's Blog" },
    component: () => import('./pages/home.vue')
  },
  {
    path: '/articles',
    name: 'ArticleList',
    meta: { title: "文章 · Jwz's Blog" },
    component: () => import('./pages/ArticleList.vue')
  },
  {
    path: '/articles/:slug',
    name: 'ArticleDetail',
    component: () => import('./pages/articledetail.vue')
  },
  {
    path: '/friendlink',
    name: 'FriendLink',
    meta: { title: "友链 · Jwz's Blog" },
    component: () => import('./pages/friendlink.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: { title: "关于 · Jwz's Blog" },
    component: () => import('./pages/about.vue')
  },
  ...(serverFeaturesEnabled ? [{ path: '/write', name: 'Write', meta: { title: "写作 · Jwz's Blog", requiresAdmin: true }, component: () => import('./pages/Write.vue') }] : []),
  ...(serverFeaturesEnabled ? [{ path: '/admin', name: 'Admin', meta: { title: "管理后台 · Jwz's Blog", requiresAdmin: true }, component: () => import('./pages/Admin.vue') }] : []),
  { path: '/tags/:value', redirect: to => ({ path: '/articles', query: { tag: to.params.value } }) },
  { path: '/categories/:value', redirect: to => ({ path: '/articles', query: { type: to.params.value } }) },
  { path: '/series/:value', redirect: to => ({ path: '/articles', query: { series: to.params.value } }) },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { title: "页面未找到 · Jwz's Blog" },
    component: () => import('./pages/NotFound.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach(async to => {
  if (!to.meta.requiresAdmin) return true
  if (!serverFeaturesEnabled) return { name: 'NotFound' }
  if (import.meta.env.DEV) return true
  const user = await loadSession()
  return user?.role === 'admin' ? true : { name: 'Home' }
})

export default router
