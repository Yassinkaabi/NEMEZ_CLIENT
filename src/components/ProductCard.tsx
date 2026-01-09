import { Card, Typography, Button, Tag, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/productCard.css"

const { Text } = Typography;

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const isInStock = product.stock > 0;

    const colorMap: { [key: string]: string } = {
        'noir': '#000000',
        'blanc': '#FFFFFF',
        'gris': '#808080',
        'rouge': '#ff4136',
        'bleu': '#0074d9',
        'vert': '#2ecc40',
        'jaune': '#FFFF00',
        'orange': '#FFA500',
        'violet': '#800080',
        'rose': '#FFC0CB',
        'marron': '#8b4513',
        'beige': '#F5F5DC',

        // Nuances de bleu
        'bleu marine': '#000080',
        'bleu ciel': '#87CEEB',
        'bleu royal': '#4169E1',
        'turquoise': '#40E0D0',
        'cyan': '#00FFFF',

        // Nuances de rouge
        'rouge foncé': '#8B0000',
        'bordeaux': '#800020',
        'rouge vif': '#FF0000',
        'corail': '#FF7F50',
        'rouge brique': '#B22222',

        // Nuances de vert
        'vert foncé': '#006400',
        'vert clair': '#90EE90',
        'vert olive': '#808000',
        'vert menthe': '#98FF98',
        'vert émeraude': '#50C878',

        // Nuances de gris
        'gris clair': '#D3D3D3',
        'gris foncé': '#A9A9A9',
        'argent': '#C0C0C0',
        'anthracite': '#3A3A3A',

        // Autres couleurs
        'or': '#FFD700',
        'bronze': '#CD7F32',
        'crème': '#FFFDD0',
        'ivoire': '#FFFFF0',
        'kaki': '#C3B091',
        'lavande': '#E6E6FA',
        'magenta': '#FF00FF',
        'navy': '#000080',
        'pêche': '#FFE5B4',
        'prune': '#8E4585',
        'saumon': '#FA8072',
        'taupe': '#483C32',
    };

    const getColorHex = (color: any): string => {
        if (!color) return '#000000';

        if (typeof color === 'object' && color.name) {
            const lower = String(color.name).toLowerCase().trim();
            return colorMap[lower] || color.name;
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
                            {displayColors.map((color: string, index: number) => {
                                const hexColor = getColorHex(color);
                                const isLightColor = ['#FFFFFF', '#FFFFF0', '#FFFDD0', '#F5F5DC'].includes(hexColor.toUpperCase());

                                return (
                                    <div
                                        key={index}
                                        className="color-dot"
                                        style={{
                                            backgroundColor: hexColor,
                                            border: isLightColor ? '1px solid #d9d9d9' : 'none'
                                        }}
                                        title={color}
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