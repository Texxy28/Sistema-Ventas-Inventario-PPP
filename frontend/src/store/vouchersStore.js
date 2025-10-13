import { defineStore } from "pinia";
import { getVoucherById } from "../services/vouchers";

export const useVoucherStore = defineStore("vouchers", {
  state: () => ({
    vouchers: [],
    voucher: null,
    loadingVouchers: false,
    errorVouchers: null,
  }),
  actions: {
    async fetchById(id) {
      this.loadingVouchers = true;
      this.errorVouchers = null;
      try {
        const res = await getVoucherById(id);
        this.voucher = res.data.comprobante;
      } catch (err) {
        this.errorCategories = "No se pudo obtener el comprobante";
        console.error(err);
      } finally {
        this.loadingVouchers = false;
      }
    },
  },
});
