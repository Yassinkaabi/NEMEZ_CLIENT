import { useEffect, useState } from 'react';
import { Result, Button, Card, Alert, Spin, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export default function UnsubscribeResult() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const statusParam = params.get('status');
        const messageParam = params.get('message');
        const emailParam = params.get('email');

        setStatus(statusParam || 'error');
        setMessage(messageParam || '');
        setEmail(emailParam || '');
    }, []);

    const isSuccess = status === 'success';
    const isLoading = status === 'loading';

    const handleSubscribe = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, { email });
            setStatus('success');
            setMessage(response.data.message);
            navigate('/news');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response.data.message);
        }
    }

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)'
        }}>
            <Card
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    borderTop: `4px solid ${isSuccess ? '#52c41a' : '#ff4d4f'}`
                }}
                bordered={false}
            >
                <Result
                    status={isSuccess ? 'success' : 'error'}
                    icon={isSuccess ?
                        <CheckCircleOutlined style={{ fontSize: 72 }} /> :
                        <CloseCircleOutlined style={{ fontSize: 72 }} />
                    }
                    title={isSuccess ? 'Désabonnement confirmé' : 'Oups, une erreur'}
                    subTitle={
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Paragraph>
                                {isSuccess ? (
                                    'Vous avez été désabonné avec succès de notre newsletter.'
                                ) : (
                                    message || 'Une erreur est survenue lors du désabonnement.'
                                )}
                            </Paragraph>

                            {email && (
                                <Card
                                    size="small"
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Text strong>
                                        <MailOutlined /> {email}
                                    </Text>
                                </Card>
                            )}

                            {isSuccess && (
                                <Alert
                                    message="Que se passe-t-il maintenant ?"
                                    description="Vous ne recevrez plus nos emails de nouvelles arrivées. Vous pouvez vous réabonner à tout moment depuis notre site."
                                    type="info"
                                    showIcon
                                    icon={<MailOutlined />}
                                />
                            )}
                        </Space>
                    }
                    extra={[
                        <Button
                            key="home"
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            href="/"
                            block
                        >
                            Retour à l'accueil
                        </Button>,
                        isSuccess ? (
                            <Button
                                key="resubscribe"
                                type="link"
                                icon={<ReloadOutlined />}
                                block
                                onClick={handleSubscribe}
                            >
                                Me réabonner à la newsletter
                            </Button>
                        ) : (
                            <Button
                                key="contact"
                                type="link"
                                href="/contact"
                                block
                            >
                                Contacter le support
                            </Button>
                        )
                    ]}
                />

                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #f0f0f0',
                    textAlign: 'center'
                }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        © {new Date().getFullYear()} NEMEZ Shop. Tous droits réservés.
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {isSuccess
                            ? 'Nous sommes désolés de vous voir partir 😢'
                            : 'Besoin d\'aide ? Contactez-nous'}
                    </Text>
                </div>
            </Card>
        </div>
    );
}