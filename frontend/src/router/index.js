import { createRouter, createWebHistory } from 'vue-router';
import AuthRoutes from '../modules/auth/routes';
import DashboardRoutes from '../modules/dashboard/routes';
import HomeRoutes from '../modules/home/routes';
import store from '../store/index'; 

const routes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  ...HomeRoutes,
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
