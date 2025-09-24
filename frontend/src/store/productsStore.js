import { defineStore } from "pinia";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../services/products";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    loadingProducts: false,
    errorProducts: null,
  }),

  actions: {
    async fetchProducts() {
      this.loadingProducts = true;
      this.errorProducts = null;
      try {
        const response = await getProducts();
        this.products = response.data;
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
        this.products.push(newProduct);
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
