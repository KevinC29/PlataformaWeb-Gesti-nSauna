// modules/itemType/routes.js
export default [
    {
      path: '',
      name: 'ItemTypesList',
      component: () => import('./views/ItemTypePage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/create',
      name: 'ItemTypeCreate',
      component: () => import('./views/ItemTypeCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/:id',
      name: 'ItemTypeEdit',
      component: () => import('./views/ItemTypeEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    }
  ];
  