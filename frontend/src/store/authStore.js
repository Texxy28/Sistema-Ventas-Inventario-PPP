import { defineStore } from "pinia";
import { fecthMe, loginApi, logoutApi } from "../services/auth";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        loadingAuth: false,
        errorAuth: null
    }),
    actions: {
        async login(email, password) {
            this.loadingAuth = true;
            this.errorAuth = null;
            try {
                const res = await loginApi({ email, password });
                this.user = res.data.user
            } catch (err) { 
                this.errorAuth = "No se pudo iniciar sesión";
                console.log(err);
            } finally {
                this.loadingAuth = false;
            }
        },
        async logout() {
            await logoutApi();
            this.user = null;
        },
        async fetchUser() {
            try {
                const res = await fecthMe();
                this.user = res.data.user;
            } catch (err) {
                this.errorAuth = "No se pudo obtener sesión";
                console.log(err);
                this.user = null;
            }
        }
    }
})