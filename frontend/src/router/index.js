import { createRouter, createWebHistory } from 'vue-router';
// Importa las rutas de cada módulo
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
import SectionRoutes from '../modules/section/routes';
// import UserRoutes from '../modules/user/routes';
import HomeRoutes from '../modules/home/routes';

import store from '../store/index'; 

// Combina todas las rutas importadas
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
  ...SectionRoutes,
  // ...UserRoutes,
  ...HomeRoutes,
  {
    path: '/:catchAll(.*)',
    redirect: '/dashboard' // Redirige a la ruta que prefieras cuando no se encuentra la ruta
  }
];

const router = createRouter({
  history: createWebHistory(), // Usa el historial HTML5 para las rutas
  routes
});

// Agrega la guardia de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']; // Ajusta según el nombre de tu módulo Vuex y tu getter
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' });  // Redirige al login si el usuario no está autenticado
    } else {
      next();  // Permite el acceso si el usuario está autenticado
    }
  } else {
    next();  // Permite el acceso si la ruta no requiere autenticación
  }
});

export default router;
