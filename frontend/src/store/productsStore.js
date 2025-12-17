import { defineStore } from "pinia";
import { addProduct, deleteProduct, getProducts, getProductsByCategory, getProductsBySearchQuery, getProductsBySearchQueryAndCategory, updateProduct } from "../services/products";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    totalPages: 1,
    currentPage: 1,
    loadingProducts: false,
    errorProducts: null,
  }),

  actions: {
    async fetchProducts(page, limit) {
      this.loadingProducts = true;
      this.errorProducts = null;
      try {
        const response = await getProducts(page, limit);
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.errorProducts = "No se pudieron cargar los productos";
        console.error(err);
      } finally {
        this.loadingProducts = false;
      }
    },
    async addProduct(newProduct) {
      try {
       await addProduct(newProduct);
      } catch (err) {
        this.errorProducts = "No se pudo agregar el producto";
        console.error(err);
      }
    },
    async updateProduct(id, updatedProduct) {
      try {
        await updateProduct(id, updatedProduct);
      } catch (err) {
        this.errorProducts = "No se pudo actualizar el producto";
        console.error(err);
      }
    },
    async deleteProduct(id) {
      try {
        await deleteProduct(id);
        this.products = this.products.filter(
          (product) => product.id_producto !== id
        );
      } catch (err) {
        this.errorProducts = "No se pudo eliminar el producto";
        console.error(err);
      }
    },
    async fetchProductsByCategory(categoryId, page, limit) {
      this.loadingProducts = true;
      this.errorProducts = null;
      try {
        const response = await getProductsByCategory(categoryId, page, limit);
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.errorProducts = "No se pudieron cargar los productos";
        console.error(err);
      } finally {
        this.loadingProducts = false;
      }
    },
    async fetchProductsBySearch(searchTerm, page, limit) {
      this.loadingProducts = true;
      this.errorProducts = null;
      try {
        const response = await getProductsBySearchQuery(searchTerm, page, limit);
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.errorProducts = "No se pudieron cargar los productos";
        console.error(err);
      } finally {
        this.loadingProducts = false;
      }
    },
    async fetchProductsBySearchAndCategory(searchTerm, categoryId, page, limit) {
      this.loadingProducts = true;
      this.errorProducts = null;
      try {
        const response = await getProductsBySearchQueryAndCategory(searchTerm, categoryId, page, limit);
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.errorProducts = "No se pudieron cargar los productos";
        console.error(err);
      } finally {
        this.loadingProducts = false;
      }
    }
  },
});
