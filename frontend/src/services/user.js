import api from "./api";

export const getUsers = () => api.get("/user");
export const getUserById = (id) => api.get(`/user/${id}`);
export const updateUser = (id, user) => api.put(`/user/${id}`, user);
export const deleteUser = (id) => api.delete(`/user/${id}`);
export const changePasswordByAdmin = (id, contraseña) => api.put(`/user/password/${id}`, contraseña);
export const changePassword = (passwordData) => api.put(`/user/change/password`, passwordData);
export const createUser = (user) => api.post(`/user`, user);

