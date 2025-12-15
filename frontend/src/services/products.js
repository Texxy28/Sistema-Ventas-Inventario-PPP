import api from "./api";

export const getProducts = (page, limit) => api.get(`/product?page=${page}&limit=${limit}`);
export const getProductsByCategory = (categoryId, page, limit) => api.get(`/product/category?categoryId=${categoryId}&page=${page}&limit=${limit}`);
export const addProduct = (product) => api.post(`/product`, product);
export const updateProduct = (id, product) => api.put(`/product/${id}`, product);
export const deleteProduct = (id) => api.delete(`/product/${id}`);
export const getProductsBySearchQuery = (query, page, limit) => api.get(`/product/search?searchQuery=${query}&page=${page}&limit=${limit}`);
export const getProductsBySearchQueryAndCategory = (query, categoryId, page, limit) => api.get(`/product/search/category?searchQuery=${query}&categoryId=${categoryId}&page=${page}&limit=${limit}`);