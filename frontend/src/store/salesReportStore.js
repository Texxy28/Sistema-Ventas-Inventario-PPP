import { defineStore } from "pinia";
import {
  getAverageSalesByDateRange,
  getSalesByCategoryByDateRange,
  getSalesByDateRange,
  getSalesByUserByDateRange,
  getSalesCountByDateRange,
  getTopProductsByDateRange,
} from "../services/salesReports";

export const useSalesReportStore = defineStore("salesReport", {
  state: () => ({
    salesByDateRange: null,
    salesCountByDateRange: null,
    topProductsByDateRange: [],
    averageSalesByDateRange: null,
    salesByCategoryByDateRange: [],
    salesByUserByDateRange: null,
    loadingSalesReport: false,
    errorSalesReport: null,
  }),

  actions: {
    async fetchSalesByDateRange(days) {
      this.loadingSalesReport = true;
      this.errorSalesReport = null;
      try {
        const res = await getSalesByDateRange(days);
        this.salesByDateRange = res.data;
      } catch (err) {
        this.errorSalesReport = "No se pudo cargar el reporte de ventas";
        console.error(err);
      } finally {
        this.loadingSalesReport = false;
      }
    },
    async fetchSalesCountByDateRange(days) {
      const res = await getSalesCountByDateRange(days);
      this.salesCountByDateRange = res.data;
    },
    async fetchTopProductsByDateRange(days) {
      const res = await getTopProductsByDateRange(days);
      this.topProductsByDateRange = res.data;
    },
    async fetchAverageSalesByDateRange(days) {
      const res = await getAverageSalesByDateRange(days);
      this.averageSalesByDateRange = res.data;
    },
    async fetchSalesByCategoryByDateRange(days) {
      const res = await getSalesByCategoryByDateRange(days);
      this.salesByCategoryByDateRange = res.data;
    },
    async fetchSalesByUserByDateRange(days) {
      const res = await getSalesByUserByDateRange(days);
      this.salesByUserByDateRange = res.data;
    },
  },
});
