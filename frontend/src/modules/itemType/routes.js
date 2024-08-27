// modules/itemType/routes.js
export default [
    {
      path: '/item-types',
      name: 'ItemTypesList',
      component: () => import('./views/ItemTypesList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden acceder a la lista de tipos de ítems
      }
    },
    {
      path: '/item-types/create',
      name: 'ItemTypeCreate',
      component: () => import('./views/ItemTypeCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden crear un nuevo tipo de ítem
      }
    },
    {
      path: '/item-types/:id',
      name: 'ItemTypeDetail',
      component: () => import('./views/ItemTypeDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden ver los detalles de un tipo de ítem específico
      }
    },
    {
      path: '/item-types/:id/edit',
      name: 'ItemTypeEdit',
      component: () => import('./views/ItemTypeEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar un tipo de ítem
      }
    },
    {
      path: '/item-types/:id/delete',
      name: 'ItemTypeDelete',
      component: () => import('./views/ItemTypeDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar un tipo de ítem
      }
    },
    {
      path: '/item-types/:id/edit-status',
      name: 'ItemTypeEditStatus',
      component: () => import('./views/ItemTypeEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado (activo/inactivo) de un tipo de ítem
      }
    }
  ];
  