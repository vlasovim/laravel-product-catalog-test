import {createRouter, createWebHistory} from 'vue-router';
import AppLayout from "../layouts/AppLayout.vue";
import Home from "../pages/Home.vue";
import {useAuthState} from "../composables/useAuthState.js";

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Home
            },
            {
                path: 'login',
                component: () => import('../pages/Login.vue'),
            },
            {
                path: 'product/:id',
                component: () => import('../pages/Product.vue'),
            },
        ]
    },
    {
        path: '/admin',
        component: AppLayout,
        children: [
            {
                path: '',
                redirect: 'admin/products'
            },
            {
                path: 'products',
                component: () => import('../pages/admin/ProductList.vue'),
            },
            {
                path: 'products/create',
                component: () => import('../pages/admin/ProductEditor.vue'),
            },
            {
                path: 'products/:id/edit',
                component: () => import('../pages/admin/ProductEditor.vue'),
            },
        ]
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const {isAuthenticated} = useAuthState();

    if (to.path.startsWith('/admin') && !isAuthenticated.value) {
        next('/login');
    } else {
        next();
    }
});

export default router;
