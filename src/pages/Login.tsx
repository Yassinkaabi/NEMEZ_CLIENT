import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/redux';
import { loginUser, clearError } from '../store/authSlice';
import type { RootState } from '../store';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const { user, isLoading, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (values: { email: string; password: string }) => {
        const resultAction = await dispatch(loginUser({
            email: values.email,
            password: values.password
        }));

        // Vérifier si l'action a réussi
        if (loginUser.fulfilled.match(resultAction)) {
            message.success('Connexion réussie ! Bienvenue !');
            navigate("/")
        } else {
            // Erreur - ne pas naviguer
            const errorMsg = resultAction.payload as string || 'Email ou mot de passe incorrect';
            // message.error(errorMsg);
            form.setFields([
                { name: 'password', errors: [errorMsg] }
            ]);
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
                    Connexion
                </Title>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez entrer votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input size="large" placeholder="email@example.com" autoFocus />
                    </Form.Item>

                    <Form.Item
                        label="Mot de passe"
                        name="password"
                        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
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
                        Se connecter
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text>Pas encore de compte ? </Text>
                    <Link to="/signup">S'inscrire</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;