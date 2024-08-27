// modules/item/routes.js
export default [
    {
      path: '/items',
      name: 'ItemsList',
      component: () => import('./views/ItemsList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden acceder a la lista de ítems
      }
    },
    {
      path: '/items/create',
      name: 'ItemCreate',
      component: () => import('./views/ItemCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden crear un nuevo ítem
      }
    },
    {
      path: '/items/:id',
      name: 'ItemDetail',
      component: () => import('./views/ItemDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden ver los detalles de un ítem específico
      }
    },
    {
      path: '/items/:id/edit',
      name: 'ItemEdit',
      component: () => import('./views/ItemEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar un ítem
      }
    },
    {
      path: '/items/:id/delete',
      name: 'ItemDelete',
      component: () => import('./views/ItemDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar un ítem
      }
    },
    {
      path: '/items/:id/edit-status',
      name: 'ItemEditStatus',
      component: () => import('./views/ItemEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado de un ítem
      }
    }
  ];