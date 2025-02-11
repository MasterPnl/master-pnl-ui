import axiosInstance from "@/services/axiosInstance.js";

export const ListingService = {
    getAll: async () => await axiosInstance.get('/listing'),
    create: async (data) => await axiosInstance.post('/listing', data),
    update: async (showcaseIndex, data) => await axiosInstance.put(`/listing/${showcaseIndex}`, data),
    delete: async (showcaseIndex) => await axiosInstance.delete(`/listing/${showcaseIndex}`),
    images: async (showcaseIndex) => await axiosInstance.get(`/listing/${showcaseIndex}/images`),
    deleteImage: async (fileId) => await axiosInstance.delete(`/listing/${fileId}/image`),
}
