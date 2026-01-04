import { Card, Typography, Button, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate()
    const isInStock = product.stock > 0;

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
                styles={{ body: { padding: 16 } }}
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
                    block
                    style={{ marginTop: 12 }}
                    onClick={() => navigate(`/product/${product.name}`)}
                    disabled={!isInStock}
                >
                    Voir en détail
                </Button>
            </Card>
        </Link>
    );
};

export default ProductCard;