import axios from "axios";

const url = "http://127.0.0.1:8000";

export const API = axios.create({
   baseURL: `${url}/api`,
});

export const productImageStorage = `${url}/storage/products`;

API.interceptors.request.use((config) => {
   const token = localStorage.getItem("accessToken");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
      
        // Hanya cek jika error.response ada (bukan error jaringan)
        if (error.response) { 
            if (error.response.status === 401) {
                // Hapus token yang bermasalah
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userInfo");

                localStorage.setItem("forceLogout", "1");
                
                // Redirect untuk memaksa user login
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);
