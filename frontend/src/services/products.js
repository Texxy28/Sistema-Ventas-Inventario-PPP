import api from "./api";

export const getProducts = (page, limit) => api.get(`/product?page=${page}&limit=${limit}`);
export const addProduct = (product) => api.post(`/product`, product);
export const updateProduct = (id, product) => api.put(`/product/${id}`, product);
export const deleteProduct = (id) => api.delete(`/product/${id}`);