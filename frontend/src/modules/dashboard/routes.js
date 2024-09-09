import sectionRoutes from '@/modules/section/routes';
import itemTypeRoutes from '@/modules/itemType/routes';

export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER', 'MANAGER']
    },
    children: [
      ...sectionRoutes.map(route => ({
        ...route,
        path: `sections${route.path}`,
        name: `${route.name}`,
      })),
      ...itemTypeRoutes.map(route => ({
        ...route,
        path: `itemTypes${route.path}`,
        name: `${route.name}`,
      })),
    ]
  }
];
