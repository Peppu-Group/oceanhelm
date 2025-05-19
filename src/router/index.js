import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import DashboardView from '../views/DashboardView.vue'
import CrewView from '../views/CrewView.vue'
import CrewSingleView from '../views/CrewSingleView.vue'
import MaintenanceRoute from '../views/MaintenanceRoute.vue'
import CrewRoute from '../views/CrewRoute.vue'
import InventoryView from '../views/InventoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/app/maintenance/:id',
      name: 'maintenance',
      component: MaintenanceView
    },
    {
      path: '/app/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/app/dashboard/maintenance',
      name: 'maintenanceroute',
      component: MaintenanceRoute
    },
    {
      path: '/app/dashboard/crew',
      name: 'crewroute',
      component: CrewRoute
    },
    {
      path: '/app/crew',
      name: 'crew',
      component: CrewView
    },
    {
      path: '/app/inventory',
      name: 'inventory',
      component: InventoryView
    },
    {
      path: '/app/crew/:id',
      name: 'crewsingle',
      component: CrewSingleView
    }
  ]
})

export default router
