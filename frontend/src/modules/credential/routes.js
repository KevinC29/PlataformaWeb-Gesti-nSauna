// modules/credential/routes.js
export default [
  {
    path: '',
    name: 'CredentialUser',
    component: () => import('./views/CredentialUserPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CLIENT']
    }
  },
  {
    path: '/:id',
    name: 'CredentialEdit',
    component: () => import('./views/CredentialEdit.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CLIENT'],
    }
  },

];