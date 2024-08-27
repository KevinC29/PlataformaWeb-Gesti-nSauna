// modules/section/routes.js
export default [
    {
      path: '/sections',
      name: 'SectionsList',
      component: () => import('./views/SectionsList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden acceder a la lista de secciones
      }
    },
    {
      path: '/sections/create',
      name: 'SectionCreate',
      component: () => import('./views/SectionCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden crear una nueva sección
      }
    },
    {
      path: '/sections/:id',
      name: 'SectionDetail',
      component: () => import('./views/SectionDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden ver los detalles de una sección específica
      }
    },
    {
      path: '/sections/:id/edit',
      name: 'SectionEdit',
      component: () => import('./views/SectionEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar una sección existente
      }
    },
    {
      path: '/sections/:id/delete',
      name: 'SectionDelete',
      component: () => import('./views/SectionDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden eliminar una sección
      }
    },
    {
      path: '/sections/:id/edit-status',
      name: 'SectionEditStatus',
      component: () => import('./views/SectionEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar el estado (activo/inactivo) de una sección
      }
    }
  ];
  