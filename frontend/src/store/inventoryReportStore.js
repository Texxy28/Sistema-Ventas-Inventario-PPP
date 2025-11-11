import { defineStore } from "pinia";
import { getBottomProductsByDateRange, getInentoryValue, getProductsLowStockByDateRange, getProductsNoMovementeByDateRange, getProductsSoldByCategoryByDateRange } from "../services/inventoryReports";

export const useInventoryReportStore = defineStore("inventoryReport", {
  state: () => ({
    productsLowStock: [],
    bottomProductsByDateRange: [],
    productsNoMovementByDateRange: [],
    inventoryValue: null,
    productsSoldByCategory: [],
    loadingInventoryReport: false,
    errorInventoryReport: null,
  }),
  actions: {
    async fetchProductsLowStockByDateRange(days) {
      this.loadingInventoryReport = true;
      this.errorInventoryReport = null;
      try {
        const res = await getProductsLowStockByDateRange(days);
        this.productsLowStock = res.data;
      } catch (err) {
        this.errorSalesReport = "No se pudo cargar el reporte de inventario";
        console.error(err);
      } finally {
        this.loadingInventoryReport = false;
      }
    },
    async fetchBottomProductsByDateRange(days) {
      const res = await getBottomProductsByDateRange(days);
      this.bottomProductsByDateRange = res.data;
    },
    async fetchProductsNoMovementByDateRange(days) {
      const res = await getProductsNoMovementeByDateRange(days);
      this.productsNoMovementByDateRange = res.data;
    },
    async fetchInventoryValue() {
      const res = await getInentoryValue();
      this.inventoryValue = res.data;
    },
    async fetchProductsSoldByCategoryByDateRange(days) {
      const res = await getProductsSoldByCategoryByDateRange(days);
      this.productsSoldByCategory = res.data;
    }
  },
});
