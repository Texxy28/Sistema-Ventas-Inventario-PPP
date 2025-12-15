import { defineStore } from "pinia";
import { addSale, getSales } from "../services/sales";

export const useSaleStore = defineStore("sales", {
  state: () => ({
    sales: [],
    totalPages: 1,
    currentPage: 1,
    loadingSales: false,
    errorSales: null,
  }),
  actions: {
    async addSale(newSaleData) {
      try {
        const res = await addSale(newSaleData);
        this.sales.push(res.data.venta);
        return res.data;
      } catch (err) {
        this.errorSales = "No se pudo agregar la venta";
        console.error(err);
      }
    },
    async fetchSales(page, limit) {
      this.loadingSales = true;
      this.errorSales = null;
      try {
        const response = await getSales(page, limit);
        this.sales = response.data.sales;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.errorSales = "No se pudieron cargar las ventas";
        console.error(err);
      } finally {
        this.loadingSales = false;
      }
    },
  },
});
