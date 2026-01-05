import { useEffect, useState } from 'react';
import { Row, Col, Card, Spin } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    StarOutlined,
} from '@ant-design/icons';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/admin/StatCard';
import * as adminService from '../services/adminService';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        users: {},
        products: {},
        orders: {},
        reviews: {},
    });

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const [userStats, productStats, orderStats, reviewStats] = await Promise.all([
                adminService.getUserStats(),
                adminService.getProductStats(),
                adminService.getOrderStats(),
                adminService.getReviewStats(),
            ]);

            setStats({
                users: userStats.data,
                products: productStats.data,
                orders: orderStats.data,
                reviews: reviewStats.data,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: stats.orders.dailyRevenue?.map((d: any) => d._id) || [],
        datasets: [
            {
                label: 'Revenue',
                data: stats.orders.dailyRevenue?.map((d: any) => d.revenue) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenue - Last 7 Days',
            },
        },
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <h1 className="admin-page-title">Dashboard Overview</h1>

                <Row gutter={[24, 24]}>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Total Users"
                            value={stats.users.totalUsers || 0}
                            icon={<UserOutlined style={{ fontSize: '32px' }} />}
                            color="#1890ff"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Total Products"
                            value={stats.products.totalProducts || 0}
                            icon={<ShoppingOutlined style={{ fontSize: '32px' }} />}
                            color="#52c41a"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Total Orders"
                            value={stats.orders.totalOrders || 0}
                            icon={<ShoppingCartOutlined style={{ fontSize: '32px' }} />}
                            color="#faad14"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Total Revenue"
                            value={`${stats.orders.totalRevenue?.toFixed(2) || 0}`}
                            icon={<DollarOutlined style={{ fontSize: '32px' }} />}
                            color="#f5222d"
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Pending Orders"
                            value={stats.orders.pendingOrders || 0}
                            icon={<ShoppingCartOutlined style={{ fontSize: '32px' }} />}
                            color="#ff7a45"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Low Stock Products"
                            value={stats.products.lowStockProducts || 0}
                            icon={<ShoppingOutlined style={{ fontSize: '32px' }} />}
                            color="#fa8c16"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Total Reviews"
                            value={stats.reviews.totalReviews || 0}
                            icon={<StarOutlined style={{ fontSize: '32px' }} />}
                            color="#722ed1"
                        />
                    </Col>
                    <Col xs={12} sm={12} lg={6}>
                        <StatCard
                            title="Average Rating"
                            value={stats.reviews.averageRating?.toFixed(1) || 0}
                            icon={<StarOutlined style={{ fontSize: '32px' }} />}
                            color="#eb2f96"
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={16}>
                        <Card title="Revenue Trend" bordered={false}>
                            <Line data={chartData} options={chartOptions} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Order Status" bordered={false}>
                            <div className="order-status-list">
                                <div className="order-status-item">
                                    <span>Pending</span>
                                    <strong>{stats.orders.pendingOrders || 0}</strong>
                                </div>
                                <div className="order-status-item">
                                    <span>Confirmed</span>
                                    <strong>{stats.orders.confirmedOrders || 0}</strong>
                                </div>
                                <div className="order-status-item">
                                    <span>Delivered</span>
                                    <strong>{stats.orders.deliveredOrders || 0}</strong>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
