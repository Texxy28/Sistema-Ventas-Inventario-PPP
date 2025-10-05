import { defineStore } from "pinia";
import { addSale } from "../services/sales";

export const useSaleStore = defineStore("sales", {
  state: () => ({
    sales: [],
    loadingSales: false,
    errorSales: null,
  }),
  actions: {
    async addSale(newSaleData) {
      try {
        const res = await addSale(newSaleData);
        this.sales.push(res.data.venta);
      } catch (err) {
        this.errorSales = "No se pudo agregar la venta";
        console.error(err);
      }
    },
  },
});
