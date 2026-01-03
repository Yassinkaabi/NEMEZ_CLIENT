import { Form, Input, Button, Typography, Card, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAppSelector, useAppDispatch } from '../store/redux';
import { clearCart } from '../store/cartSlice';
import { useEffect } from 'react';
import { loadUserProfile } from '../store/authSlice';

const { Title, Text } = Typography;

const Checkout = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const cartItems = useAppSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(loadUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            });
        }
    }, [user, form]);

    const createOrderMutation = useMutation({
        mutationFn: (orderData: any) => api.post('/orders', orderData),
        onSuccess: () => {
            message.success('Commande confirmée ! Vous recevrez un email de confirmation.');
            dispatch(clearCart());
            navigate('/account');
        },
        onError: () => {
            message.error('Erreur lors de la création de la commande');
        }
    });

    const handleSubmit = (values: any) => {
        if (!isAuthenticated || !user) {
            message.warning("Veuillez vous connecter avant de passer commande.");
            navigate('/login');
            return;
        }

        const orderData = {
            userId: user._id,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: item.price
            })),
            address: values.address,
            phone: values.phone,
            email: values.email,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 7
        };

        createOrderMutation.mutate(orderData);
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
            <Title level={2}>Informations de livraison</Title>

            <Card style={{ marginBottom: 20 }}>
                <Title level={4}>Résumé</Title>
                {cartItems.map(item => (
                    <div key={item.cartItemId} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{item.name} x {item.quantity} - {item.size} - {item.color}</Text>
                        <Text strong>{item.price * item.quantity} DT</Text>
                    </div>
                ))}
                <hr />
                <Text strong style={{ fontSize: 18, color: '#E53935' }}>
                    Total: {total + 7} DT
                </Text>
            </Card>

            <Card>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Nom complet"
                        name="name"
                        initialValue={user?.name || ''}
                        rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                    >
                        <Input placeholder="Ex: Ahmed Ben Ali" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        initialValue={user?.email || ''}
                        rules={[
                            { required: true, message: 'Veuillez entrer votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Téléphone"
                        name="phone"
                        initialValue={user?.phone || ''}
                        rules={[{ required: true, message: 'Veuillez entrer votre téléphone' }]}
                    >
                        <Input placeholder="20 123 456" />
                    </Form.Item>

                    <Form.Item
                        label="Adresse complète"
                        name="address"
                        initialValue={user?.address || ''}
                        rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Rue, ville, code postal" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={createOrderMutation.isPending}
                    >
                        Confirmer ma commande
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Checkout;
