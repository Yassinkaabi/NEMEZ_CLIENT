import { Table, Button, Typography, Empty, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import '../styles/cart.css';

const { Title, Text } = Typography;

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(state => state.cart.items);

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // =======================
    // Desktop Table Columns
    // =======================
    const columns = [
        {
            title: 'Produit',
            key: 'product',
            render: (_: any, record: any) => (
                <div className="cart-product-info">
                    <img
                        src={record.image}
                        alt={record.name}
                        className="cart-product-image"
                    />
                    <div className="cart-product-details">
                        <Text strong>{record.name}</Text>
                        <br />
                        <Text type="secondary">
                            Taille: {record.size} | Couleur: {record.color}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <Text strong>{price} DT</Text>,
        },
        {
            title: 'Quantité',
            key: 'quantity',
            render: (_: any, record: any) => {
                const isMax = record.quantity >= record.maxStock;

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button
                            icon={<MinusOutlined />}
                            size="small"
                            disabled={record.quantity <= 1}
                            onClick={() =>
                                dispatch(
                                    updateQuantity({
                                        cartItemId: record.cartItemId,
                                        quantity: record.quantity - 1,
                                    })
                                )
                            }
                        />

                        <span style={{ minWidth: 30, textAlign: 'center' }}>
                            {record.quantity}
                        </span>

                        <Button
                            icon={<PlusOutlined />}
                            size="small"
                            disabled={isMax}
                            onClick={() => {
                                if (isMax) {
                                    message.warning('Stock maximum atteint');
                                    return;
                                }

                                dispatch(
                                    updateQuantity({
                                        cartItemId: record.cartItemId,
                                        quantity: record.quantity + 1,
                                    })
                                );
                            }}
                        />
                    </div>
                );
            },
        },
        {
            title: 'Total',
            key: 'total',
            render: (_: any, record: any) => (
                <Text strong style={{ color: '#E53935' }}>
                    {record.price * record.quantity} DT
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(removeFromCart(record.cartItemId))}
                />
            ),
        },
    ];

    // =======================
    // Empty Cart
    // =======================
    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <Empty description="Votre panier est vide" />
                <Button type="primary" onClick={() => navigate('/')}>
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
                {/* =======================
            TABLE DESKTOP
        ======================= */}
                <div className="cart-table-section">
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        rowKey={(item) => `${item.cartItemId}-${item.size}-${item.color}`}
                        pagination={false}
                    />

                    {/* =======================
              MOBILE VIEW
          ======================= */}
                    <div className="cart-mobile-list">
                        {cartItems.map((item, index) => {
                            const isMax = item.quantity >= item.maxStock;
                            return (
                                <div key={`${item.cartItemId}-${index}`} className="cart-item-card">
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
                                            <span className="cart-item-price">
                                                {item.price} DT
                                            </span>
                                        </div>
                                    </div>

                                    <div className="cart-item-footer">
                                        <div className="cart-item-quantity">
                                            <span>Quantité</span>

                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Button
                                                    icon={<MinusOutlined />}
                                                    size="small"
                                                    disabled={item.quantity <= 1}
                                                    onClick={() =>
                                                        dispatch(
                                                            updateQuantity({
                                                                cartItemId: item.cartItemId,
                                                                quantity: item.quantity - 1,
                                                            })
                                                        )
                                                    }
                                                />

                                                <span>{item.quantity}</span>

                                                <Button
                                                    icon={<PlusOutlined />}
                                                    size="small"
                                                    disabled={isMax}
                                                    onClick={() => {
                                                        if (isMax) {
                                                            message.warning('Stock maximum atteint');
                                                            return;
                                                        }

                                                        dispatch(
                                                            updateQuantity({
                                                                cartItemId: item.cartItemId,
                                                                quantity: item.quantity + 1,
                                                            })
                                                        );
                                                    }}
                                                />
                                            </div>

                                            {isMax && (
                                                <Text type="danger" style={{ fontSize: 12 }}>
                                                    Stock maximum atteint
                                                </Text>
                                            )}
                                        </div>

                                        <div className="cart-item-total">
                                            <span>Total</span>
                                            <span className="cart-item-total-price">
                                                {item.price * item.quantity} DT
                                            </span>

                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    dispatch(removeFromCart(item.cartItemId))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* =======================
            SUMMARY
        ======================= */}
                <div className="cart-summary-section">
                    <Card className="cart-summary-card">
                        <Title level={4}>Résumé de la commande</Title>

                        <div className="cart-summary-row">
                            <Text>Sous-total</Text>
                            <Text strong>{total} DT</Text>
                        </div>

                        <div className="cart-summary-row">
                            <Text>Livraison</Text>
                            <Text strong>8 DT</Text>
                        </div>

                        <hr className="cart-summary-divider" />

                        <div className="cart-summary-row cart-summary-total">
                            <Title level={4}>Total</Title>
                            <Title level={4} style={{ color: '#E53935' }}>
                                {total + 8} DT
                            </Title>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={() => navigate('/checkout')}
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
