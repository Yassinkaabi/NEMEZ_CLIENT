import { useEffect, useState } from 'react';
import { Table, Tag, Card, Row, Col, Statistic, Select } from 'antd';
import { MailOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';
import dayjs from 'dayjs';

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        fetchSubscribers();
        fetchStats();
    }, [pagination.page, activeFilter]);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllSubscribers({
                page: pagination.page,
                limit: pagination.limit,
                isActive: activeFilter,
            });
            setSubscribers(response.data.data);
            setPagination({ ...pagination, total: response.data.pagination.total });
        } catch (error) {
            console.error('Erreur lors du chargement des abonnés');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminService.getSubscriberStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques');
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Statut',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 120,
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {isActive ? 'Actif' : 'Inactif'}
                </Tag>
            ),
        },
        {
            title: 'Préférences',
            key: 'preferences',
            width: 300,
            render: (_: any, record: any) => (
                <div>
                    {record.preferences.newArrivals && <Tag color="blue">Nouveautés</Tag>}
                    {record.preferences.promotions && <Tag color="orange">Promotions</Tag>}
                    {record.preferences.weeklyDigest && <Tag color="purple">Digest hebdo</Tag>}
                </div>
            ),
        },
        {
            title: 'Date d\'inscription',
            dataIndex: 'subscribedAt',
            key: 'subscribedAt',
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Dernier email',
            dataIndex: 'lastEmailSent',
            key: 'lastEmailSent',
            width: 150,
            render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'Jamais',
        },
        {
            title: 'Emails reçus',
            dataIndex: 'emailsSentCount',
            key: 'emailsSentCount',
            width: 120,
            render: (count: number) => (
                <Tag color="geekblue">{count}</Tag>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="admin-table">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Gestion de la Newsletter</h2>
                </div>

                {/* Statistiques */}
                {stats && (
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={12} sm={12} md={6} style={{paddingBottom:'8px'}}>
                            <Card>
                                <Statistic
                                    title="Total Abonnés"
                                    value={stats.total}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} style={{paddingBottom:'8px'}}>
                            <Card>
                                <Statistic
                                    title="Actifs"
                                    value={stats.totalActive}
                                    prefix={<CheckCircleOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} style={{paddingBottom:'8px'}}>
                            <Card>
                                <Statistic
                                    title="Inactifs"
                                    value={stats.totalInactive}
                                    prefix={<CloseCircleOutlined />}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} style={{paddingBottom:'8px'}}>
                            <Card>
                                <Statistic
                                    title="Nouveaux ce mois"
                                    value={stats.newThisMonth}
                                    prefix={<MailOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Filtre */}
                <div style={{ marginBottom: 16 }}>
                    <Select
                        placeholder="Filtrer par statut"
                        style={{ width: 200 }}
                        allowClear
                        onChange={(value) => {
                            setActiveFilter(value);
                            setPagination({ ...pagination, page: 1 });
                        }}
                    >
                        <Select.Option value={true}>Actifs</Select.Option>
                        <Select.Option value={false}>Inactifs</Select.Option>
                    </Select>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={subscribers}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                    }}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminNewsletter;
