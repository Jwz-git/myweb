import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '起始页',
        component: () => import('../pages/total.vue'),
    },
    {
        path: '/home',
        name: '首页',
        component: () => import('../pages/home.vue'),
    },
    {
        path: '/article',
        name: '文章',
        component: () => import('../pages/article.vue'),
    },
    {
        path: '/friendlink',
        name: '友链',
        component: () => import('../pages/friendlink.vue'),
    },
    {
        path: '/about',
        name: '关于',
        component: () => import('../pages/about.vue'),
    },
    {
        path: '/article/:id',
        name: '文章详情',
        component: () => import('../pages/articledetail.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('../pages/404.vue'),
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router