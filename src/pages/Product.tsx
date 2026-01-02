import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ShoppingCart, Home, Check, X, Minus, Plus } from 'lucide-react';
import '../styles/product.css';
import { api } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { addToCart } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/redux';
import ReviewList from '../components/ReviewList';
import type { RootState } from '../store';

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

    const { data: categoryData } = useQuery({
        queryKey: ['category', data?.data?.product?.category],
        queryFn: () => api.get(`/categories/${data?.data?.product?.category}`),
        enabled: !!data?.data?.product?.category,
    });

    const user = useAppSelector((state: RootState) => state.auth.user);
    const product = data?.data?.product;
    // const reviewStats = data?.data?.reviewStats;
    const category = categoryData?.data?.category;

    const selectedVariant = product?.variants?.find(
        (v: Variant) => v.size === selectedSize && v.color === selectedColor
    );
    const variantStock = selectedVariant?.stock || 0;
    const isInStock = variantStock > 0;

    const totalStock = product?.variants?.reduce((sum: number, v: Variant) => sum + v.stock, 0) || 0;

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
    }, [sizes, normalizedColors, selectedSize, selectedColor]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast({
                title: "Selection required",
                description: "Please choose a size and color",
                variant: "destructive",
            });
            return;
        }

        if (!isInStock) {
            toast({
                title: "Out of stock",
                description: `${selectedSize} / ${selectedColor} is currently unavailable`,
                variant: "destructive",
            });
            return;
        }

        if (quantity > variantStock) {
            toast({
                title: "Limited stock",
                description: `Only ${variantStock} item${variantStock > 1 ? 's' : ''} available`,
                variant: "destructive",
            });
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

        toast({
            title: "Added to cart!",
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

    // const renderStars = (rating: number) => {
    //     return Array.from({ length: 5 }, (_, i) => (
    //         <Star
    //             key={i}
    //             className={`star ${i < Math.floor(rating) ? '' : 'star--empty'}`}
    //             fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
    //         />
    //     ));
    // };

    return (
        <div className="product-page">
            {/* Navigation */}
            <nav className="product-nav">
                <button className="back-button" onClick={handleBack}>
                    <ChevronLeft size={18} />
                    <span>Back</span>
                </button>

                <div className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} style={{ marginRight: 4, display: 'inline' }} />
                        Home
                    </Link>
                    <span className="breadcrumb-separator">›</span>
                    {category ? (
                        <Link to={`/category/${category._id}`} className="breadcrumb-link">
                            {category.name}
                        </Link>
                    ) : (
                        <span className="breadcrumb-link">Category</span>
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
                    <h1 className="product-title">{product?.name}</h1>

                    {/* <div className="rating-container">
                        <div className="stars">
                            {renderStars(reviewStats?.averageRating || 0)}
                        </div>
                        <span className="rating-text">
                            ({reviewStats?.averageRating?.toFixed(1) || '0.0'}) · {reviewStats?.totalReviews || 0} reviews
                        </span>
                    </div> */}

                    <div className="price-stock">
                        <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                            <h1 className="price">{product?.price}</h1>
                            <span style={{ fontSize: '16px' }}>TND</span>
                        </div>
                        <span className={`stock-badge ${isInStock ? 'stock-badge--in-stock' : 'stock-badge--out-of-stock'}`}>
                            {isInStock ? <Check size={14} /> : <X size={14} />}
                            {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {selectedSize && selectedColor && isInStock && variantStock < 10 && (
                        <p className="stock-info">
                            <strong>{variantStock}</strong> {variantStock === 1 ? 'item available' : 'items available'} for {selectedSize} / {selectedColor}
                        </p>
                    )}

                    {(!selectedSize || !selectedColor) && totalStock > 0 && (
                        <p className="stock-info">
                            {totalStock} {totalStock === 1 ? 'item available' : 'items available'} total
                        </p>
                    )}

                    <div className="variant-selectors">
                        <div className="variant-group">
                            <span className="variant-label">Available Size</span>
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
                            <span className="variant-label">Available Color</span>
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
                            {isInStock ? 'Add to Cart' : 'Unavailable'}
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
