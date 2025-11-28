import { api } from './api';

// User Management
export const getAllUsers = (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    return api.get('/admin/users', { params });
};

export const getUserById = (id: string) => {
    return api.get(`/admin/users/${id}`);
};

export const updateUser = (id: string, data: any) => {
    return api.put(`/admin/users/${id}`, data);
};

export const deleteUser = (id: string) => {
    return api.delete(`/admin/users/${id}`);
};

export const updateUserPermissions = (id: string, permissions: any) => {
    return api.put(`/admin/users/${id}/permissions`, { permissions });
};

export const getUserStats = () => {
    return api.get('/admin/users/stats');
};

// Product Management
export const getAllProducts = (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) => {
    return api.get('/admin/products', { params });
};

export const getProductById = (id: string) => {
    return api.get(`/admin/products/${id}`);
};

export const createProduct = (data: any) => {
    return api.post('/admin/products', data);
};

export const updateProduct = (id: string, data: any) => {
    return api.put(`/admin/products/${id}`, data);
};

export const deleteProduct = (id: string) => {
    return api.delete(`/admin/products/${id}`);
};

export const getProductStats = () => {
    return api.get('/admin/products/stats');
};

// Category Management
export const getAllCategories = () => {
    return api.get('/admin/categories');
};

export const getCategoryById = (id: string) => {
    return api.get(`/admin/categories/${id}`);
};

export const createCategory = (data: any) => {
    return api.post('/admin/categories', data);
};

export const updateCategory = (id: string, data: any) => {
    return api.put(`/admin/categories/${id}`, data);
};

export const deleteCategory = (id: string) => {
    return api.delete(`/admin/categories/${id}`);
};

export const getCategoryStats = () => {
    return api.get('/admin/categories/stats');
};

// Order Management
export const getAllOrders = (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    return api.get('/admin/orders', { params });
};

export const getOrderById = (id: string) => {
    return api.get(`/admin/orders/${id}`);
};

export const updateOrderStatus = (id: string, status: string) => {
    return api.put(`/admin/orders/${id}/status`, { status });
};

export const deleteOrder = (id: string) => {
    return api.delete(`/admin/orders/${id}`);
};

export const getOrderStats = () => {
    return api.get('/admin/orders/stats');
};

// Review Management
export const getAllReviews = (params?: { page?: number; limit?: number; productId?: string; rating?: number }) => {
    return api.get('/admin/reviews', { params });
};

export const getReviewById = (id: string) => {
    return api.get(`/admin/reviews/${id}`);
};

export const deleteReview = (id: string) => {
    return api.delete(`/admin/reviews/${id}`);
};

export const getReviewStats = () => {
    return api.get('/admin/reviews/stats');
};

// Advertisement Management
export const getAllAdvertisements = (params?: { page?: number; limit?: number; status?: string }) => {
    return api.get('/admin/advertisements', { params });
};

export const getAdvertisementStats = (id: string) => {
    return api.get(`/admin/advertisements/${id}/stats`);
};

export const createAdvertisement = (data: any) => {
    return api.post('/admin/advertisements', data);
};

export const updateAdvertisement = (id: string, data: any) => {
    return api.put(`/admin/advertisements/${id}`, data);
};

export const deleteAdvertisement = (id: string) => {
    return api.delete(`/admin/advertisements/${id}`);
};

export const sendAdvertisementEmail = (id: string) => {
    return api.post(`/admin/advertisements/${id}/send-email`);
};

// Newsletter Management
export const getAllSubscribers = (params?: { page?: number; limit?: number; isActive?: boolean }) => {
    return api.get('/admin/newsletter/subscribers', { params });
};

export const getSubscriberStats = () => {
    return api.get('/admin/newsletter/stats');
};

