import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/views/Layout.vue'

import AttractionsCard from '@/views/cards/AttractionsCard.vue'

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/attractions',
        children: [
            {
                path: 'attractions',
                name: 'Attractions',
                component: AttractionsCard,
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
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router