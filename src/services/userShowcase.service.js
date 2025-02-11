import axiosInstance from "@/services/axiosInstance.js";

export const UserShowcaseService = {
    create: async (userShowcase) => await axiosInstance.post('/userShowcase', userShowcase),
    getAll: async (userShowcase) => await axiosInstance.get('/userShowcase', userShowcase),
    delete: async (showcaseIndex) => await axiosInstance.delete(`/userShowcase/${showcaseIndex}`),
}
