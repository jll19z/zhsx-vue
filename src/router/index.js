import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  },
  {
    path: '/',
    name: '/',
    component: () => import('../layout'),
    redirect: '/users',
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/users/index.vue')
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/product/index.vue')
      },

      {
        path: 'tab',
        name: 'tab',
        component: () => import('@/views/productTab/index.vue')
      },
      // {
      //   path: 'tabadd',
      //   name: 'tabadd',
      //   component: () => import('@/views/productTab/add.vue')
      // },
      {
        path: 'master',
        name: 'master',
        component: () => import('@/views/orders/master.vue')
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/orders/detail.vue')
      },
      {
        path: 'banner',
        name: 'banner',
        component: () => import('@/views/banner/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
