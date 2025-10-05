import { createRouter, createWebHistory } from "vue-router";
import GeneralLayout from "../layout/GeneralLayout.vue";
import Products from "../pages/Products.vue";
import Categories from "../pages/Categories.vue";
import SalesManagement from "../pages/SalesManagement.vue";

const routes = [
  {
    path: "/",
    component: GeneralLayout,
    children: [
      { path: "", component: Products },
      { path: "/categories", component: Categories },
      { path: "/sales", component: SalesManagement },
    ],
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
