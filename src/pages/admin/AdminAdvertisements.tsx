import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, Select, message, Popconfirm, Tag, Card, Row, Col, Statistic, DatePicker, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MailOutlined, EyeOutlined, BarChartOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface Advertisement {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl?: string;
    productId?: any;
    startDate: string;
    endDate: string;
    priority: number;
    status: 'draft' | 'scheduled' | 'active' | 'expired' | 'archived';
    impressions: number;
    clicks: number;
    emailSent: boolean;
    emailRecipients?: number;
}

const AdminAdvertisements = () => {
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
    const [selectedAdStats, setSelectedAdStats] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAdvertisements();
        fetchProducts();
    }, [pagination.page, statusFilter]);

    const fetchAdvertisements = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllAdvertisements({
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter,
            });
            setAdvertisements(response.data.data);
            setPagination({ ...pagination, total: response.data.pagination.total });
        } catch (error) {
            message.error('Erreur lors du chargement des publicités');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await adminService.getAllProducts({ page: 1, limit: 100 });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Erreur lors du chargement des produits');
        }
    };

    const handleAdd = () => {
        setEditingAd(null);
        form.resetFields();
        form.setFieldsValue({
            priority: 5,
            status: 'draft',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (ad: Advertisement) => {
        setEditingAd(ad);
        form.setFieldsValue({
            title: ad.title,
            description: ad.description,
            imageUrl: ad.imageUrl,
            linkUrl: ad.linkUrl,
            productId: ad.productId?._id,
            dateRange: [dayjs(ad.startDate), dayjs(ad.endDate)],
            priority: ad.priority,
            status: ad.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteAdvertisement(id);
            message.success('Publicité supprimée avec succès');
            fetchAdvertisements();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const adData = {
                title: values.title,
                description: values.description,
                imageUrl: values.imageUrl,
                linkUrl: values.linkUrl,
                productId: values.productId,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
                priority: values.priority,
                status: values.status,
            };

            if (editingAd) {
                await adminService.updateAdvertisement(editingAd._id, adData);
                message.success('Publicité mise à jour avec succès');
            } else {
                await adminService.createAdvertisement(adData);
                message.success('Publicité créée avec succès');
            }

            setIsModalOpen(false);
            form.resetFields();
            setEditingAd(null);
            fetchAdvertisements();
        } catch (error) {
            message.error('Erreur lors de l\'enregistrement');
        }
    };

    const handleSendEmail = async (id: string) => {
        try {
            setLoading(true);
            const response = await adminService.sendAdvertisementEmail(id);
            message.success(response.data.message);
            fetchAdvertisements();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Erreur lors de l\'envoi des emails');
        } finally {
            setLoading(false);
        }
    };

    const handleViewStats = async (ad: Advertisement) => {
        try {
            const response = await adminService.getAdvertisementStats(ad._id);
            setSelectedAdStats(response.data.data);
            setIsStatsModalOpen(true);
        } catch (error) {
            message.error('Erreur lors du chargement des statistiques');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            draft: 'default',
            scheduled: 'blue',
            active: 'green',
            expired: 'orange',
            archived: 'red',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: string) => {
        const texts: any = {
            draft: 'Brouillon',
            scheduled: 'Programmée',
            active: 'Active',
            expired: 'Expirée',
            archived: 'Archivée',
        };
        return texts[status] || status;
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 100,
            render: (url: string) => (
                <img src={url} alt="Ad" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8 }} />
            ),
        },
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
        },
        {
            title: 'Priorité',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            render: (priority: number) => (
                <Tag color={priority >= 8 ? 'red' : priority >= 5 ? 'orange' : 'blue'}>
                    {priority}/10
                </Tag>
            ),
        },
        {
            title: 'Période',
            key: 'period',
            width: 200,
            render: (_: any, record: Advertisement) => (
                <div style={{ fontSize: 12 }}>
                    <div>Début: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
                    <div>Fin: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
                </div>
            ),
        },
        {
            title: 'Impressions',
            dataIndex: 'impressions',
            key: 'impressions',
            width: 100,
            render: (impressions: number) => impressions.toLocaleString(),
        },
        {
            title: 'Clics',
            dataIndex: 'clicks',
            key: 'clicks',
            width: 80,
            render: (clicks: number) => clicks.toLocaleString(),
        },
        {
            title: 'Email',
            dataIndex: 'emailSent',
            key: 'emailSent',
            width: 100,
            render: (sent: boolean, record: Advertisement) => (
                sent ? (
                    <Tag color="green">Envoyé ({record.emailRecipients})</Tag>
                ) : (
                    <Tag color="default">Non envoyé</Tag>
                )
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            // fixed: 'right' as const,
            render: (_: any, record: Advertisement) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<BarChartOutlined />}
                        onClick={() => handleViewStats(record)}
                        title="Statistiques"
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Modifier"
                    />
                    {!record.emailSent && record.status === 'active' && (
                        <Popconfirm
                            title="Envoyer l'email à tous les abonnés ?"
                            onConfirm={() => handleSendEmail(record._id)}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button
                                type="link"
                                icon={<MailOutlined />}
                                title="Envoyer email"
                            />
                        </Popconfirm>
                    )}
                    <Popconfirm
                        title="Supprimer cette publicité ?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                            title="Supprimer"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="admin-table">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Gestion des Publicités</h2>
                    <div className="admin-table-actions">
                        <Select
                            placeholder="Filtrer par statut"
                            style={{ width: 150 }}
                            allowClear
                            onChange={(value) => {
                                setStatusFilter(value || '');
                                setPagination({ ...pagination, page: 1 });
                            }}
                        >
                            <Select.Option value="draft">Brouillon</Select.Option>
                            <Select.Option value="scheduled">Programmée</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="expired">Expirée</Select.Option>
                            <Select.Option value="archived">Archivée</Select.Option>
                        </Select>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            className="admin-btn"
                        >
                            Nouvelle Publicité
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={advertisements}
                    loading={loading}
                    rowKey="_id"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                    }}
                />

                {/* Modal Création/Modification */}
                <Modal
                    title={editingAd ? 'Modifier la Publicité' : 'Nouvelle Publicité'}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingAd(null);
                    }}
                    footer={null}
                    className="admin-modal"
                    width={700}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="title"
                            label="Titre"
                            rules={[{ required: true, message: 'Le titre est requis' }]}
                        >
                            <Input maxLength={100} showCount />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'La description est requise' }]}
                        >
                            <Input.TextArea rows={3} maxLength={500} showCount />
                        </Form.Item>

                        <Form.Item
                            name="imageUrl"
                            label="URL de l'image"
                            rules={[{ required: true, message: 'L\'URL de l\'image est requise' }]}
                        >
                            <Input placeholder="https://example.com/image.jpg" />
                        </Form.Item>

                        <Form.Item
                            name="linkUrl"
                            label="URL de destination (optionnel)"
                        >
                            <Input placeholder="https://example.com/page" />
                        </Form.Item>

                        <Form.Item
                            name="productId"
                            label="Produit lié (optionnel)"
                        >
                            <Select
                                showSearch
                                placeholder="Sélectionner un produit"
                                allowClear
                                optionFilterProp="children"
                            >
                                {products.map((product: any) => (
                                    <Select.Option key={product._id} value={product._id}>
                                        {product.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="dateRange"
                            label="Période d'affichage"
                            rules={[{ required: true, message: 'La période est requise' }]}
                        >
                            <RangePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="priority"
                                    label="Priorité (1-10)"
                                    rules={[{ required: true, message: 'La priorité est requise' }]}
                                >
                                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Statut"
                                    rules={[{ required: true, message: 'Le statut est requis' }]}
                                >
                                    <Select>
                                        <Select.Option value="draft">Brouillon</Select.Option>
                                        <Select.Option value="scheduled">Programmée</Select.Option>
                                        <Select.Option value="active">Active</Select.Option>
                                        <Select.Option value="expired">Expirée</Select.Option>
                                        <Select.Option value="archived">Archivée</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="admin-btn">
                                {editingAd ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal Statistiques */}
                <Modal
                    title="Statistiques de la Publicité"
                    open={isStatsModalOpen}
                    onCancel={() => setIsStatsModalOpen(false)}
                    footer={null}
                    width={600}
                >
                    {selectedAdStats && (
                        <div>
                            <h3 style={{ marginBottom: 20 }}>{selectedAdStats.title}</h3>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Impressions"
                                            value={selectedAdStats.impressions}
                                            prefix={<EyeOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Clics"
                                            value={selectedAdStats.clicks}
                                            valueStyle={{ color: '#3f8600' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="CTR"
                                            value={selectedAdStats.ctr}
                                            suffix="%"
                                            valueStyle={{ color: '#cf1322' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col span={12}>
                                    <Card>
                                        <Statistic
                                            title="Email envoyé"
                                            value={selectedAdStats.emailSent ? 'Oui' : 'Non'}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Statistic
                                            title="Destinataires"
                                            value={selectedAdStats.emailRecipients || 0}
                                            prefix={<MailOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <div style={{ marginTop: 20, padding: 15, background: '#f5f5f5', borderRadius: 8 }}>
                                <p><strong>Statut:</strong> <Tag color={getStatusColor(selectedAdStats.status)}>{getStatusText(selectedAdStats.status)}</Tag></p>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminAdvertisements;
