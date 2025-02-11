import axios from 'axios';
import {notification} from "antd";

export const BASE_URL = 'http://localhost:3000';
// Axios instance oluştur
const axiosInstance = axios.create({
    baseURL: BASE_URL, timeout: 5000, headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});


axiosInstance.interceptors.response.use((response) => {
    if (response?.data?.message) {
        notification.destroy();
        notification.info({
            message: response.data.message
        })
    }
    return response;
}, (error) => {
    if (error.response?.data?.message) {
        notification.destroy();
        notification.warning({
            message: error.response.data.message
        })
    }
    return Promise.reject(error);
});


export default axiosInstance;
