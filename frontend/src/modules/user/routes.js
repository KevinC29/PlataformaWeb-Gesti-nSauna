// modules/user/routes.js
export default [
    {
      path: '/users',
      name: 'UsersList',
      component: () => import('./views/UsersList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // ADMIN y CASHIER pueden acceder a la lista de usuarios
      }
    },
    {
      path: '/users/create',
      name: 'UserCreate',
      component: () => import('./views/UserCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden crear un nuevo usuario
      }
    },
    {
      path: '/users/:id',
      name: 'UserDetail',
      component: () => import('./views/UserDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // ADMIN y CASHIER pueden ver los detalles de un usuario específico
      }
    },
    {
      path: '/users/:id/edit',
      name: 'UserEdit',
      component: () => import('./views/UserEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar un usuario existente
      }
    },
    {
      path: '/users/:id/delete',
      name: 'UserDelete',
      component: () => import('./views/UserDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar un usuario
      }
    },
    {
      path: '/users/:id/edit-status',
      name: 'UserEditStatus',
      component: () => import('./views/UserEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado (activo/inactivo) de un usuario
      }
    }
  ];
  