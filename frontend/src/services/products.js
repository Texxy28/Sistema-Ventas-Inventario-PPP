import api from "./api";

export const getProducts = () => api.get("/product");
export const addProduct = (product) => api.post(`/product`, product);
export const updateProduct = (id, product) => api.put(`/product/${id}`, product);
export const deleteProduct = (id) => api.delete(`/product/${id}`);