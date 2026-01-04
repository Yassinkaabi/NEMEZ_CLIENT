import React from 'react';
import { Row, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';
// import axios from 'axios';
import AdvertisementCarousel from '../components/AdvertisementCarousel';
import '../styles/NewsPage.css';

const { Title, Paragraph } = Typography;

// interface UpcomingProduct {
//     _id: string;
//     name: string;
//     description: string;
//     price: number;
//     imageUrl: string;
//     launchDate: string;
// }

const NewsPage: React.FC = () => {
    // const [upcomingProduct, setUpcomingProduct] = useState<UpcomingProduct | null>(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetchUpcomingProduct();
    // }, []);

    // const fetchUpcomingProduct = async () => {
    //     try {
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/upcoming`);
    //         setUpcomingProduct(response.data.data);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Erreur chargement produit à venir:', error);
    //         setLoading(false);
    //     }
    // };

    // const onCountdownFinish = () => {
    //     console.log('Le produit est maintenant disponible!');
    //     // Recharger les données ou rediriger
    //     fetchUpcomingProduct();
    // };

    return (
        <div className="news-page">
            {/* Hero Banner */}
            <div className="hero-banner">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <Title level={1} className="hero-title">
                            <FireOutlined /> Nouveautés NEMEZ
                        </Title>
                        <Paragraph className="hero-subtitle">
                            Découvrez nos dernières collections et offres exclusives
                        </Paragraph>
                    </div>
                </div>
            </div>

            {/* Advertisement Carousel */}
            <div className="carousel-section">
                <AdvertisementCarousel />
            </div>

            {/* Upcoming Product Section with Countdown */}
            {/* {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : upcomingProduct ? (
                <div className="upcoming-product-section">
                    <div className="container">
                        <Title level={2} className="section-title">
                            <ClockCircleOutlined /> Bientôt Disponible
                        </Title>

                        <Card className="upcoming-product-card" bordered={false}>
                            <Row gutter={[32, 32]} align="middle">
                                <Col xs={24} md={12}>
                                    <div className="product-image-container">
                                        <img
                                            src={upcomingProduct.imageUrl}
                                            alt={upcomingProduct.name}
                                            className="product-image"
                                        />
                                        <div className="coming-soon-badge">
                                            <TagOutlined /> Prochainement
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <div>
                                            <Title level={3}>{upcomingProduct.name}</Title>
                                            <Paragraph className="product-description">
                                                {upcomingProduct.description}
                                            </Paragraph>
                                        </div>

                                        <div className="price-section">
                                            <Text className="price-label">Prix de lancement</Text>
                                            <Title level={2} className="product-price">
                                                {upcomingProduct.price} DT
                                            </Title>
                                        </div>

                                        <Card className="countdown-card">
                                            <Title level={4} className="countdown-title">
                                                Disponible dans :
                                            </Title>
                                            <Countdown
                                                value={new Date(upcomingProduct.launchDate).getTime()}
                                                format="D[j] H[h] m[m] s[s]"
                                                onFinish={onCountdownFinish}
                                                valueStyle={{
                                                    fontSize: '32px',
                                                    fontWeight: 'bold',
                                                    color: '#1890ff'
                                                }}
                                            />
                                        </Card>

                                        <button className="notify-btn">
                                            <span>🔔</span> Me notifier au lancement
                                        </button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>
            ) : null} */}

            {/* Additional News Section */}
            <div className="news-grid-section">
                <div className="container">
                    <h1 className="section-title">
                        Comming Soon...
                    </h1>
                    <Row gutter={[24, 24]}>
                        {/* <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={<div className="news-card-image" style={{ backgroundColor: '#f0f2f5' }}></div>}
                            >
                                <Card.Meta
                                    title="Collection Automne 2024"
                                    description="Découvrez notre nouvelle collection inspirée des tendances de la saison."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={<div className="news-card-image" style={{ backgroundColor: '#e6f7ff' }}></div>}
                            >
                                <Card.Meta
                                    title="Offres Exclusives"
                                    description="Profitez de nos promotions spéciales sur une sélection d'articles."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={<div className="news-card-image" style={{ backgroundColor: '#fff7e6' }}></div>}
                            >
                                <Card.Meta
                                    title="Guide Style"
                                    description="Nos conseils pour créer les meilleures combinaisons de looks."
                                />
                            </Card>
                        </Col> */}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;