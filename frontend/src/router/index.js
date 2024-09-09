import { createRouter, createWebHistory } from 'vue-router';

import AuthRoutes from '../modules/auth/routes';
import DashboardRoutes from '../modules/dashboard/routes';
// import ClientRoutes from '../modules/client/routes';
// import CommentRoutes from '../modules/comment/routes';
// import CredentialRoutes from '../modules/credential/routes';
// import DetailOrderRoutes from '../modules/detailOrder/routes';
// import ItemRoutes from '../modules/item/routes';
// import ItemTypeRoutes from '../modules/itemType/routes';
// import OrderRoutes from '../modules/order/routes';
// import RoleRoutes from '../modules/role/routes';
// import SectionRoutes from '../modules/section/routes';
// import UserRoutes from '../modules/user/routes';
import HomeRoutes from '../modules/home/routes';

import store from '../store/index'; 

const routes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  // ...ClientRoutes,
  // ...CommentRoutes,
  // ...CredentialRoutes,
  // ...DetailOrderRoutes,
  // ...ItemRoutes,
  // ...ItemTypeRoutes,
  // ...OrderRoutes,
  // ...RoleRoutes,
  // ...SectionRoutes,
  // ...UserRoutes,
  ...HomeRoutes,
  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
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
