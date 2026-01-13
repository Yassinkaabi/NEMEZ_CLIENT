import { Button, Result, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../styles/OrderSuccess.css';

const { Title, Text } = Typography;

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="order-success-container">
            <Card className="order-success-card">
                <Result
                    status="success"
                    icon={<CheckCircleOutlined className="order-success-icon" />}
                    title={
                        <Title level={2} className="order-success-title">
                            Commande Confirmée !
                        </Title>
                    }
                    subTitle={
                        <div className="order-success-subtitle-container">
                            <Text className="order-success-text">
                                Merci pour votre confiance. Votre commande a été enregistrée avec succès.
                            </Text>
                            <br />
                            <Text className="order-success-text">
                                Nous vous contacterons prochainement pour la livraison.
                            </Text>
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="shop"
                            size="large"
                            icon={<ShoppingOutlined />}
                            onClick={() => navigate('/')}
                            className="order-success-button"
                        >
                            Continuer mes achats
                        </Button>
                    ]}
                />
            </Card>
        </div>
    );
};

export default OrderSuccess;
