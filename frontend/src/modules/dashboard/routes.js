export default [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./views/DashboardPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER', 'MANAGER']
      }
    },
  ];