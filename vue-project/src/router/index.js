import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setting',
      name: 'setting',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/int',
      name: 'int',
      component: () => import('../views/INTView.vue')
    },
    {
      path: '/metric',
      name: 'metric',
      component: () => import('../views/MetricView.vue')
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: () => import('../views/AlarmView.vue')
    },
  ]
})

export default router
