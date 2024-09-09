export default [
    {
      path: '',
      name: 'SectionList',
      component: () => import('./views/SectionPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/create',
      name: 'SectionCreate',
      component: () => import('./views/SectionCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/:id',
      name: 'SectionEdit',
      component: () => import('./views/SectionEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    }
  ];
  