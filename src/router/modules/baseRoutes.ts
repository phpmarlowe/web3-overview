export const baseRoutes = [
  {
    name: 'PageNotFound',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/',
    name: '',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('@/views/LoginView/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    /*
     * route level code-splitting
     * this generates a separate chunk (About.[hash].js) for this route
     * which is lazy-loaded when the route is visited.
     */
    component: () => import('@views/Error/404.vue'),
  },
]
