import { createRouter, createWebHistory } from "vue-router";
import GeneralLayout from "../layout/GeneralLayout.vue";
import Products from "../pages/Products.vue";
import Categories from "../pages/Categories.vue";
import SalesManagement from "../pages/SalesManagement.vue";
import Login from "../pages/Login.vue";
import { useAuthStore } from "../store/authStore";
import Dashboard from "../pages/Dashboard.vue";
import Sales from "../pages/Sales.vue";
import Movements from "../pages/Movements.vue";
import Users from "../pages/Users.vue";

const routes = [
  {
    path: "/",
    component: GeneralLayout,
    children: [
      {
        path: "/productos",
        component: Products,
        meta: { requiresAuth: true, requiredRole: ["admin", "vendedor"] },
      },
      {
        path: "/categories",
        component: Categories,
        meta: { requiresAuth: true, requiredRole: "admin" },
      },
      {
        path: "/sales-control",
        component: SalesManagement,
        meta: { requiresAuth: true, requiredRole: ["admin", "vendedor"] },
      },
      {
        path: "/dashboard",
        component: Dashboard,
        meta: { requiresAuth: true, requiredRole: "admin" },
      },
      {
        path: "/sales",
        component: Sales,
        meta: { requiresAuth: true, requiredRole: "admin" },
      },
      {
        path: "/movements",
        component: Movements,
        meta: { requiresAuth: true, requiredRole: "admin" },
      },
      {
        path: "/users",
        component: Users,
        meta: { requiresAuth: true, requiredRole: "admin" },
      },
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
  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiredRole;

  const authStore = useAuthStore();

  if (!requiredRole) { return next(); }

  if (!authStore.user) await authStore.fetchUser();

  if (requiresAuth && !authStore.user) return next("/login");

  if (requiredRole && !requiredRole.includes(authStore.user?.rol)) {
    return next(from.fullPath);
  }
  next();
});

export default router;
