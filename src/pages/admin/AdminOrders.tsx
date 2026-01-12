import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Tag, message, Modal } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const { Search } = Input;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, search, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllOrders({
                page: pagination.page,
                limit: pagination.limit,
                search,
                status: statusFilter,
            });
            setOrders(response.data.orders);
            setPagination({ ...pagination, total: response.data.pagination.total });
            console.log("orders", response.data.orders);

        } catch (error) {
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            message.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            message.error('Failed to update order status');
        }
    };

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 100,
        },
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'customer',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `${amount.toFixed(2)} TND`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    style={{ width: 110 }}
                >
                    <Select.Option value="pending">
                        <Tag className="status-badge pending">Pending</Tag>
                    </Select.Option>
                    <Select.Option value="confirmed">
                        <Tag className="status-badge confirmed">Confirmed</Tag>
                    </Select.Option>
                    <Select.Option value="delivered">
                        <Tag className="status-badge delivered">Delivered</Tag>
                    </Select.Option>
                </Select>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                    className="action-btn view"
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="admin-table">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Order Management</h2>
                    <div className="admin-table-actions">
                        <Select
                            placeholder="Filter by status"
                            onChange={setStatusFilter}
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="confirmed">Confirmed</Select.Option>
                            <Select.Option value="delivered">Delivered</Select.Option>
                        </Select>
                        <Search
                            placeholder="Search orders..."
                            onSearch={setSearch}
                            className="admin-search"
                            prefix={<SearchOutlined />}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                    }}
                />

                <Modal
                    title={`Order #${selectedOrder?.orderId} Details`}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    width={700}
                    className="admin-modal"
                >
                    {selectedOrder && (
                        <div>
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> {selectedOrder.name}</p>
                            <p><strong>Email:</strong> {selectedOrder.email}</p>
                            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                            <p><strong>Address:</strong> {selectedOrder.address}</p>

                            <h3 style={{ marginTop: 20 }}>Order Items</h3>
                            <Table
                                dataSource={selectedOrder.items}
                                pagination={false}
                                rowKey={(item: any) => item.productId._id}
                                columns={[
                                    {
                                        title: 'Product',
                                        dataIndex: 'productId',
                                        render: (product: any) => product?.name || 'N/A',
                                    },
                                    {
                                        title: 'Size',
                                        dataIndex: 'size',
                                    },
                                    {
                                        title: 'Color',
                                        dataIndex: 'color',
                                    },
                                    {
                                        title: 'Quantity',
                                        dataIndex: 'quantity',
                                    },
                                    {
                                        title: 'Price',
                                        dataIndex: 'price',
                                        render: (price: number) => `${price.toFixed(2)} TND`,
                                    },
                                ]}
                            />

                            <div style={{ marginTop: 20, textAlign: 'right' }}>
                                <h3>Total: {selectedOrder.totalAmount.toFixed(2)} TND</h3>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
