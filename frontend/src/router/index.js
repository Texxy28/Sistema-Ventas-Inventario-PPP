import { createRouter, createWebHistory } from "vue-router";
import GeneralLayout from "../layout/GeneralLayout.vue";
import Products from "../pages/Products.vue";
import Categories from "../pages/Categories.vue";
import SalesManagement from "../pages/SalesManagement.vue";
import Login from "../pages/Login.vue";
import { useAuthStore } from "../store/authStore";
import Dashboard from "../pages/Dashboard.vue";

const routes = [
  {
    path: "/",
    component: GeneralLayout,
    children: [
      { path: "", component: Products, meta: { requiresAuth: true, requiredRole: 'vendedor' } },
      { path: "/categories", component: Categories, meta: { requiresAuth: true, requiredRole: 'admin' } },
      { path: "/sales", component: SalesManagement, meta: { requiresAuth: true, requiredRole: 'admin' } },
      { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true, requiredRole: 'admin' } },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.user) await authStore.fetchUser();
  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiresRole;

  if (requiresAuth && !authStore.user) return next('/login');
  if (requiredRole && authStore.user?.rol !== requiredRole) return next('/');
  next();
});

export default router;
