import api from "./api";

export const getSalesByDateRange = (days) => api.get(`/report/sales?days=${days}`);
export const getSalesCountByDateRange = (days) => api.get(`/report/salesCount?days=${days}`);
export const getTopProductsByDateRange = (days) => api.get(`/report/productsTop?days=${days}`);
export const getAverageSalesByDateRange = (days) => api.get(`/report/averageSales?days=${days}`);
export const getSalesByCategoryByDateRange = (days) => api.get(`/report/salesCategory?days=${days}`);
export const getSalesByUserByDateRange = (days) => api.get(`/report/salesUser?days=${days}`);