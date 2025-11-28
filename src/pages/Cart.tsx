// pages/Cart.tsx
import { Table, Button, InputNumber, Typography, Empty, Row, Col, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';

const { Title, Text } = Typography;

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const columns = [
        {
            title: 'Produit',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img src={record.image} alt={text} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                    <div>
                        <Text strong>{text}</Text>
                        <br />
                        <Text type="secondary">Taille: {record.size} | Couleur: {record.color}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <Text strong>{price} DT</Text>
        },
        {
            title: 'Quantité',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number, record: any) => (
                <InputNumber
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(val) => dispatch(updateQuantity({ productId: record.productId, quantity: val || 1 }))}
                />
            )
        },
        {
            title: 'Total',
            key: 'total',
            render: (record: any) => <Text strong style={{ color: '#E53935' }}>{record.price * record.quantity} DT</Text>
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: any) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(removeFromCart(record.productId))}
                />
            )
        }
    ];

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Empty description="Votre panier est vide" />
                <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
                    Continuer les achats
                </Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
            <Title level={2}>Mon Panier ({cartItems.length})</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        pagination={false}
                        rowKey="productId"
                    />
                </Col>

                <Col xs={24} lg={8}>
                    <Card>
                        <Title level={4}>Résumé de la commande</Title>
                        <div style={{ marginBottom: 20 }}>
                            <Row justify="space-between" style={{ marginBottom: 10 }}>
                                <Text>Sous-total</Text>
                                <Text strong>{total} DT</Text>
                            </Row>
                            <Row justify="space-between" style={{ marginBottom: 10 }}>
                                <Text>Livraison</Text>
                                <Text strong>7 DT</Text>
                            </Row>
                            <hr style={{ margin: '20px 0' }} />
                            <Row justify="space-between">
                                <Title level={4}>Total</Title>
                                <Title level={4} style={{ color: '#E53935' }}>{total + 7} DT</Title>
                            </Row>
                        </div>

                        <Button type="primary" size="large" block onClick={() => navigate('/checkout')}>
                            Passer la commande
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;