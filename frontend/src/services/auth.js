import api from "./api";

export const registerApi = (user) => api.post("/auth/register", user);
export const loginApi = (loginData) => api.post("/auth/login", loginData);
export const logoutApi = () => api.post("/auth/logout");
export const fecthMe = () => api.get("/auth/me");