import api from "./api";

export const addSale = (saleData) => api.post(`/sale`, saleData);
