import api from "./api";

export const getVoucherById = (id) => api.get(`/voucher/${id}`);
