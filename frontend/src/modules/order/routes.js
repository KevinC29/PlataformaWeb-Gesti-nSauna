export default [
    {
      path: '',
      name: 'OrderList',
      component: () => import('./views/OrderPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER', 'MANAGER']
      }
    },
    {
      path: '/create',
      name: 'OrderCreate',
      component: () => import('./views/OrderCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER']
      }
    },
    {
      path: '/:id',
      name: 'OrderEdit',
      component: () => import('./views/OrderEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER']
      }
    },
  ];
  