import { Row, Col, Typography, Spin, Button, Carousel } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import AdvertisementCarousel from '../components/AdvertisementCarousel';

const { Title, Paragraph } = Typography;

const Home = () => {
    const nouveautesRef = useRef<HTMLDivElement>(null);

    const scrollToNouveautes = () => {
        nouveautesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    //     queryKey: ['categories'],
    //     queryFn: () => api.get('/categories')
    // });

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['products', 'recent'],
        queryFn: () => api.get('/products?limit=8')
    });

    const heroSlides = [
        {
            image: '/images/hero.jpeg',
            title: 'Style & Confort',
            subtitle: 'Trouvez votre look parfait',
            cta: 'Explorer',
            overlay: 'rgba(0, 0, 0, 0.35)'
        }
    ];

    return (
        <div style={{ background: '#F7F7F8', minHeight: '100vh' }}>
            {/* Hero Carousel Professionnel */}
            <Carousel
                autoplay
                effect="fade"
                autoplaySpeed={5000}
                className="hero-carousel"
            >
                {heroSlides.map((slide, idx) => (
                    <div key={idx}>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage: `linear-gradient(${slide.overlay}, ${slide.overlay}), url(${slide.image})`,
                            }}
                        >
                            <div className="hero-content">
                                <Title level={1} className="hero-title">
                                    {slide.title}
                                </Title>
                                <Paragraph className="hero-subtitle">
                                    {slide.subtitle}
                                </Paragraph>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={scrollToNouveautes}
                                    className="hero-button"
                                >
                                    {slide.cta}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
            <AdvertisementCarousel />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                <div ref={nouveautesRef} style={{ textAlign: 'center', marginBottom: 50, scrollMarginTop: 80 }}>
                    <Title level={2} style={{ fontSize: 36, fontWeight: 700, marginBottom: 10 }}>
                        Nouveautés
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: '#666' }}>
                        Les derniers produits ajoutés à notre collection
                    </Paragraph>
                </div>

                {productsLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[24, 24]} style={{ marginBottom: 80 }}>
                        {productsData?.data?.products?.map((product: any) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            <style>{`
                .hero-carousel {
                    margin-bottom: 60px;
                }
                .hero-slide {
                    position: relative;
                    height: 90vh;
                    background-position: center;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                }
                .hero-content {
                    text-align: center;
                    max-width: 800px;
                    padding: 0 20px;
                    animation: fadeInUp 1s ease-out;
                }
                .hero-title.ant-typography {
                    color: #fff;
                    font-size: 56px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
                    letter-spacing: -1px;
                }
                .hero-subtitle.ant-typography {
                    color: #fff;
                    font-size: 22px;
                    margin-bottom: 40px;
                    text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
                    font-weight: 300;
                }
                .hero-button {
                    height: 50px;
                    padding: 0 40px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 25px;
                    background: #fff;
                    color: #000;
                    border: none;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }
                .hero-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                    background: #fff !important;
                    color: #000 !important;
                }

                @media (max-width: 992px) {
                    .hero-slide {
                        height: 100vh;
                        background-size: 160% 100%;
                    }
                    .hero-title.ant-typography {
                        font-size: 42px;
                    }
                }

                @media (max-width: 768px) {
                    .hero-slide {
                        height: 60vh;
                    }
                    .hero-title.ant-typography {
                        font-size: 32px;
                        margin-bottom: 15px;
                    }
                    .hero-subtitle.ant-typography {
                        font-size: 18px;
                        margin-bottom: 30px;
                    }
                    .hero-button {
                        padding: 0 30px;
                        height: 45px;
                        font-size: 15px;
                    }
                    .hero-carousel {
                        margin-bottom: 40px;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;