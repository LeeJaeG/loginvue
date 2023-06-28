import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/site/HomeView.vue'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cloud-overview',
      name: 'cloudOverview',
      component: () => import('../views/cloud/CloudOverviewView.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/site/SettingView.vue')
    },
    {
      path: '/cloud-loadbalancer',
      name: 'cloudLoadbalancer',
      component: () => import('../views/cloud/LoadBalancerView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/site/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/site/DashboardView.vue')
    },
    {
      path: '/int',
      name: 'int',
      component: () => import('../views/service/INTView.vue')
    },
    {
      path: '/cloud-metric',
      name: 'cloudMetric',
      component: () => import('../views/cloud/CloudMetricView.vue')
    },
    {
      path: '/metric-test',
      name: 'metricTest',
      component: () => import('../views/cloud/MetricViewTMP.vue')
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: () => import('../views/service/AlarmView.vue')
    },
    {
      path: '/users',
      name: 'userManagement',
      component: () => import('../views/site/UserManagement.vue')
    },
    {
      path: '/cloud',
      name: 'cloud',
      component: () => import('../views/cloud/CloudView.vue')
    },
    {
      path: '/cloud/instance/:id',
      name: 'cloudInstance',
      component: () => import('../views/cloud/CloudInstanceView.vue')
    },
    {
      path: '/cloud-topology',
      name: 'cloudTopology',
      component: () => import('../views/cloud/CloudTopologyView.vue')
    },
    {
      path: '/cloud-topology-test',
      name: 'cloudTopologyTest',
      component: () => import('../views/cloud/CloudTopologyViewTMP.vue')
    },
    {
      path: '/physical-topology',
      name: 'kaloomTopology',
      component: () => import('../views/physical/PhysicalTopologyView.vue')
    },
    {
      path: '/physical-topology-test',
      name: 'kaloomTopologyTest',
      component: () => import('../views/physical/KaloomTopologyViewTMP.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/test/TestView.vue')
    },
  ]
})

const adminPath = [
  {
    path: '/users'
  },
]

router.beforeEach(async (to) => {
  // canUserAccess() returns `true` or `false`
  // console.log(to);
  for (const route of adminPath){
    if (route.path == to.path) {
      // console.log("First admin route checked", to.path, "=", route.path);
      // console.log("Admin role check")
      const canAccess = await canAdminAccess(to, route)
      if (!canAccess) return '/dashboard'
    }
  }
})

const canAdminAccess = (async()=>{ // 나중에는 필터로 admin 경로 리스트 중에 하나에 있는지 확인하는 식으로 수정해야할듯
  const user = useUserStore();
  const { userdata } = storeToRefs(user);
  if(userdata.value.role == 'admin'){
    // console.log('1', userdata.value.role);
    return true
  } else {
    // console.log('2', userdata.value.role);
    return false
  }
})

export default router
