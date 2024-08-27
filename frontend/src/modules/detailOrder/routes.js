// modules/detailOrder/routes.js
export default [
    {
      path: '/detail-orders',
      name: 'DetailOrdersList',
      component: () => import('./views/DetailOrdersList.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // Tanto ADMIN como CASHIER pueden acceder a la lista de detalles de órdenes
      }
    },
    {
      path: '/detail-orders/create',
      name: 'DetailOrderCreate',
      component: () => import('./views/DetailOrderCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // Tanto ADMIN como CASHIER pueden crear un nuevo detalle de orden
      }
    },
    {
      path: '/detail-orders/:id',
      name: 'DetailOrderDetail',
      component: () => import('./views/DetailOrderDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // Tanto ADMIN como CASHIER pueden ver un detalle de orden específico
      }
    },
    {
      path: '/detail-orders/:id/edit',
      name: 'DetailOrderEdit',
      component: () => import('./views/DetailOrderEdit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // Tanto ADMIN como CASHIER pueden editar un detalle de orden
      }
    },
    {
      path: '/detail-orders/:id/delete',
      name: 'DetailOrderDelete',
      component: () => import('./views/DetailOrderDelete.vue'),
      meta: {
        requiresAuth: true,
        roles: ['ADMIN', 'CASHIER'] // Tanto ADMIN como CASHIER pueden eliminar un detalle de orden
      }
    }
  ];