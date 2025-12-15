import { defineStore } from "pinia";
import { getSuppliers } from "../services/suppliers";

export const useSupplierStore = defineStore("suppliers", {
    state: () => ({
        suppliers: [],
        loadingSuppliers: false,
        errorSuppliers: null
    }),
    actions: {
        async fetchSuppliers() {
            this.loadingSuppliers = true;
            this.errorSuppliers = null;
            try {
                const response = await getSuppliers();
                this.suppliers = response.data;
            } catch (err) {
                this.errorSuppliers = "No se pudieron cargar los proveedores";
                console.error(err);
            } finally {
                this.loadingSuppliers = false;
            }
        }
    }
})