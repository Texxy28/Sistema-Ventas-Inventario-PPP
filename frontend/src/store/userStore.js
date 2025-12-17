import { defineStore } from "pinia";
import {
  changePassword,
  changePasswordByAdmin,
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/user";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    loadingUsers: false,
    errorUsers: null,
  }),
  actions: {
    async fetchUsers() {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        const response = await getUsers();
        this.users = response.data;
      } catch (err) {
        this.errorUsers = "No se pudieron cargar los usuarios";
        console.error(err);
      } finally {
        this.loadingUsers = false;
      }
    },
    async passwordByAdmin(userId, contraseña) {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        const res = await changePasswordByAdmin(userId, contraseña);
        return res.data;
      } catch (err) {
        this.errorUsers = "No se pudo cambiar la contraseña";
        console.error(err);
      } finally {
        this.loadingUsers = false;
      }
    },
    async changePasswordByUser(currentPassword, newPassword, confirmPassword) {
      try {
        const res = await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        return res.data;
      } catch (err) {
        this.errorUsers = "No se pudo cambiar la contraseña";
        console.error(err);
      }
    },
    async updateUserInfo(id, updatedUser) {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        const res = await updateUser(id, updatedUser);
        const index = this.users.findIndex((user) => user.id_usuario === id);
        if (index !== -1) {
          this.users[index] = res.data.user;
        }
      } catch (err) {
        this.errorUsers = "No se pudo actualizar el usuario";
        console.error(err);
      } finally {
        this.loadingUsers = false;
      }
    },
    async addUser(user) {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        const res = await createUser(user);
        this.users.push(res.data.user);
      } catch (err) {
        this.errorUsers = "No se pudo agregar el usuario";
        console.error(err);
      } finally {
        this.loadingUsers = false;
      }
    },
    async eraseUser(id) {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        await deleteUser(id);
        this.users = this.users.filter((user) => user.id_usuario !== id);
      } catch (err) {
        this.errorUsers = "No se pudo eliminar el usuario";
        console.error(err);
      } finally {
        this.loadingUsers = false;
      }
    },
  },
});
