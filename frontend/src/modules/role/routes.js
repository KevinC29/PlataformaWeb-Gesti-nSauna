// modules/role/routes.js
export default [
    {
      path: '/roles',
      name: 'RolesList',
      component: () => import('./views/RolesList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden acceder a la lista de roles
      }
    },
    {
      path: '/roles/create',
      name: 'RoleCreate',
      component: () => import('./views/RoleCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden crear un nuevo rol
      }
    },
    {
      path: '/roles/:id',
      name: 'RoleDetail',
      component: () => import('./views/RoleDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden ver los detalles de un rol específico
      }
    },
    {
      path: '/roles/:id/edit',
      name: 'RoleEdit',
      component: () => import('./views/RoleEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar un rol existente
      }
    },
    {
      path: '/roles/:id/delete',
      name: 'RoleDelete',
      component: () => import('./views/RoleDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar un rol
      }
    },
    {
      path: '/roles/:id/edit-status',
      name: 'RoleEditStatus',
      component: () => import('./views/RoleEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado (activo/inactivo) de un rol
      }
    }
  ];
  