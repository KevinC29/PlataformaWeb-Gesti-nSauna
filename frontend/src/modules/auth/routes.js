export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/AuthLogin.vue'),
    meta: {
      requiresAuth: false // La página de inicio de sesión no requiere autenticación
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('./views/ResetPassword.vue'),
    meta: {
      requiresAuth: false // La página de restablecimiento de contraseña no requiere autenticación
    }
  }
];
