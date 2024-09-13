export default [
    {
      path: '',
      name: 'ItemList',
      component: () => import('./views/ItemPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] 
      }
    },
    {
      path: '/create',
      name: 'ItemCreate',
      component: () => import('./views/ItemCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] 
      }
    },
    {
      path: '/:id',
      name: 'ItemEdit',
      component: () => import('./views/ItemEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    }
  ];