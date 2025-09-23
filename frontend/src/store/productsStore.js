import { defineStore } from "pinia";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../services/products";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getProducts();
        this.products = response.data;
      } catch (err) {
        this.error = "No se pudieron cargar los productos";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async addProduct(newProduct) {
      try {
        await addProduct(newProduct);
        this.products.push(newProduct);
      } catch (err) {
        this.error = "No se pudo agregar el producto";
        console.error(err);
      }
    },
    async updateProduct(id, updatedProduct) {
      try {
        await updateProduct(id, updatedProduct);
        const index = this.products.findIndex((product) => product.id_producto === id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedProduct };
        }
      } catch (err) {
        this.error = "No se pudo actualizar el producto";
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
        this.error = "No se pudo eliminar el producto";
        console.error(err);
      }
    },
  },
});
