import { createRouter, createWebHistory } from 'vue-router'
import supabase from '../supabase'
import store from '../store'

import HomeView from '../views/HomeView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import DashboardView from '../views/DashboardView.vue'
import CrewView from '../views/CrewView.vue'
import CrewSingleView from '../views/CrewSingleView.vue'
import MaintenanceRoute from '../views/MaintenanceRoute.vue'
import CrewRoute from '../views/CrewRoute.vue'
import InventoryView from '../views/InventoryView.vue'
import LoginView from '../views/LoginView.vue'
import RedirectView from '../views/RedirectView.vue'
import SubRedirect from '../views/SubRedirect.vue'

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
      component: MaintenanceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard/maintenance',
      name: 'maintenanceroute',
      component: MaintenanceRoute,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard/crew',
      name: 'crewroute',
      component: CrewRoute,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/crew',
      name: 'crew',
      component: CrewView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/inventory',
      name: 'inventory',
      component: InventoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/crew/:id',
      name: 'crewsingle',
      component: CrewSingleView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: RedirectView
    },
    {
      path: '/subredirect',
      name: 'subredirect',
      component: SubRedirect
    }
  ]
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const { data, error } = await supabase.auth.getUser();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!data?.user) {
      return next('/login');
    }

    // Fetch user profile from Vuex if not already loaded
    if (!store.getters['user/userProfile']) {
      await store.dispatch('user/fetchUserProfile');
    }

    const profile = store.getters['user/userProfile'];

    if (!profile) {
      return next('/login');
    }
    const allowedRoles = ['owner', 'captain'];
    const isAuthorizedRole = allowedRoles.includes(profile.role);

    // Optional: check if this route has a vesselId param and enforce access restriction
    if (to.params.id && isAuthorizedRole) {
      const vesselId = to.params.id;
      // compare profile.vessel with vesselId
      if (profile.role == 'captain' && vesselId !== profile.vessel) {
        Swal.fire({
          title: "Route Protected!",
          text: `You have ${profile.role}, you don't have access to this inormation`,
          icon: "info"
        });
      }
    }
    next();
  } else {
    next();
  }
});

export default router
