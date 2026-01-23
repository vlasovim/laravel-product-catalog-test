import {createRouter, createWebHistory} from 'vue-router';
import AppLayout from "../layouts/AppLayout.vue";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'Home',
                component: Home
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('../pages/Login.vue'),
            },
            {
                path: '/product/:id',
                name: 'Product',
                component: () => import('../pages/Product.vue'),
            },
        ]
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
