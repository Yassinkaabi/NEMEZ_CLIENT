import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ShoppingCart, Home, Minus, Plus } from 'lucide-react';
import '../styles/product.css';
import { api } from '../services/api';
import { COLOR_MAP } from '../constants/colors';
import { useToast } from '../hooks/use-toast';
import { addToCart } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/redux';
import ReviewList from '../components/ReviewList';
import type { RootState } from '../store';
import { Typography } from 'antd';


const { Title } = Typography;

interface ColorItem {
    name: string;
    value: string;
    hex: string;
    images: string[];
}

interface Variant {
    size: string;
    color: string;
    stock: number;
}

const Product = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const dispatch = useAppDispatch()
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => api.get(`/products/name/${slug}`),
    });

    const user = useAppSelector((state: RootState) => state.auth.user);
    const product = data?.data?.product;

    const selectedVariant = product?.variants?.find(
        (v: Variant) => v.size === selectedSize && v.color === selectedColor
    );
    const variantStock = selectedVariant?.stock || 0;
    const isInStock = variantStock > 0;

    const totalStock = product?.variants?.reduce((sum: number, v: Variant) => sum + v.stock, 0) || 0;

    const normalizedColors: ColorItem[] = Array.isArray(product?.colors)
        ? product.colors.map((c: any) => {
            // If it's already in the new format with images
            if (typeof c === 'object' && c.value) {
                return {
                    name: c.name || c.value,
                    value: c.value.toLowerCase().trim(),
                    hex: c.hex || COLOR_MAP[c.value.toLowerCase().trim()] || '#000000',
                    images: c.images || product.images || [],
                };
            }
            // Old format (string)
            if (typeof c === 'string') {
                const lower = c.toLowerCase().trim();
                return {
                    name: c,
                    value: lower,
                    hex: COLOR_MAP[lower] || '#000000',
                    images: product.images || [],
                };
            }
            return {
                name: 'Inconnu',
                value: 'inconnu',
                hex: '#000000',
                images: product.images || [],
            };
        })
        : [];

    const sizes: string[] = product?.sizes || [];

    // Get images for the currently selected color
    const currentColorImages = (() => {
        const selectedColorObj = normalizedColors.find(c => c.value === selectedColor);
        if (selectedColorObj) {
            // If color has specific images, use them; otherwise fall back to default
            return selectedColorObj.images.length > 0
                ? selectedColorObj.images
                : product?.images || [];
        }
        return product?.images || [];
    })();

    // Reset image index when color changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedColor]);

    // Set default selections
    useEffect(() => {
        if (sizes.length > 0 && !selectedSize) {
            setSelectedSize(sizes[0]);
        }
        if (normalizedColors.length > 0 && !selectedColor) {
            setSelectedColor(normalizedColors[0].value);
        }
    }, [sizes, normalizedColors, selectedSize, selectedColor]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast({
                title: "Sélection requise",
                description: "Veuillez choisir une taille et une couleur",
                variant: "destructive",
            });
            return;
        }

        if (!isInStock) {
            toast({
                title: "Rupture de stock",
                description: `${selectedSize} / ${selectedColor} est actuellement indisponible`,
                variant: "destructive",
            });
            return;
        }

        if (quantity > variantStock) {
            toast({
                title: "Stock limité",
                description: `Seulement ${variantStock} article${variantStock > 1 ? 's' : ''} disponible${variantStock > 1 ? 's' : ''}`,
                variant: "destructive",
            });
            return;
        }

        dispatch(
            addToCart({
                cartItemId: `${product._id}_${selectedSize}_${selectedColor}`,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: currentColorImages[0],
                size: selectedSize,
                color: selectedColor,
                quantity,
                maxStock: variantStock,
            })
        );

        toast({
            title: "Ajouté au panier !",
            description: `${product.name} (${selectedSize}, ${selectedColor}) × ${quantity}`,
        });
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="product-page">
            {/* Navigation */}
            <nav className="product-nav">
                <button className="back-button" onClick={handleBack}>
                    <ChevronLeft size={18} />
                    <span>Retour</span>
                </button>

                <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} style={{ marginRight: 4, display: 'inline' }} />
                        Accueil
                    </Link>
                    <span className="breadcrumb-separator">›</span>
                    {product ? (
                        <Link to={`/category/${product.categoryId._id}`} className="breadcrumb-link">
                            {product.categoryId.name}
                        </Link>
                    ) : (
                        <span className="breadcrumb-link">Catégorie</span>
                    )}
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">{product?.name}</span>
                </div>
            </nav>

            <div className="product-grid">
                {/* Image Gallery */}
                <div className="image-gallery">
                    <div className="main-image-container">
                        <img
                            src={currentColorImages[currentImageIndex] || '/placeholder.jpg'}
                            alt={`${product?.name} - ${selectedColor}`}
                            className="main-image"
                        />

                        {currentColorImages.length > 1 && (
                            <>
                                <button
                                    className="nav-button nav-button--prev"
                                    onClick={() => setCurrentImageIndex(i => i === 0 ? currentColorImages.length - 1 : i - 1)}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className="nav-button nav-button--next"
                                    onClick={() => setCurrentImageIndex(i => i === currentColorImages.length - 1 ? 0 : i + 1)}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="thumbnails">
                        {currentColorImages.map((img: string, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`thumbnail ${currentImageIndex === idx ? 'thumbnail--active' : ''}`}
                            >
                                <img src={img} alt={`${product?.name} view ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <Title level={1} style={{ margin: '0 0 16px', fontWeight: 500 }}>
                        {product?.name}
                    </Title>

                    <div className="price-stock">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Title level={2} style={{ margin: 0 }}>
                                {product?.price} TND
                            </Title>
                        </div>
                        {/* <span className={`stock-badge ${isInStock ? 'stock-badge--in-stock' : 'stock-badge--out-of-stock'}`}>
                            {isInStock ? <Check size={14} /> : <X size={14} />}
                            {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span> */}
                    </div>

                    {selectedSize && selectedColor && isInStock && variantStock < 10 && (
                        <p className="stock-info">
                            <strong>{variantStock}</strong> {variantStock === 1 ? 'article disponible' : 'articles disponibles'} pour {selectedSize} / {selectedColor}
                        </p>
                    )}

                    {(!selectedSize || !selectedColor) && totalStock > 0 && (
                        <p className="stock-info">
                            {totalStock} {totalStock === 1 ? 'article disponible' : 'articles disponibles'} au total
                        </p>
                    )}

                    <div className="variant-selectors">
                        <div className="variant-group">
                            <span className="variant-label">Tailles disponibles</span>
                            <div className="size-options">
                                {sizes.map((size) => {
                                    const sizeVariants = product?.variants?.filter((v: Variant) => v.size === size) || [];
                                    const isSizeInStock = sizeVariants.reduce((sum: number, v: Variant) => sum + (v.stock || 0), 0) > 0;

                                    return (
                                        <button
                                            key={size}
                                            className={`size-button ${selectedSize === size ? 'size-button--selected' : ''} ${!isSizeInStock ? 'size-button--disabled' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                            {!isSizeInStock && <div className="size-button__strikethrough" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="variant-group">
                            <span className="variant-label">Couleurs disponibles</span>
                            <div className="color-options">
                                {normalizedColors.map((color) => {
                                    const colorVariant = product?.variants?.find(
                                        (v: Variant) => v.size === selectedSize && (v.color === color.value || v.color === color.name)
                                    );
                                    const isColorInStock = (colorVariant?.stock || 0) > 0;

                                    return (
                                        <button
                                            key={color.value}
                                            onClick={() => setSelectedColor(color.value)}
                                            className={`color-button ${selectedColor === color.value ? 'color-button--selected' : ''} ${!isColorInStock ? 'color-button--disabled' : ''}`}
                                            title={color.name}
                                        >
                                            <div className="color-swatch" style={{ background: color.hex }} />
                                            {!isColorInStock && <div className="color-button__strikethrough" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="product-description" style={{ margin: '24px 0', lineHeight: 1.6, color: '#666', fontSize: '15px' }}>
                        {product?.description}
                    </div>

                    <div className="actions-row">
                        <div className={`quantity-selector ${!isInStock ? 'quantity-selector--disabled' : ''}`}>
                            <button
                                className="quantity-button"
                                disabled={!isInStock || quantity <= 1}
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                                className="quantity-button"
                                disabled={!isInStock || quantity >= variantStock}
                                onClick={() => setQuantity(q => Math.min(variantStock, q + 1))}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={!isInStock}
                        >
                            <ShoppingCart size={18} />
                            {isInStock ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                    </div>
                </div>
            </div>

            {user?._id && (
                <ReviewList
                    productId={product?.id}
                    currentUserId={user?._id ? parseInt(user._id) : undefined}
                    isAdmin={user?.role === 'admin'}
                    isAuthenticated={user !== null}
                />
            )}
        </div>
    );
};

export default Product;