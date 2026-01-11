import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Collapse, Checkbox, Slider, Pagination, Spin, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

const { Title } = Typography;
const { Panel } = Collapse;

const Category = () => {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 500,
        sizes: [] as string[],
        colors: [] as string[]
    });

    const { data, isLoading } = useQuery({
        queryKey: ['products', id, page, filters],
        queryFn: () => {
            const params = new URLSearchParams({
                categoryId: id || '',
                page: page.toString(),
                limit: '12',
                minPrice: filters.minPrice.toString(),
                maxPrice: filters.maxPrice.toString(),
                ...(filters.sizes.length && { sizes: filters.sizes.join(',') }),
                ...(filters.colors.length && { colors: filters.colors.join(',') })
            });
            return api.get(`/products?${params}`);
        }
    });

    const products = data?.data?.products || [];
    const pagination = data?.data?.pagination || {};

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleSizeChange = (checkedValues: any) => {
        setFilters({ ...filters, sizes: checkedValues });
        setPage(1);
    };

    const handlePriceChange = (value: number[]) => {
        setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
        setPage(1);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
            <Row gutter={[24, 24]}>
                {/* Filtres */}
                <Col xs={24} lg={6}>
                    <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
                        <Title level={4}>Filtres</Title>

                        <Collapse defaultActiveKey={['1']} ghost>
                            <Panel header="Prix" key="1">
                                <Slider
                                    range
                                    min={0}
                                    max={500}
                                    value={[filters.minPrice, filters.maxPrice]}
                                    onChange={handlePriceChange}
                                    marks={{
                                        0: '0 DT',
                                        500: '500 DT'
                                    }}
                                />
                            </Panel>

                            <Panel header="Taille" key="2">
                                <Checkbox.Group
                                    options={sizeOptions}
                                    value={filters.sizes}
                                    onChange={handleSizeChange}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                />
                            </Panel>

                            {/* <Panel header="Couleur" key="3">
                                <Checkbox.Group
                                    options={colorOptions}
                                    value={filters.colors}
                                    onChange={handleColorChange}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                />
                            </Panel> */}
                        </Collapse>
                    </div>
                </Col>

                {/* Produits */}
                <Col xs={24} lg={18}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: 100 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
                                {products.map((product: any) => (
                                    <Col xs={24} sm={12} md={8} key={product._id}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>

                            <div style={{ textAlign: 'center' }}>
                                <Pagination
                                    current={page}
                                    total={pagination.total}
                                    pageSize={pagination.limit}
                                    onChange={setPage}
                                    showSizeChanger={false}
                                />
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Category;
