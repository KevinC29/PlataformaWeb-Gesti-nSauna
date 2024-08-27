// modules/comment/routes.js
export default [
    {
      path: '/comments',
      name: 'CommentsList',
      component: () => import('./views/CommentsList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden acceder a la lista de comentarios
      }
    },
    {
      path: '/comments/create',
      name: 'CommentCreate',
      component: () => import('./views/CommentCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CLIENT'] // Tanto ADMIN como CLIENT pueden crear comentarios
      }
    },
    {
      path: '/comments/:id/edit-status',
      name: 'CommentEditStatus',
      component: () => import('./views/CommentEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado de los comentarios
      }
    },
    {
      path: '/comments/:id/delete',
      name: 'CommentDelete',
      component: () => import('./views/CommentDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar comentarios
      }
    }
  ];
  