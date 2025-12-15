import { defineStore } from "pinia";
import { getMovements } from "../services/movements";

export const useMovementStore = defineStore("movements", {
    state: () => ({
        movements: [],
        totalPages: 1,
        currentPage: 1,
        loadingMovements: false,
        errorMovements: null
    }),
    actions: {
        async fetchMovements(page, limit) {
            this.loadingMovements = true;
            this.errorMovements = null;
            try {
                const response = await getMovements(page, limit);
                this.movements = response.data.movements;
                this.totalPages = response.data.totalPages;
                this.currentPage = response.data.currentPage;
            } catch (err) {
                this.errorMovements = "No se pudieron cargar los movimientos";
                console.error(err);
            } finally {
                this.loadingMovements = false;
            }
        }
    }
})