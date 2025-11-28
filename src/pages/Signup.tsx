import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/redux';
import { signupUser } from '../store/authSlice';
import type { RootState } from '../store';

const { Title, Text } = Typography;

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const { isLoading } = useAppSelector((state: RootState) => state.auth);

    const handleSubmit = async (values: any) => {
        try {
            await dispatch(signupUser(values)).unwrap();
            message.success('Inscription réussie !');
            navigate('/', { replace: true });
        } catch (error: any) {
            const errorMsg = error || 'Erreur lors de l\'inscription';
            message.error(errorMsg);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)',
            padding: 20
        }}>
            <Card style={{ width: '100%', maxWidth: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
                    Inscription
                </Title>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Nom complet"
                        name="name"
                        rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                    >
                        <Input size="large" placeholder="Ahmed Ben Ali" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez entrer votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input size="large" placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Téléphone"
                        name="phone"
                    >
                        <Input size="large" placeholder="20 123 456" />
                    </Form.Item>

                    <Form.Item
                        label="Mot de passe"
                        name="password"
                        rules={[
                            { required: true, message: 'Veuillez entrer un mot de passe' },
                            { min: 6, message: 'Au moins 6 caractères' }
                        ]}
                    >
                        <Input.Password size="large" placeholder="••••••••" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={isLoading}
                        style={{ height: 48, fontSize: 16 }}
                    >
                        S'inscrire
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text>Déjà inscrit ? </Text>
                    <Link to="/login">Se connecter</Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;