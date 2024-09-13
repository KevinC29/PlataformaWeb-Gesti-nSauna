// modules/role/routes.js
export default [
    {
      path: '',
      name: 'RoleList',
      component: () => import('./views/RolePage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/create',
      name: 'RoleCreate',
      component: () => import('./views/RoleCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/:id',
      name: 'RoleEdit',
      component: () => import('./views/RoleEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    }
  ];
  