import { createRouter, createWebHistory } from 'vue-router';
// Importa las rutas de cada módulo
import AuthRoutes from '../modules/auth/routes';
// import DashboardRoutes from '../modules/dashboard/routes';
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

// Combina todas las rutas importadas
const routes = [
  ...AuthRoutes,
  // ...DashboardRoutes,
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
  {
    path: '/:catchAll(.*)',
    redirect: '/dashboard' // Redirige a la ruta que prefieras cuando no se encuentra la ruta
  }
];

const router = createRouter({
  history: createWebHistory(), // Usa el historial HTML5 para las rutas
  routes
});

export default router;
