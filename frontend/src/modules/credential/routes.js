// modules/credential/routes.js
export default [
    {
      path: '/:id',
      name: 'CredentialEditPassword',
      component: () => import('./views/CredentialEditPassword.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden editar contraseñas
      }
    },
    {
      path: '/edit-status',
      name: 'CredentialEditStatus',
      component: () => import('./views/CredentialEditStatus.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'] // Solo los usuarios con rol ADMIN pueden cambiar el estado de las credenciales
      }
    }
  ];