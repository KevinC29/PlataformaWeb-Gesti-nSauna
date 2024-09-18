import sectionRoutes from '@/modules/section/routes';
import itemTypeRoutes from '@/modules/itemType/routes';
import roleRoutes  from '@/modules/role/routes';
import item from '@/modules/item/routes';
import user from '@/modules/user/routes';
import client from '@/modules/client/routes';

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
      ...roleRoutes.map(route => ({
        ...route,
        path: `roles${route.path}`,
        name: `${route.name}`,
      })),
      ...item.map(route => ({
        ...route,
        path: `items${route.path}`,
        name: `${route.name}`,
      })),
      ...user.map(route => ({
        ...route,
        path: `users${route.path}`,
        name: `${route.name}`,
      })),
      ...client.map(route => ({
        ...route,
        path: `clients${route.path}`,
        name: `${route.name}`,
      })),
    ]
  }
];
