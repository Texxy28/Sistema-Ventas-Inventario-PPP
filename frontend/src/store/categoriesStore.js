import { defineStore } from "pinia";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithProductCount,
  updateCategory,
} from "../services/categories";

export const useCategoryStore = defineStore("categories", {
  state: () => ({
    categories: [],
    loadingCategories: false,
    errorCategories: null,
  }),
  actions: {
    async fetchCategories() {
      this.loadingCategories = true;
      this.errorCategories = null;
      try {
        const response = await getCategories();
        this.categories = response.data;
      } catch (err) {
        this.errorCategories = "No se pudieron cargar las categorías";
        console.error(err);
      } finally {
        this.loadingCategories = false;
      }
    },
    async fetchCategoriesWithProductCount() {
      this.loadingCategories = true;
      this.errorCategories = null;
      try {
        const response = await getCategoriesWithProductCount();
        this.categories = response.data;
      } catch (err) {
        this.errorCategories = "No se pudieron cargar las categorías";
        console.error(err);
      } finally {
        this.loadingCategories = false;
      }
    },
    async addCategory(newCategory) {
      try {
        const res = await addCategory(newCategory);
        this.categories.push(res.data.categoria);
      } catch (err) {
        this.errorCategories = "No se pudo agregar la categoría";
        console.error(err);
      }
    },
    async updateCategory(id, updatedCategory) {
      try {
        const res = await updateCategory(id, updatedCategory);
        const index = this.categories.findIndex(
          (category) => category.id_categoria === id
        );
        if (index !== -1) {
          this.categories[index] = res.data.categoria;
        }
      } catch (err) {
        this.errorCategories = "No se pudo actualizar la categoría";
        console.error(err);
      }
    },
    async deleteCategory(id) {
      try {
        await deleteCategory(id);
        this.categories = this.categories.filter(
          (category) => category.id_categoria !== id
        );
      } catch (err) {
        this.errorCategories = "No se pudo eliminar la categoría";
        console.error(err);
      }
    },
  },
});
