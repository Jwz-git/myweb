import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/article',
    name: 'ArticleList',
    component: () => import('./pages/ArticleList.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('./pages/ArticleDetail.vue')
  },
  {
    path: '/friendlink',
    name: 'FriendLink',
    component: () => import('./pages/FriendLink.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./pages/About.vue')
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
