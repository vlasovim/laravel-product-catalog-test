import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import Home from "@/pages/Home.vue";
import {useAuthStore} from "@/stores";
import AppLayout from "@/layouts/AppLayout.vue";

const routes: RouteRecordRaw[] = [
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
        component: () => import('@/pages/Login.vue'),
      },
      {
        path: 'product/:id',
        component: () => import('@/pages/Product.vue'),
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
        component: () => import('@/pages/admin/ProductList.vue'),
      },
      {
        path: 'products/create',
        component: () => import('@/pages/admin/ProductEditor.vue'),
      },
      {
        path: 'products/:id/edit',
        component: () => import('@/pages/admin/ProductEditor.vue'),
      },
    ]
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const {isAuthenticated} = useAuthStore();

  if (to.path.startsWith('/admin') && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
