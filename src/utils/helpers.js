import {jwtDecode} from "jwt-decode";

export const getDecodedToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwtDecode(token);
            resolve(decoded);
        } catch (error) {
            reject(error);
        }
    });
};

export const stripHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, '');
}