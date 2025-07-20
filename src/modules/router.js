import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '起始页',
        component: () => import('../pages/total.vue'),
    },
    {
        path: '/Home',
        name: '首页',
        component: () => import('../pages/home.vue'),
    },
    {
        path: '/Article',
        name: '文章',
        component: () => import('../pages/article.vue'),
    },
    {
        path: '/FriendLink',
        name: '友链',
        component: () => import('../pages/friendlink.vue'),
    },
    {
        path: '/About',
        name: '关于',
        component: () => import('../pages/about.vue'),
    },
    {
        path: '/Article/:id',
        name: '文章详情',
        component: () => import('../pages/articledetail.vue'),
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router