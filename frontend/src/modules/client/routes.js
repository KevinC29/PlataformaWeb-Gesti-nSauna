// modules/client/routes.js
export default [
  {
    path: '/clients',
    name: 'ClientsList',
    component: () => import('./views/ClientsList.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/clients/create',
    name: 'ClientCreate',
    component: () => import('./views/ClientCreate.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetail',
    component: () => import('./views/ClientDetail.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/clients/:id/edit',
    name: 'ClientEdit',
    component: () => import('./views/ClientEdit.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'CASHIER']
    }
  },
  {
    path: '/clients/:id/delete',
    name: 'ClientDelete',
    component: () => import('./views/ClientDelete.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN']
    }
  }
];
