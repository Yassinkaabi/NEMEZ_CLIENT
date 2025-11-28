import { api } from './api';

export interface Review {
    _id: string;
    userId: {
        _id: string;
        name: string;
    };
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

export interface ReviewsResponse {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const reviewService = {
    // Submit a new review
    submitReview: async (data: { productId: string; rating: number; comment: string }) => {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    // Get all reviews for a product
    getProductReviews: async (productId: string, page = 1, limit = 10): Promise<ReviewsResponse> => {
        const response = await api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get user's review for a specific product
    getUserReview: async (productId: string) => {
        const response = await api.get(`/reviews/product/${productId}/my-review`);
        return response.data;
    },

    // Get all reviews by the authenticated user
    getUserReviews: async (page = 1, limit = 10) => {
        const response = await api.get(`/reviews/user/my-reviews?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Update a review
    updateReview: async (reviewId: string, data: { rating?: number; comment?: string }) => {
        const response = await api.put(`/reviews/${reviewId}`, data);
        return response.data;
    },

    // Delete a review
    deleteReview: async (reviewId: string) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },
};
