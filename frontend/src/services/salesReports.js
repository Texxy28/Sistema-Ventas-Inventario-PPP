import api from "./api";

export const getSalesByDateRange = (days) => api.get(`/report/sales?days=${days}`);
export const getSalesCountByDateRange = (days) => api.get(`/report/sales/count?days=${days}`);
export const getTopProductsByDateRange = (days) => api.get(`/report/products/top?days=${days}`);
export const getAverageSalesByDateRange = (days) => api.get(`/report/average/sales?days=${days}`);
export const getSalesByCategoryByDateRange = (days) => api.get(`/report/sales/category?days=${days}`);
export const getSalesByUserByDateRange = (days) => api.get(`/report/sales/user?days=${days}`);