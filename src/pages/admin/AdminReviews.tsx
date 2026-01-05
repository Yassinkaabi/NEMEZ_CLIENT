import { useEffect, useState } from 'react';
import { Table, Button, Select, Rate, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [ratingFilter, setRatingFilter] = useState<number | undefined>();

    useEffect(() => {
        fetchReviews();
    }, [pagination.page, ratingFilter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllReviews({
                page: pagination.page,
                limit: pagination.limit,
                rating: ratingFilter,
            });
            setReviews(response.data.reviews);
            setPagination({ ...pagination, total: response.data.pagination.total });
        } catch (error) {
            message.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteReview(id);
            message.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            message.error('Failed to delete review');
        }
    };

    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'reviewId',
            key: 'reviewId',
            width: 80,
            responsive: ['lg'],
        },
        {
            title: 'Product',
            dataIndex: 'productId',
            key: 'product',
            render: (product: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {product?.images?.[0] && (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
                        />
                    )}
                    <span style={{ fontSize: '13px' }}>{product?.name || 'N/A'}</span>
                </div>
            ),
        },
        {
            title: 'User',
            dataIndex: 'userId',
            key: 'user',
            render: (user: any) => user?.name || 'N/A',
            // responsive: ['sm'],
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled value={rating} style={{ fontSize: '12px' }} />,
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
            // responsive: ['md'],
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
            // responsive: ['lg'],
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 60,
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Are you sure you want to delete this review?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        className="action-btn delete"
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="admin-table" style={{overflowX: 'auto'}}>
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Review Management</h2>
                    <div className="admin-table-actions">
                        <Select
                            placeholder="Filter by rating"
                            onChange={setRatingFilter}
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Select.Option value={5}>5 Stars</Select.Option>
                            <Select.Option value={4}>4 Stars</Select.Option>
                            <Select.Option value={3}>3 Stars</Select.Option>
                            <Select.Option value={2}>2 Stars</Select.Option>
                            <Select.Option value={1}>1 Star</Select.Option>
                        </Select>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={reviews}
                    loading={loading}
                    rowKey="_id"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                        size: 'small',
                    }}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminReviews;
