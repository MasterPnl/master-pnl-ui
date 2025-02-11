import axiosInstance from "@/services/axiosInstance.js";

export const AuthService = {
    login: async ({username, password}) => await axiosInstance.post('/auth/login', {username, password}),
    logout: async () => await axiosInstance.get('/auth/logout'),
}
