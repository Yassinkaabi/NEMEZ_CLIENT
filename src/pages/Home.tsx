import { Row, Col, Card, Typography, Spin, Button, Carousel } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
        // {
        //     image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop',
        //     title: 'Collection Hiver 2025',
        //     subtitle: 'Découvrez les tendances de la saison',
        //     cta: 'Découvrir',
        //     overlay: 'rgba(0, 0, 0, 0.4)'
        // },
        // {
        //     image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop',
        //     title: 'Nouveautés Exclusives',
        //     subtitle: 'Les dernières pièces qui font sensation',
        //     cta: 'Voir la collection',
        //     overlay: 'rgba(0, 0, 0, 0.45)'
        // },
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
                style={{ marginBottom: 60 }}
            >
                {heroSlides.map((slide, idx) => (
                    <div key={idx}>
                        <div
                            style={{
                                position: 'relative',
                                height: '90vh',
                                background: `linear-gradient(${slide.overlay}, ${slide.overlay}), url(${slide.image}) center/cover`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{
                                textAlign: 'center',
                                maxWidth: 800,
                                padding: '0 20px',
                                animation: 'fadeInUp 1s ease-out'
                            }}>
                                <Title
                                    level={1}
                                    style={{
                                        color: '#fff',
                                        fontSize: 56,
                                        fontWeight: 700,
                                        marginBottom: 20,
                                        textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                                        letterSpacing: '-1px'
                                    }}
                                >
                                    {slide.title}
                                </Title>
                                <Paragraph
                                    style={{
                                        color: '#fff',
                                        fontSize: 22,
                                        marginBottom: 40,
                                        textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                                        fontWeight: 300
                                    }}
                                >
                                    {slide.subtitle}
                                </Paragraph>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={scrollToNouveautes}
                                    style={{
                                        height: 50,
                                        padding: '0 40px',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        borderRadius: 25,
                                        background: '#fff',
                                        color: '#000',
                                        border: 'none',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                    }}
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
                {/* <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <Title level={2} style={{ fontSize: 36, fontWeight: 700, marginBottom: 10 }}>
                        Nos Catégories
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: '#666' }}>
                        Explorez notre sélection par catégorie
                    </Paragraph>
                </div>

                {categoriesLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[24, 24]} style={{ marginBottom: 80 }}>
                        {categoriesData?.data?.categories?.map((category: any) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
                                <Link to={`/category/${category._id}`}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div style={{
                                                height: 250,
                                                overflow: 'hidden',
                                                borderRadius: '8px 8px 0 0'
                                            }}>
                                                <img
                                                    alt={category.name}
                                                    src={category.image}
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                />
                                            </div>
                                        }
                                        style={{
                                            borderRadius: 8,
                                            border: '1px solid #f0f0f0',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <Card.Meta
                                            title={
                                                <span style={{
                                                    fontSize: 18,
                                                    fontWeight: 600,
                                                    color: '#000'
                                                }}>
                                                    {category.name}
                                                </span>
                                            }
                                            description={
                                                <span style={{ color: '#666' }}>
                                                    {category.description}
                                                </span>
                                            }
                                        />
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                )} */}

                {/* Recent Products Section */}
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