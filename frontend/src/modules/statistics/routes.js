export default [
    {
      path: '',
      name: 'OrdersByDate',
      component: () => import('./views/OrdersByDatePage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'MANAGER']
      }
    }
  ];
  