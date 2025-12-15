import api from "./api";

export const addSale = (saleData) => api.post(`/sale`, saleData);
export const getSales = (page, limit) => api.get(`/sale?page=${page}&limit=${limit}`);