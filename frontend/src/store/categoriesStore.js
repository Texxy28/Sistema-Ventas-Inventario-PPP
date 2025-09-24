import { defineStore } from "pinia";
import { getCategories } from "../services/categories";

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
        }
    }
})