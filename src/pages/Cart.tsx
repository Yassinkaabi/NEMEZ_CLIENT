// pages/Cart.tsx
import { Table, Button, Typography, Empty, Card } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import '../styles/cart.css';

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
                <div className="cart-product-info">
                    <img 
                        src={record.image} 
                        alt={text} 
                        className="cart-product-image"
                    />
                    <div className="cart-product-details">
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                        icon={<MinusOutlined />}
                        size="small"
                        onClick={() => dispatch(updateQuantity({ 
                            productId: record.productId, 
                            quantity: Math.max(1, qty - 1) 
                        }))}
                        disabled={qty <= 1}
                    />
                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 500 }}>
                        {qty}
                    </span>
                    <Button
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => dispatch(updateQuantity({ 
                            productId: record.productId, 
                            quantity: Math.min(10, qty + 1) 
                        }))}
                        disabled={qty >= 10}
                    />
                </div>
            )
        },
        {
            title: 'Total',
            key: 'total',
            render: (record: any) => (
                <Text strong style={{ color: '#E53935' }}>
                    {record.price * record.quantity} DT
                </Text>
            )
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
            <div className="cart-empty">
                <Empty description="Votre panier est vide" />
                <Button 
                    type="primary" 
                    onClick={() => navigate('/')} 
                    className="cart-empty-button"
                >
                    Continuer les achats
                </Button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <Title level={2} className="cart-title">
                Mon Panier ({cartItems.length})
            </Title>

            <div className="cart-layout">
                <div className="cart-table-section">
                    {/* Desktop Table View */}
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        pagination={false}
                        rowKey="productId"
                    />

                    {/* Mobile Card View */}
                    <div className="cart-mobile-list">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="cart-item-card">
                                <div className="cart-item-header">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-info">
                                        <span className="cart-item-name">{item.name}</span>
                                        <span className="cart-item-variant">
                                            Taille: {item.size} | Couleur: {item.color}
                                        </span>
                                        <span className="cart-item-price">{item.price} DT</span>
                                    </div>
                                </div>
                                
                                <div className="cart-item-footer">
                                    <div className="cart-item-quantity">
                                        <span className="cart-item-quantity-label">Quantité:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Button
                                                icon={<MinusOutlined />}
                                                size="small"
                                                onClick={() => dispatch(updateQuantity({ 
                                                    productId: item.productId, 
                                                    quantity: Math.max(1, item.quantity - 1) 
                                                }))}
                                                disabled={item.quantity <= 1}
                                            />
                                            <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 500 }}>
                                                {item.quantity}
                                            </span>
                                            <Button
                                                icon={<PlusOutlined />}
                                                size="small"
                                                onClick={() => dispatch(updateQuantity({ 
                                                    productId: item.productId, 
                                                    quantity: Math.min(10, item.quantity + 1) 
                                                }))}
                                                disabled={item.quantity >= 10}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="cart-item-total">
                                        <span className="cart-item-total-label">Total:</span>
                                        <span className="cart-item-total-price">
                                            {item.price * item.quantity} DT
                                        </span>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => dispatch(removeFromCart(item.productId))}
                                            className="cart-item-delete"
                                            size="small"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cart-summary-section">
                    <Card className="cart-summary-card">
                        <Title level={4}>Résumé de la commande</Title>
                        
                        <div className="cart-summary-row">
                            <Text>Sous-total</Text>
                            <Text strong>{total} DT</Text>
                        </div>
                        
                        <div className="cart-summary-row">
                            <Text>Livraison</Text>
                            <Text strong>7 DT</Text>
                        </div>
                        
                        <hr className="cart-summary-divider" />
                        
                        <div className="cart-summary-row cart-summary-total">
                            <Title level={4}>Total</Title>
                            <Title level={4} style={{ color: '#E53935' }}>
                                {total + 7} DT
                            </Title>
                        </div>

                        <Button 
                            type="primary" 
                            size="large" 
                            block 
                            onClick={() => navigate('/checkout')}
                            className="cart-checkout-button"
                        >
                            Passer la commande
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;