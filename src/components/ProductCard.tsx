import { Card, Typography, Button, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { useAppDispatch } from '../store/redux';

const { Text } = Typography;

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();
    const isInStock = product.stock > 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isInStock) return;

        dispatch(addToCart({
            cartItemId: `${product._id}_${product.sizes[0]}_${product.colors[0]}`,
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: product.sizes[0],
            color: product.colors[0],
            quantity: 1,
            maxStock: product.stock
        }));
    };

    return (
        <Link to={`/product/${encodeURIComponent(product.name)}`}>
            <Card
                hoverable
                cover={
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            alt={product.name}
                            src={product.images[0]}
                            style={{
                                height: 280,
                                width: '100%',
                                objectFit: 'cover',
                                filter: !isInStock ? 'grayscale(50%) opacity(0.7)' : 'none'
                            }}
                        />
                        <Tag
                            color={isInStock ? 'success' : 'error'}
                            style={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            {isInStock ? 'En Stock' : 'Hors Stock'}
                        </Tag>
                    </div>
                }
                bodyStyle={{ padding: 16 }}
                style={{ borderRadius: 8, border: '1px solid #e8e8e8' }}
            >
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                    {product.name}
                </Text>

                <Text style={{ fontSize: 18, color: '#E53935', fontWeight: 600 }}>
                    {product.price} TND
                </Text>

                <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    block
                    style={{ marginTop: 12 }}
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                >
                    {isInStock ? 'Ajouter au panier' : 'Indisponible'}
                </Button>
            </Card>
        </Link>
    );
};

export default ProductCard;