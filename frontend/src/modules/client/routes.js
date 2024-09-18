// modules/client/routes.js
export default [
  {
    path: '',
    name: 'ClientList',
    component: () => import('./views/ClientPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/create',
    name: 'ClientCreate',
    component: () => import('./views/ClientCreate.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/:id',
    name: 'ClientEdit',
    component: () => import('./views/ClientEdit.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  }
];
