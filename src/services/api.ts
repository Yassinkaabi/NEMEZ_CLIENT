import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Ne pas tenter de refresh pour les routes d'authentification
        const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/signup') ||
                           originalRequest.url?.includes('/auth/refresh');

        // Seulement rafraîchir si :
        // 1. C'est une erreur 401
        // 2. Ce n'est pas une route d'authentification
        // 3. On n'a pas déjà essayé de rafraîchir
        // 4. Un refreshToken existe
        if (error.response?.status === 401 && 
            !isAuthRoute && 
            !originalRequest._retry && 
            localStorage.getItem('refreshToken')) {
            
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Le refresh a échoué, nettoyer et rediriger
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Pour toutes les autres erreurs (y compris login/signup échoués)
        return Promise.reject(error);
    }
);