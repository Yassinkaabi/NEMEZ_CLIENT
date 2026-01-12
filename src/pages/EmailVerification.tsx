import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Result, Button, Spin, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { api } from '../services/api';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const EmailVerification = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Votre email a été vérifié avec succès.');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Le lien de vérification est invalide ou a expiré.');
            }
        };

        if (token) {
            verify();
        } else {
            setStatus('error');
            setMessage('Token de vérification manquant.');
        }
    }, [token]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)',
            padding: 20,
            background: '#F7F7F8'
        }}>
            <Card style={{
                width: '100%',
                maxWidth: 550,
                borderRadius: 16,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                textAlign: 'center',
                padding: '20px 0'
            }}>
                {status === 'loading' && (
                    <div style={{ padding: '40px 0' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 20 }}>
                            <Text strong style={{ fontSize: 18 }}>Vérification de votre email en cours...</Text>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <Result
                        icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: 72 }} />}
                        title={<span style={{ fontWeight: 700, fontSize: 24 }}>Email Vérifié !</span>}
                        subTitle={<span style={{ fontSize: 16, color: '#666' }}>{message}</span>}
                        extra={[
                            <Button
                                type="primary"
                                key="login"
                                size="large"
                                onClick={() => navigate('/login')}
                                style={{
                                    height: 48,
                                    paddingLeft: 40,
                                    paddingRight: 40,
                                    borderRadius: 8,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            >
                                Se connecter
                            </Button>
                        ]}
                    />
                )}

                {status === 'error' && (
                    <Result
                        status="error"
                        icon={<CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 72 }} />}
                        title={<span style={{ fontWeight: 700, fontSize: 24 }}>Échec de la vérification</span>}
                        subTitle={<span style={{ fontSize: 16, color: '#666' }}>{message}</span>}
                        extra={[
                            <Button
                                type="primary"
                                key="retry"
                                size="large"
                                onClick={() => navigate('/signup')}
                                style={{
                                    height: 48,
                                    borderRadius: 8,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    background: '#444',
                                    border: 'none'
                                }}
                            >
                                Retour à l'inscription
                            </Button>,
                            <Link to="/" key="home">
                                <Button size="large" type="link" style={{ marginTop: 10, display: 'block', width: '100%' }}>
                                    Retour à l'accueil
                                </Button>
                            </Link>
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default EmailVerification;
