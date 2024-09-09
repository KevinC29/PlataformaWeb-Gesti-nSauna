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
    }
  ];
  