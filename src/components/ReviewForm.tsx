import { useState, useEffect } from 'react';
import { Form, Input, Rate, Button, message, Space } from 'antd';
import { reviewService } from '../services/reviewService';

const { TextArea } = Input;

interface ReviewFormProps {
    productId: string;
    existingReview?: {
        _id: string;
        rating: number;
        comment: string;
    } | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(existingReview?.rating || 0);

    useEffect(() => {
        if (existingReview) {
            form.setFieldsValue({
                rating: existingReview.rating,
                comment: existingReview.comment,
            });
            setRating(existingReview.rating);
        }
    }, [existingReview, form]);

    const handleSubmit = async (values: { rating: number; comment: string }) => {
        setLoading(true);
        try {
            if (existingReview) {
                // Update existing review
                await reviewService.updateReview(existingReview._id, {
                    rating: values.rating,
                    comment: values.comment,
                });
                message.success('✅ Avis mis à jour avec succès');
            } else {
                // Create new review
                await reviewService.submitReview({
                    productId,
                    rating: values.rating,
                    comment: values.comment,
                });
                message.success('✅ Avis soumis avec succès');
                form.resetFields();
                setRating(0);
            }
            onSuccess?.();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#fafafa',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e8e8e8'
        }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 500 }}>
                {existingReview ? 'Modifier votre avis' : 'Laisser un avis'}
            </h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    rating: existingReview?.rating || 0,
                    comment: existingReview?.comment || '',
                }}
            >
                <Form.Item
                    name="rating"
                    label="Note"
                    rules={[
                        { required: true, message: 'Veuillez donner une note' },
                        {
                            validator: (_, value) =>
                                value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Veuillez sélectionner au moins 1 étoile')),
                        },
                    ]}
                >
                    <Rate
                        value={rating}
                        onChange={(value) => {
                            setRating(value);
                            form.setFieldValue('rating', value);
                        }}
                        style={{ fontSize: 28 }}
                    />
                </Form.Item>

                <Form.Item
                    name="comment"
                    label="Votre avis"
                    rules={[
                        { required: true, message: 'Veuillez écrire un commentaire' },
                        { min: 3, message: 'Le commentaire doit contenir au moins 3 caractères' },
                        { max: 1000, message: 'Le commentaire ne peut pas dépasser 1000 caractères' },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Partagez votre expérience avec ce produit..."
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                background: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                height: '40px',
                                padding: '0 32px',
                            }}
                        >
                            {existingReview ? 'Mettre à jour' : 'Soumettre'}
                        </Button>
                        {onCancel && (
                            <Button onClick={onCancel} style={{ borderRadius: '8px', height: '40px' }}>
                                Annuler
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ReviewForm;
