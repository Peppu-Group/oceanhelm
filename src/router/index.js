import { createRouter, createWebHistory } from 'vue-router'
import supabase from '../supabase'
import store from '../store'

import HomeView from '../views/HomeView.vue'
import FeaturesView from '../views/FeaturesView.vue'
import CaseStudies from '../views/CaseStudies.vue'
import IndustriesView from '../views/IndustriesView.vue'
import ContactUs from '../views/ContactUs.vue'
import PricingView from '../views/PricingView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import DashboardView from '../views/DashboardView.vue'
import CrewView from '../views/CrewView.vue'
import CrewSingleView from '../views/CrewSingleView.vue'
import MaintenanceRoute from '../views/MaintenanceRoute.vue'
import CrewRoute from '../views/CrewRoute.vue'
import InventoryView from '../views/InventoryView.vue'
import VoyageView from '../views/VoyageView.vue'
import LoginView from '../views/LoginView.vue'
import RedirectView from '../views/RedirectView.vue'
import SubRedirect from '../views/SubRedirect.vue'
import NewReq from '../views/NewReq.vue'
import ManageCertifications from '../views/ManageCertifications.vue'
import LogView from '../views/LogView.vue'
import ResetPassword from '../views/ResetPassword.vue'
import CompanyCode from '../views/CompanyCode.vue'
import VesselLog from '../views/VesselLog.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/features',
      name: 'features',
      component: FeaturesView,
      meta: {
        title: "Features | OceanHelm Maritime Software",
        description:
          "Explore OceanHelm's features: maintenance, inventory, crew management, voyage tracking, and compliance."
      }
    },
    {
      path: '/case-studies',
      name: 'case-studies',
      component: CaseStudies,
      meta: {
        title: "Case Studies",
        description:
          "See how African maritime companies reduced costs by 37% and downtime by 42% with OceanHelm fleet management software. Real customer success stories and results."
      }
    },
    {
      path: '/industries',
      name: 'industries',
      component: IndustriesView,
      meta: {
        title: "Industries We Serve | OceanHelm",
        description:
          "Discover how OceanHelm supports maritime logistics, oil & gas, shipping, and port operations."
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactUs,
      meta: {
        title: "Contact Us | OceanHelm",
        description: "Reach the OceanHelm team for support, partnerships, or product inquiries."
      }
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView,
      meta: {
        title: "Pricing Plans",
        description: "ransparent pricing for OceanHelm maritime fleet management software. Flexible plans for vessel operators, ship managers, and maritime companies in Nigeria and Africa."
      }
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
      path: '/app/requisition',
      name: 'newreq',
      component: NewReq,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/certifications/:id',
      name: 'certifications',
      component: ManageCertifications,
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
      path: '/app/voyage',
      name: 'voyage',
      component: VoyageView,
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
      path: '/activity-log',
      name: 'logview',
      component: LogView,
      meta: { requiresAuth: true }
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
    },
    {
      path: '/reset-password',
      name: 'resetpassword',
      component: ResetPassword
    },
    {
      path: '/get-code',
      name: 'code',
      component: CompanyCode
    },
    {
      path: '/vessel-log',
      name: 'VesselLog',
      component: VesselLog,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const { data, error } = await supabase.auth.getUser();
  const companyCode = localStorage.getItem('company-code')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!data?.user) {
      return next('/login');
    }

    if (!companyCode || companyCode !== import.meta.env.VITE_COMPANY_CODE) {
      return next('/login');
    }

    // Load user profile from store if not present
    if (!store.getters['user/userProfile']) {
      await store.dispatch('user/fetchUserProfile');
    }

    next(); // All checks passed
  } else {
    next(); // Route doesn't require auth
  }
});

router.afterEach((to) => {
  // Update title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Update description meta tag
  if (to.meta.description) {
    let tag = document.querySelector("meta[name='description']");
    if (tag) {
      tag.setAttribute("content", to.meta.description);
    }
  }
});

export default router
