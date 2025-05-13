import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/app/maintenance',
      name: 'maintenance',
      component: MaintenanceView
    },
    {
      path: '/app/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

export default router
