import sectionRoutes from '@/modules/section/routes';
import itemTypeRoutes from '@/modules/itemType/routes';
import roleRoutes  from '@/modules/role/routes';
import item from '@/modules/item/routes';
import user from '@/modules/user/routes';
import client from '@/modules/client/routes';
import comment from '@/modules/comment/routes';
import credential from '@/modules/credential/routes';
import order from '@/modules/order/routes';
import statistics from '@/modules/statistics/routes';
import invoice from '@/modules/invoice/routes';

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
      ...comment.map(route => ({
        ...route,
        path: `comments${route.path}`,
        name: `${route.name}`,
      })),
      ...credential.map(route => ({
        ...route,
        path: `credentials${route.path}`,
        name: `${route.name}`,
      })),
      ...order.map(route => ({
        ...route,
        path: `orders${route.path}`,
        name: `${route.name}`,
      })),
      ...statistics.map(route => ({
        ...route,
        path: `statisticsByDate${route.path}`,
        name: `${route.name}`,
      })),
      ...invoice.map(route => ({
        ...route,
        path: `invoices${route.path}`,
        name: `${route.name}`,
      })),
    ]
  }
];
