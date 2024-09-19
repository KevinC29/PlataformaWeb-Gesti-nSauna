// modules/comment/routes.js
export default [
    {
      path: '',
      name: 'CommentList',
      component: () => import('./views/CommentPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
      }
    },
    {
      path: '/create',
      name: 'CommentCreate',
      component: () => import('./views/CommentCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CLIENT']
      }
    }
  ];
  