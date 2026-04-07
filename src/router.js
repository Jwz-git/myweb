import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/home.vue')
  },
  {
    path: '/article',
    name: 'ArticleList',
    component: () => import('./pages/ArticleList.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('./pages/articledetail.vue')
  },
  {
    path: '/friendlink',
    name: 'FriendLink',
    component: () => import('./pages/friendlink.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./pages/about.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./pages/NotFound.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
