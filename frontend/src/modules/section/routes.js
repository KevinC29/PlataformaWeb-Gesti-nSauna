export default [
  {
    path: '',
    name: 'SectionsList',
    component: () => import('./views/SectionPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN']
    }
  // },
  // {
  //   path: 'create',
  //   name: 'SectionCreate',
  //   component: () => import('./views/SectionCreate.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     roles: ['ADMIN']
  //   }
  // },
  // {
  //   path: ':id',
  //   name: 'SectionDetail',
  //   component: () => import('./views/SectionDetail.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     roles: ['ADMIN']
  //   }
  // },
  // {
  //   path: ':id/edit',
  //   name: 'SectionEdit',
  //   component: () => import('./views/SectionEdit.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     roles: ['ADMIN']
  //   }
  // },
  // {
  //   path: ':id/delete',
  //   name: 'SectionDelete',
  //   component: () => import('./views/SectionDelete.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     roles: ['ADMIN']
  //   }
  // },
  // {
  //   path: ':id/edit-status',
  //   name: 'SectionEditStatus',
  //   component: () => import('./views/SectionEditStatus.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     roles: ['ADMIN']
  //   }
  }
];
