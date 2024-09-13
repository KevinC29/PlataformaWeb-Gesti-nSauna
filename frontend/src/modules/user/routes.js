export default [
    {
      path: '',
      name: 'UserList',
      component: () => import('./views/UserPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER']
      }
    },
    {
      path: '/create',
      name: 'UserCreate',
      component: () => import('./views/UserCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] 
      }
    },
    {
      path: '/:id',
      name: 'UserEdit',
      component: () => import('./views/UserEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] 
      }
    }
  ];
  