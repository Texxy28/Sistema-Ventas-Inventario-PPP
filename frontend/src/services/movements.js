import api from "./api";

export const getMovements = (page, limit) => api.get(`/movement?page=${page}&limit=${limit}`);