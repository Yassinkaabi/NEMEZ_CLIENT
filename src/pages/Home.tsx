import { Row, Col, Typography, Spin, Button, Carousel } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect } from 'react';
import AdvertisementCarousel from '../components/AdvertisementCarousel';

const { Title, Paragraph } = Typography;

const Home = () => {
    const nouveautesRef = useRef<HTMLDivElement>(null);
    const [displayLimit, setDisplayLimit] = useState(8);

    useEffect(() => {
        const checkMobile = () => {
            setDisplayLimit(window.innerWidth < 768 ? 6 : 8);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToNouveautes = () => {
        nouveautesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['products', 'recent'],
        queryFn: () => api.get('/products?limit=50') // Charger plus de produits
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

    const products = productsData?.data?.products || [];
    const displayedProducts = products.slice(0, displayLimit);
    // const hasMore = products.length > displayLimit;

    // const loadMore = () => {
    //     const increment = isMobile ? 6 : 8;
    //     setDisplayLimit(prev => prev + increment);
    // };

    return (
        <div style={{ background: '#F7F7F8', minHeight: '100vh' }}>
            {/* Hero Carousel */}
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

            <div className="products-container">
                <div ref={nouveautesRef} className="section-header">
                    <Title level={2} className="section-title">
                        Nouveautés
                    </Title>
                    <Paragraph className="section-subtitle">
                        Les derniers produits ajoutés à notre collection
                    </Paragraph>
                </div>

                {productsLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <Row gutter={[16, 16]} className="products-grid">
                            {displayedProducts.map((product: any) => (
                                <Col xs={12} sm={12} md={8} lg={6} key={product._id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>

                        {/* Bouton Charger Plus */}
                        {/* {hasMore && (
                            <div className="load-more-container">
                                <Button
                                    type="text"
                                    size="large"
                                    icon={<ReloadOutlined />}
                                    onClick={loadMore}
                                    className="load-more-button"
                                >
                                    Charger plus de produits
                                </Button>
                            </div>
                        )} */}
                    </>
                )}
            </div>

            <style>{`
                /* Hero Section */
                .hero-carousel {
                    margin-bottom: 60px;
                }
                .hero-slide {
                    position: relative;
                    height: 90vh;
                    background-position: center;
                    background-size: cover;
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

                /* Products Section */
                .products-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px 80px;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 40px;
                    scroll-margin-top: 80px;
                }
                .section-title.ant-typography {
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #1a1a1a;
                }
                .section-subtitle.ant-typography {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 0;
                }
                .products-grid {
                    margin-bottom: 40px;
                }

                /* Load More Section */
                .load-more-container {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e8e8e8;
                }
                
                .load-more-button {
                    height: 48px;
                    padding: 0 40px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 24px;
                    border: 2px solid #474749ff;
                    color: #474749ff;
                    background: #fff;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
                }
                
                // .load-more-button:hover {
                //     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                //     color: #fff !important;
                //     border-color: transparent;
                //     transform: translateY(-2px);
                //     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                // }
                
                .load-more-button .anticon {
                    font-size: 18px;
                }
                
                .products-count {
                    margin-top: 16px;
                    margin-bottom: 0;
                    font-size: 14px;
                    color: #8c8c8c;
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

                /* Tablet (768px - 991px) */
                @media (max-width: 991px) {
                    .hero-slide {
                        height: 70vh;
                        background-size: cover;
                    }
                    .hero-title.ant-typography {
                        font-size: 44px;
                    }
                    .hero-subtitle.ant-typography {
                        font-size: 20px;
                    }
                    .section-title.ant-typography {
                        font-size: 32px;
                    }
                    .products-container {
                        padding: 0 16px 60px;
                    }
                }

                /* Mobile (moins de 768px) */
                @media (max-width: 767px) {
                    .hero-carousel {
                        margin-bottom: 40px;
                    }
                    .hero-slide {
                        height: 50vh;
                        min-height: 400px;
                    }
                    .hero-title.ant-typography {
                        font-size: 32px;
                        margin-bottom: 15px;
                        letter-spacing: -0.5px;
                    }
                    .hero-subtitle.ant-typography {
                        font-size: 16px;
                        margin-bottom: 30px;
                    }
                    .hero-button {
                        padding: 0 30px;
                        height: 45px;
                        font-size: 15px;
                    }
                    
                    .products-container {
                        padding: 0 12px 50px;
                    }
                    .section-header {
                        margin-bottom: 30px;
                    }
                    .section-title.ant-typography {
                        font-size: 28px;
                        margin-bottom: 8px;
                    }
                    .section-subtitle.ant-typography {
                        font-size: 14px;
                    }
                    
                    /* 2 colonnes en mobile avec espacement réduit */
                    .products-grid {
                        margin-left: -8px !important;
                        margin-right: -8px !important;
                        margin-bottom: 30px;
                    }
                    .products-grid > .ant-col {
                        padding-left: 8px !important;
                        padding-right: 8px !important;
                        margin-bottom: 16px;
                    }
                    
                    .load-more-container {
                        margin-top: 30px;
                        padding-top: 15px;
                    }
                    
                    .load-more-button {
                        height: 44px;
                        padding: 0 30px;
                        font-size: 14px;
                        border-radius: 22px;
                    }
                    
                    .load-more-button .anticon {
                        font-size: 16px;
                    }
                    
                    .products-count {
                        font-size: 13px;
                        margin-top: 12px;
                    }
                }

                /* Très petits écrans (moins de 480px) */
                @media (max-width: 479px) {
                    .hero-slide {
                        height: 45vh;
                        min-height: 350px;
                    }
                    .hero-title.ant-typography {
                        font-size: 26px;
                    }
                    .hero-subtitle.ant-typography {
                        font-size: 14px;
                    }
                    .hero-button {
                        padding: 0 24px;
                        height: 42px;
                        font-size: 14px;
                    }
                    
                    .products-container {
                        padding: 0 10px 40px;
                    }
                    .section-title.ant-typography {
                        font-size: 24px;
                    }
                    
                    /* Espacement encore plus réduit pour très petits écrans */
                    .products-grid {
                        margin-left: -6px !important;
                        margin-right: -6px !important;
                        margin-bottom: 25px;
                    }
                    .products-grid > .ant-col {
                        padding-left: 6px !important;
                        padding-right: 6px !important;
                        margin-bottom: 12px;
                    }
                    
                    .load-more-button {
                        height: 40px;
                        padding: 0 24px;
                        font-size: 13px;
                        border-radius: 20px;
                    }
                    
                    .load-more-button .anticon {
                        font-size: 14px;
                    }
                    
                    .products-count {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;