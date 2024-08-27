export default [
    {
      path: '/clients',
      name: 'ClientList',
      component: () => import('./views/ClientList.vue'),
    },
    {
      path: '/clients/:id',
      name: 'ClientDetail',
      component: () => import('./views/ClientDetail.vue'),
    },
  ];