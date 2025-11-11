import api from "./api";

export const getProductsLowStockByDateRange = (days) => api.get(`/inventoryReport/products/low/stock?days=${days}`); 
export const getBottomProductsByDateRange = (days) => api.get(`/inventoryReport/products/bottom?days=${days}`);
export const getProductsNoMovementeByDateRange = (days) => api.get(`/inventoryReport/products/no/movement?days=${days}`);
export const getInentoryValue = () => api.get(`/inventoryReport/inventory/value`);
export const getProductsSoldByCategoryByDateRange = (days) => api.get(`/inventoryReport/products/sold/category?days=${days}`);
