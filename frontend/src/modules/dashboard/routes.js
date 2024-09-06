import sectionRoutes from '@/modules/section/routes';

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
        path: `sections${route.path}`, // Prefijar con "sections"
        name: `${route.name}`, // Mantener el nombre de la ruta
      }))
    ]
  }
];
