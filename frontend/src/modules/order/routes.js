// modules/order/routes.js
export default [
    {
      path: '/orders',
      name: 'OrdersList',
      component: () => import('./views/OrdersList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER', 'MANAGER'] // ADMIN, CASHIER y MANAGER pueden acceder a la lista de órdenes
      }
    },
    {
      path: '/orders/create',
      name: 'OrderCreate',
      component: () => import('./views/OrderCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // ADMIN y CASHIER pueden crear nuevas órdenes
      }
    },
    {
      path: '/orders/:id',
      name: 'OrderDetail',
      component: () => import('./views/OrderDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER', 'MANAGER'] // ADMIN, CASHIER y MANAGER pueden ver los detalles de una orden específica
      }
    },
    {
      path: '/orders/:id/edit',
      name: 'OrderEdit',
      component: () => import('./views/OrderEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // ADMIN y CASHIER pueden editar una orden existente
      }
    },
    {
      path: '/orders/:id/delete',
      name: 'OrderDelete',
      component: () => import('./views/OrderDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // ADMIN y CASHIER pueden eliminar una orden
      }
    },
    {
      path: '/orders/by-date',
      name: 'OrdersByDate',
      component: () => import('./views/OrdersByDate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER', 'MANAGER'] // ADMIN, CASHIER y MANAGER pueden ver órdenes por fecha
      }
    }
  ];
  