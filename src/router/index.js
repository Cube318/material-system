import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/login',
        children: [
            {
                path: 'attractions',
                name: 'Attractions',
                component: () => import('@/views/cards/AttractionsCard.vue'),
                meta: { title: '景点管理' }
            },
            {
                path: 'products',
                name: 'Products',
                component: () => import('@/views/cards/ProductsCard.vue'),
                meta: { title: '商品管理' }
            },
            {
                path: 'food',
                name: 'Food',
                component: () => import('@/views/cards/FoodCard.vue'),
                meta: { title: '美食管理' }
            },
            {
                path: 'video-replace',
                name: 'VideoReplace',
                component: () => import('@/views/cards/VideoReplaceCard.vue'),
                meta: { title: '视频替换工具' }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router