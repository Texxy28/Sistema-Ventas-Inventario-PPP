import { defineStore } from "pinia";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../services/products";

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
        const res = await addProduct(newProduct);
        this.products.push(res.data.producto);
      } catch (err) {
        this.errorProducts = "No se pudo agregar el producto";
        console.error(err);
      }
    },
    async updateProduct(id, updatedProduct) {
      try {
        const res = await updateProduct(id, updatedProduct);
        const index = this.products.findIndex((product) => product.id_producto === id);
        if (index !== -1) {
          this.products[index] = res.data.producto;
        }
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
  },
});
