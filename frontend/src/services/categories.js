import api from "./api";

export const getCategories = () => api.get("/category");
export const getCategoriesWithProductCount = () => api.get("/category/productCount");
export const addCategory = (category) => api.post(`/category`, category);
export const updateCategory = (id, category) => api.put(`/category/${id}`, category);
export const deleteCategory = (id) => api.delete(`/category/${id}`);