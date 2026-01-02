import { useState } from 'react';
import { Space, Typography, Divider, Button, Spin, Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';
import type { Review } from '../services/reviewService';
import { reviewService } from '../services/reviewService';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

const { Title } = Typography;

interface ReviewListProps {
    productId: string;
    currentUserId?: number;
    isAdmin?: boolean;
    isAuthenticated?: boolean;
}

const ReviewList = ({ productId, currentUserId, isAdmin, isAuthenticated }: ReviewListProps) => {
    const [page, setPage] = useState(1);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch product reviews
    const { data: reviewsData, isLoading, refetch } = useQuery({
        queryKey: ['reviews', productId, page],
        queryFn: () => reviewService.getProductReviews(productId, page, 10),
    });

    // Fetch user's review for this product (if authenticated)
    const { data: userReviewData } = useQuery({
        queryKey: ['userReview', productId],
        queryFn: () => reviewService.getUserReview(productId),
        enabled: isAuthenticated,
        retry: false,
    });

    const userReview = userReviewData?.review;
    const hasUserReview = !!userReview;

    const handleEditClick = (review: Review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingReview(null);
        refetch();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingReview(null);
    };

    const handleDeleteSuccess = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.averageRating || 0;
    const totalReviews = reviewsData?.totalReviews || 0;
    const pagination = reviewsData?.pagination;

    return (
        <div style={{ marginTop: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Avis clients
                    </Title>
                    {totalReviews > 0 && (
                        <div style={{ marginTop: 8, fontSize: 16, color: '#666' }}>
                            {averageRating.toFixed(1)} ★ · {totalReviews} avis
                        </div>
                    )}
                </div>

                {isAuthenticated && !hasUserReview && !showForm && (
                    <Button
                        type="primary"
                        onClick={() => setShowForm(true)}
                        style={{
                            background: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            height: '40px',
                            padding: '0 24px',
                        }}
                    >
                        Laisser un avis
                    </Button>
                )}
            </div>

            {/* Review Form */}
            {isAuthenticated && (showForm || (hasUserReview && editingReview)) && (
                <div style={{ marginBottom: 40 }}>
                    <ReviewForm
                        productId={productId}
                        existingReview={editingReview || (hasUserReview ? userReview : null)}
                        onSuccess={handleFormSuccess}
                        onCancel={showForm ? handleFormCancel : undefined}
                    />
                </div>
            )}

            {/* Login prompt for non-authenticated users */}
            {!isAuthenticated && (
                <div style={{
                    background: '#f0f0f0',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: 40,
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, fontSize: 15 }}>
                        Connectez-vous pour laisser un avis sur ce produit
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <>
                </>
            ) : (
                <>
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        {reviews.map((review, index) => (
                            <div key={review._id}>
                                <ReviewItem
                                    review={review}
                                    currentUserId={currentUserId}
                                    isAdmin={isAdmin}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteSuccess}
                                />
                                {index < reviews.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                            </div>
                        ))}
                    </Space>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div style={{ marginTop: 40, textAlign: 'center' }}>
                            <Pagination
                                current={page}
                                total={pagination.total}
                                pageSize={pagination.limit}
                                onChange={(newPage) => setPage(newPage)}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewList;
