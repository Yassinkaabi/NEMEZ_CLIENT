import { Card, Typography, Button, Tag, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/productCard.css"
import { COLOR_MAP } from '../constants/colors';

const { Text } = Typography;

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const isInStock = product.stock > 0;


    const getColorHex = (color: any): string => {
        if (!color) return '#000000';

        if (typeof color === 'object') {
            if (color.hex) return color.hex;
            if (color.name) {
                const lower = String(color.name).toLowerCase().trim();
                return COLOR_MAP[lower] || color.name;
            }
            if (color.value) {
                const lower = String(color.value).toLowerCase().trim();
                return COLOR_MAP[lower] || color.value;
            }
        }

        if (typeof color === 'string') {
            const lower = color.toLowerCase().trim();
            return COLOR_MAP[lower] || color;
        }

        return '#000000';
    };

    // Image par défaut (première couleur ou image par défaut)
    const defaultImage = (() => {
        // if (Array.isArray(product.colors) && product.colors.length > 0) {
        //     const firstColor = product.colors[0];
        //     if (typeof firstColor === 'object' && Array.isArray(firstColor.images) && firstColor.images.length > 0) {
        //         return firstColor.images[0];
        //     }
        // }
        return product.images?.[1] || '';
    })();

    // Couleurs disponibles (limiter l'affichage à 4 maximum)
    const displayColors = product.colors?.slice(0, 4) || [];
    const hasMoreColors = product.colors?.length > 4;

    // Tailles disponibles (limiter l'affichage à 5 maximum)
    const displaySizes = product.sizes?.slice(0, 5) || [];
    const hasMoreSizes = product.sizes?.length > 5;

    return (
        <Link to={`/product/${encodeURIComponent(product.name)}`} className="product-card-link">
            <Card
                hoverable
                cover={
                    <div className="product-image-container">
                        <img
                            alt={product.name}
                            src={product.images[0]}
                            className="product-image"
                            style={{
                                filter: !isInStock ? 'grayscale(50%) opacity(0.7)' : 'none'
                            }}
                        />

                        {defaultImage && (
                            <img
                                alt={`${product.name} - hover`}
                                src={defaultImage}
                                className="product-image hover"
                                style={{
                                    filter: !isInStock ? 'grayscale(50%) opacity(0.7)' : 'none',
                                }}
                            />
                        )}
                        <Tag
                            color={isInStock ? 'success' : 'error'}
                            className="stock-badge"
                        >
                            {isInStock ? 'En Stock' : 'Hors Stock'}
                        </Tag>
                    </div>
                }
                styles={{ body: { padding: 16 } }}
                className="product-card"
            >
                <h3 className="product-name">
                    {product.name}
                </h3>

                {/* Couleurs disponibles */}
                {displayColors.length > 0 && (
                    <div className="product-colors">
                        <Space size={4} wrap>
                            {displayColors.map((color: any, index: number) => {
                                const hexColor = getColorHex(color);
                                const isLightColor = ['#FFFFFF', '#FFFFF0', '#FFFDD0', '#F5F5DC', '#ffffff'].includes(hexColor.toLowerCase());
                                const colorName = typeof color === 'object' ? (color.name || color.value) : color;

                                return (
                                    <div
                                        key={index}
                                        className="color-dot"
                                        style={{
                                            backgroundColor: hexColor,
                                            border: isLightColor ? '1px solid #d9d9d9' : 'none'
                                        }}
                                        title={colorName}
                                    />
                                );
                            })}
                            {hasMoreColors && (
                                <Text className="more-indicator">+{product.colors.length - 4}</Text>
                            )}
                        </Space>
                    </div>
                )}

                {/* Tailles disponibles */}
                {displaySizes.length > 0 && (
                    <div className="product-sizes">
                        <Space size={4} wrap>
                            {displaySizes.map((size: string, index: number) => (
                                <span key={index} className="size-tag">
                                    {size}
                                </span>
                            ))}
                            {hasMoreSizes && (
                                <Text className="more-indicator">+{product.sizes.length - 5}</Text>
                            )}
                        </Space>
                    </div>
                )}

                <Text className="product-price">
                    {product.price} TND
                </Text>

                <Button
                    type="primary"
                    block
                    className="product-button"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/product/${product.name}`);
                    }}
                    disabled={!isInStock}
                >
                    <span className="button-text">Voir les détails</span>
                    <span className="button-icon">→</span>
                </Button>
            </Card>
        </Link>
    );
};

export default ProductCard;