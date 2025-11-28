import { Tabs, Card, Form, Input, Button, Typography, Table, Tag, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAppDispatch, useAppSelector } from '../store/redux';
import { useEffect } from 'react';
import { loadUserProfile, updateUserProfile } from '../store/authSlice';
import { generateInvoicePDF } from '../components/InvoicePDF';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Account = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        if (!user && token) {
            dispatch(loadUserProfile());
        }
    }, [dispatch, user]);

    const { data: ordersData } = useQuery({
        queryKey: ['orders'],
        queryFn: () => api.get('/orders/my-orders'),
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => api.put('/auth/profile', data),
        onSuccess: (response) => {
            message.success('Profil mis à jour !');
            dispatch(updateUserProfile(response.data.user));
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: () => {
            message.error('Erreur lors de la mise à jour');
        },
    });

    const handleUpdateProfile = (values: any) => {
        updateProfileMutation.mutate(values);
    };

    const orderColumns = [
        {
            title: 'Commande',
            dataIndex: '_id',
            key: '_id',
            render: (id: string) => <Text code>#{id.slice(-8)}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
        },
        {
            title: 'Montant',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => <Text strong>{amount} DT</Text>,
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors: Record<string, string> = {
                    pending: 'orange',
                    confirmed: 'blue',
                    delivered: 'green',
                };
                const labels: Record<string, string> = {
                    pending: 'En attente',
                    confirmed: 'Confirmée',
                    delivered: 'Livrée',
                };
                return <Tag color={colors[status]}>{labels[status] || status}</Tag>;
            },
        },
        {
            title: 'Facture',
            key: 'invoice',
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    size="small"
                    style={{ color: '#E53935', fontWeight: 500 }}
                    onClick={() => generateInvoicePDF(record, user)}
                >
                    Voir la facture PDF
                </Button>
            ),
        },
    ];

    // Affichage pendant le chargement
    if (isLoading) return <Title level={3}>Chargement du profil...</Title>;
    if (!user) return <Title level={3}>Vous n'êtes pas connecté</Title>;

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
            <Title level={2}>Mon Compte</Title>

            <Tabs defaultActiveKey="profile">
                <TabPane tab="Informations personnelles" key="profile">
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                address: user.address,
                            }}
                            onFinish={handleUpdateProfile}
                        >
                            <Form.Item label="Nom complet" name="name" rules={[{ required: true }]}>
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item label="Email" name="email">
                                <Input size="large" disabled />
                            </Form.Item>

                            <Form.Item label="Téléphone" name="phone">
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item label="Adresse" name="address">
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={updateProfileMutation.isPending}
                            >
                                Mettre à jour
                            </Button>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Mes commandes" key="orders">
                    <Card title="Historique de vos commandes" style={{ borderRadius: 12 }}>
                        {/* Conteneur avec scroll horizontal */}
                        <div
                            style={{
                                overflowX: 'auto',
                                borderRadius: 8,
                                border: '1px solid #f0f0f0',
                                backgroundColor: '#fff',
                            }}
                        >
                            <Table
                                dataSource={ordersData?.data?.orders || []}
                                columns={orderColumns}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 10,
                                    position: ['bottomCenter'],
                                    showSizeChanger: false,
                                }}
                                loading={!ordersData}
                                scroll={{ x: 600 }} // Active le scroll horizontal dès 600px
                                style={{ minWidth: 600 }}
                            />
                        </div>

                        {/* Message si aucune commande */}
                        {ordersData?.data?.orders?.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                <Text type="secondary">Aucune commande pour le moment</Text>
                            </div>
                        )}
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );

}
export default Account;