import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Row,
    Col,
    Typography,
    Button,
    InputNumber,
    Space,
    message,
    Rate,
    Spin,
    Breadcrumb,
    Tag,
} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    ShoppingCartOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { api } from '../services/api';
import { addToCart } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/redux';
import ReviewList from '../components/ReviewList';

const { Title, Text } = Typography;
const IMAGE_HEIGHT = 600;

const COLOR_NAME_TO_HEX: Record<string, string> = {
    black: '#000000', noir: '#000000',
    white: '#ffffff', blanc: '#ffffff',
    gray: '#8c8c8c', gris: '#8c8c8c',
    beige: '#f5f5dc',
    navy: '#001f3f', bleu: '#0074d9',
    red: '#ff4136', rouge: '#ff4136',
    green: '#2ecc40', vert: '#2ecc40',
    pink: '#ff69b4', rose: '#ff69b4',
    brown: '#8b4513', marron: '#8b4513',
};

interface ColorItem {
    name: string;
    value: string;
    hex: string;
    images: string[];
}

const Product = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => api.get(`/products/name/${slug}`),
    });

    // Récupérer la catégorie du produit
    const { data: categoryData } = useQuery({
        queryKey: ['category', data?.data?.product?.category],
        queryFn: () => api.get(`/categories/${data?.data?.product?.category}`),
        enabled: !!data?.data?.product?.category,
    });

    const product = data?.data?.product;
    const reviewStats = data?.data?.reviewStats;
    const category = categoryData?.data?.category;

    // Find the selected variant based on size and color
    const selectedVariant = product?.variants?.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor
    );
    const variantStock = selectedVariant?.stock || 0;
    const isInStock = variantStock > 0;

    // Calculate total stock across all variants
    const totalStock = product?.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;

    const normalizedColors: ColorItem[] = Array.isArray(product?.colors)
        ? product.colors.map((c: any) => {
            if (typeof c === 'string') {
                const lower = c.toLowerCase().trim();
                return {
                    name: c,
                    value: lower,
                    hex: COLOR_NAME_TO_HEX[lower] || '#000000',
                    images: product.images || [],
                };
            }

            const value = (c.value || c.name || '').toString().toLowerCase();
            const hex = c.hex || COLOR_NAME_TO_HEX[value] || '#000000';

            return {
                name: c.name || c.value || value,
                value,
                hex,
                images: c.images || product.images || [],
            };
        })
        : [];

    const sizes: string[] = product?.sizes || [];
    const currentColorImages = normalizedColors.find(c => c.value === selectedColor)?.images || product?.images || [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedColor]);

    useEffect(() => {
        if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0]);
        if (normalizedColors.length > 0 && !selectedColor) {
            setSelectedColor(normalizedColors[0].value);
        }
    }, [sizes, normalizedColors]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            message.warning('Veuillez choisir une taille et une couleur');
            return;
        }

        if (!isInStock) {
            message.error(`La variante ${selectedSize} / ${selectedColor} est en rupture de stock`);
            return;
        }

        if (quantity > variantStock) {
            message.warning(`Seulement ${variantStock} article${variantStock > 1 ? 's' : ''} disponible${variantStock > 1 ? 's' : ''} pour cette variante`);
            return;
        }

        dispatch(
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: currentColorImages[0],
                size: selectedSize,
                color: selectedColor,
                quantity,
            })
        );
        message.success('Ajouté au panier !');
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    // Breadcrumb items dynamiques
    const breadcrumbItems = [
        {
            title: (
                <Link to="/" style={{ color: '#666' }}>
                    <HomeOutlined style={{ marginRight: 4 }} />
                    Accueil
                </Link>
            ),
        },
        {
            title: category ? (
                <Link to={`/category/${category._id}`} style={{ color: '#666' }}>
                    {category.name}
                </Link>
            ) : (
                <span style={{ color: '#999' }}>Catégorie</span>
            ),
        },
        {
            title: <span style={{ color: '#000', fontWeight: 500 }}>{product?.name}</span>,
        },
    ];

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
            {/* Bouton retour + Breadcrumb */}
            <div style={{ marginBottom: 20 }}>
                <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={handleBack}
                    style={{ marginBottom: 12, padding: '4px 8px' }}
                >
                    Retour
                </Button>

                <Breadcrumb
                    items={breadcrumbItems}
                    separator="›"
                    style={{ fontSize: 14 }}
                />
            </div>

            <Row gutter={60} style={{ marginTop: 40 }}>
                {/* ==================== IMAGES ==================== */}
                <Col xs={24} lg={12}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ borderRadius: 12, overflow: 'hidden', textAlign: 'center', marginBottom: 16, width: '100%', height: IMAGE_HEIGHT, background: '#f5f5f5' }}>
                            <img
                                src={currentColorImages[currentImageIndex] || '/placeholder.jpg'}
                                alt={`${product?.name} - ${selectedColor}`}
                                style={{ width: '100%', height: '100%', objectPosition: 'center top' }}
                            />
                        </div>

                        {currentColorImages.length > 1 && (
                            <>
                                <Button shape="circle" icon={<LeftOutlined />}
                                    style={{ position: 'absolute', top: '40%', left: 16, transform: 'translateY(-50%)', zIndex: 10 }}
                                    onClick={() => setCurrentImageIndex(i => i === 0 ? currentColorImages.length - 1 : i - 1)} />
                                <Button shape="circle" icon={<RightOutlined />}
                                    style={{ position: 'absolute', top: '40%', right: 16, transform: 'translateY(-50%)', zIndex: 10 }}
                                    onClick={() => setCurrentImageIndex(i => i === currentColorImages.length - 1 ? 0 : i + 1)} />
                            </>
                        )}

                        <Space size={12} style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
                            {currentColorImages.map((img: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: currentImageIndex === idx ? '2px solid #000' : '2px solid transparent',
                                        width: 80,
                                        height: 106,
                                    }}
                                >
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </Space>
                    </div>
                </Col>

                {/* ==================== INFOS ==================== */}
                <Col xs={24} lg={12}>
                    <Title level={1} style={{ margin: '0 0 16px', fontWeight: 500 }}>
                        {product?.name}
                    </Title>

                    <Space size={4} style={{ marginBottom: 16 }}>
                        <Rate
                            disabled
                            value={reviewStats?.averageRating || 0}
                            allowHalf
                            style={{ fontSize: 20 }}
                        />
                        <Text type="secondary">
                            ({reviewStats?.averageRating?.toFixed(1) || '0.0'}) · {reviewStats?.totalReviews || 0} avis
                        </Text>
                    </Space>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0 16px' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            {product?.price} TND
                        </Title>
                        <Tag
                            icon={isInStock ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            color={isInStock ? 'success' : 'error'}
                            style={{
                                fontSize: '14px',
                                padding: '4px 12px',
                                fontWeight: 600,
                                border: 'none'
                            }}
                        >
                            {isInStock ? 'En Stock' : 'Hors Stock'}
                        </Tag>
                    </div>

                    {selectedSize && selectedColor && (
                        <>
                            {isInStock ? (
                                <Text type="secondary" style={{ display: 'block', marginBottom: '32px', fontSize: '14px' }}>
                                    <strong>{variantStock}</strong> {variantStock === 1 ? 'article disponible' : 'articles disponibles'} pour {selectedSize} / {selectedColor}
                                </Text>
                            ) : (
                                <Text type="danger" style={{ display: 'block', marginBottom: '32px', fontSize: '14px' }}>
                                    Cette variante ({selectedSize} / {selectedColor}) est en rupture de stock
                                </Text>
                            )}
                        </>
                    )}
                    {(!selectedSize || !selectedColor) && totalStock > 0 && (
                        <Text type="secondary" style={{ display: 'block', marginBottom: '32px', fontSize: '14px' }}>
                            {totalStock} {totalStock === 1 ? 'article disponible' : 'articles disponibles'} au total
                        </Text>
                    )}

                    <div style={{ display: 'flex', gap: '100px', marginBottom: '35px' }}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>Available Size</Text>
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                maxWidth: "240px",
                            }}>
                                {sizes.map((size) => (
                                    <Button
                                        key={size}
                                        type={selectedSize === size ? 'primary' : 'default'}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 8,
                                            background: selectedSize === size ? '#000' : '#fff',
                                            color: selectedSize === size ? '#fff' : '#000',
                                            border: '1px solid #d9d9d9',
                                            display: 'flex',
                                        }}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>Available Color</Text>
                            <Space size={16}>
                                {normalizedColors.map((color) => {
                                    const isSelected = selectedColor === color.value;

                                    return (
                                        <div
                                            key={color.value}
                                            onClick={() => setSelectedColor(color.value)}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                border: isSelected ? "3px solid #222" : "",
                                                padding: 8,
                                                boxShadow: isSelected ? "0 0 0 3px #fff" : "",
                                                transition: "all 0.15s ease",
                                            }}
                                            title={color.name}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    borderRadius: "50%",
                                                    background: color.hex,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </Space>
                        </div>
                    </div>

                    <Space size={16} align="center">
                        <InputNumber
                            min={1}
                            max={isInStock ? variantStock : 0}
                            value={quantity}
                            onChange={(v) => setQuantity(v || 1)}
                            style={{ width: 140 }}
                            disabled={!isInStock}
                        />
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddToCart}
                            disabled={!isInStock}
                            style={{
                                background: isInStock ? '#000' : '#d9d9d9',
                                border: 'none',
                                borderRadius: 8,
                                height: 56,
                                padding: '0 40px',
                                cursor: isInStock ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {isInStock ? 'Add to cart' : 'Indisponible'}
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Section Avis - Using ReviewList Component */}
            {slug && (
                <ReviewList
                    productId={slug}
                    currentUserId={user?.id ? parseInt(user.id) : undefined}
                    isAdmin={user?.role === 'admin'}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </div>
    );
};

export default Product;