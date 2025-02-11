import axiosInstance from "@/services/axiosInstance.js";

export const UserService = {
    getAll: async () => await axiosInstance.get('/users'),
    create: async (user) => await axiosInstance.post('/users', user),
    delete: async (id) => await axiosInstance.delete(`/users/${id}`),
    update: async (id, user) => await axiosInstance.put(`/users/${id}`, user),
}
