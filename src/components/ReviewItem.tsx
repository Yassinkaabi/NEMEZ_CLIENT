import { useState } from 'react';
import { Space, Avatar, Typography, Rate, Tag, Button, Popconfirm, message } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Review } from '../services/reviewService';
import { reviewService } from '../services/reviewService';

const { Text, Paragraph } = Typography;

interface ReviewItemProps {
    review: Review;
    currentUserId?: number;
    isAdmin?: boolean;
    onEdit?: (review: Review) => void;
    onDelete?: () => void;
}

const ReviewItem = ({ review, currentUserId, isAdmin, onEdit, onDelete }: ReviewItemProps) => {
    const [deleting, setDeleting] = useState(false);

    const isOwner = currentUserId && review.userId &&
        (typeof review.userId === 'object' ? review.userId._id : review.userId) === currentUserId.toString();
    const canEdit = isOwner;
    const canDelete = isOwner || isAdmin;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await reviewService.deleteReview(review._id);
            message.success('✅ Avis supprimé avec succès');
            onDelete?.();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Erreur lors de la suppression');
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const userName = typeof review.userId === 'object' ? review.userId.name : 'Utilisateur';

    return (
        <div style={{ padding: '16px 0' }}>
            <Space align="start" size={16} style={{ width: '100%' }}>
                <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#000' }} />
                <div style={{ flex: 1 }}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space>
                                <Text strong>{userName}</Text>
                                {isOwner && (
                                    <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
                                        Votre avis
                                    </Tag>
                                )}
                            </Space>

                            {(canEdit || canDelete) && (
                                <Space size={8}>
                                    {canEdit && (
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => onEdit?.(review)}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            Modifier
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Popconfirm
                                            title="Supprimer cet avis ?"
                                            description="Cette action est irréversible."
                                            onConfirm={handleDelete}
                                            okText="Supprimer"
                                            cancelText="Annuler"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                loading={deleting}
                                                style={{ padding: '4px 8px' }}
                                            >
                                                Supprimer
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </Space>
                            )}
                        </div>

                        <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {formatDate(review.createdAt)}
                        </Text>
                        <Paragraph style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.6 }}>
                            {review.comment}
                        </Paragraph>
                    </Space>
                </div>
            </Space>
        </div>
    );
};

export default ReviewItem;
