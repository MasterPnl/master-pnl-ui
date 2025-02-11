import axiosInstance from "@/services/axiosInstance.js";

export const ShowcaseService = {
    create: async (showcase) => await axiosInstance.post('/showcase', showcase),
    findOne: async () => await axiosInstance.get('/showcase'),
}
