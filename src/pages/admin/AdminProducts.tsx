import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, Select, message, Popconfirm, Tag, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const { Search } = Input;

interface Variant {
    size: string;
    color: string;
    stock: number;
}

// Predefined options
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const AVAILABLE_COLORS = [
    'noir', 'blanc', 'gris', 'bleu', 'rouge', 'vert', 'rose',
    'marron'
];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [form] = Form.useForm();
    const [variantForm] = Form.useForm();
    const [tempSizes, setTempSizes] = useState<string[]>([]);
    const [tempColors, setTempColors] = useState<string[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [pagination.page, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllProducts({
                page: pagination.page,
                limit: pagination.limit,
                search,
            });
            setProducts(response.data.products);
            setPagination({ ...pagination, total: response.data.pagination.total });
        } catch (error) {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await adminService.getAllCategories();
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPagination({ ...pagination, page: 1 });
    };

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setVariants([]);
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId._id,
            images: product.images.join(', '),
            sizes: product.sizes,
            colors: product.colors,
        });
        setVariants(product.variants || []);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteProduct(id);
            message.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            message.error('Failed to delete product');
        }
    };

    const handleBasicInfoSubmit = (values: any) => {
        const sizes = values.sizes;
        const colors = values.colors;

        setTempSizes(sizes);
        setTempColors(colors);

        // Create a map of existing variants to preserve stock
        const existingVariantsMap = new Map();
        if (variants && variants.length > 0) {
            variants.forEach(v => {
                existingVariantsMap.set(`${v.size}-${v.color}`, v.stock);
            });
        }

        const newVariants: Variant[] = [];
        const variantFields: any = {};
        let index = 0;

        sizes.forEach((size: string) => {
            colors.forEach((color: string) => {
                const key = `${size}-${color}`;
                // Preserve stock if variant existed, otherwise default to 10
                const stock = existingVariantsMap.has(key) ? existingVariantsMap.get(key) : 10;

                newVariants.push({
                    size,
                    color,
                    stock,
                });
                variantFields[`variant_${index}`] = stock;
                index++;
            });
        });

        setVariants(newVariants);
        variantForm.setFieldsValue(variantFields);

        setIsModalOpen(false);
        setIsVariantModalOpen(true);
    };



    const handleFinalSubmit = async () => {
        try {
            // Validate variant form
            await variantForm.validateFields();
            const variantValues = variantForm.getFieldsValue();

            // Update variants with form values
            const updatedVariants = variants.map((variant, index) => ({
                ...variant,
                stock: variantValues[`variant_${index}`] || 0,
            }));

            const formValues = form.getFieldsValue();
            const productData = {
                ...formValues,
                images: formValues.images.split(',').map((img: string) => img.trim()),
                sizes: tempSizes,
                colors: tempColors,
                variants: updatedVariants,
            };

            if (editingProduct) {
                await adminService.updateProduct(editingProduct._id, productData);
                message.success('Product updated successfully');
            } else {
                await adminService.createProduct(productData);
                message.success('Product created successfully');
            }

            setIsVariantModalOpen(false);
            form.resetFields();
            variantForm.resetFields();
            setEditingProduct(null);
            setVariants([]);
            fetchProducts();
        } catch (error) {
            message.error('Failed to save product');
        }
    };

    const handleCancelVariantModal = () => {
        variantForm.resetFields();
        setIsVariantModalOpen(false);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'productId',
            width: 80,
        },
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            render: (images: string[]) => (
                <img src={images[0]} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'categoryId',
            key: 'category',
            render: (category: any) => category?.name || 'N/A',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toFixed(2)} TND`,
        },
        {
            title: 'Variants',
            dataIndex: 'variants',
            key: 'variants',
            render: (variants: Variant[]) => variants?.length || 0,
        },
        {
            title: 'Total Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="action-buttons">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="action-btn edit"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                            className="action-btn delete"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="admin-table">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Product Management</h2>
                    <div className="admin-table-actions">
                        <Search
                            placeholder="Search products..."
                            onSearch={handleSearch}
                            className="admin-search"
                            prefix={<SearchOutlined />}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            className="admin-btn"
                        >
                            Add Product
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                    }}
                />

                {/* Basic Info Modal */}
                <Modal
                    title={editingProduct ? 'Edit Product - Basic Info' : 'Add Product - Basic Info'}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingProduct(null);
                        setVariants([]);
                    }}
                    footer={null}
                    className="admin-modal"
                    width={600}
                >
                    <Form form={form} layout="vertical" onFinish={handleBasicInfoSubmit}>
                        <Form.Item
                            name="name"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber min={0} step={0.01} style={{ width: '100%' }} prefix="$" />
                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label="Category"
                            rules={[{ required: true, message: 'Please select category' }]}
                        >
                            <Select>
                                {categories.map((cat: any) => (
                                    <Select.Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="images"
                            label="Images (comma-separated URLs)"
                            rules={[{ required: true, message: 'Please enter image URLs' }]}
                        >
                            <Input.TextArea rows={2} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                        </Form.Item>

                        <Form.Item
                            name="sizes"
                            label="Sizes"
                            rules={[{ required: true, message: 'Please enter sizes' }]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select or type sizes"
                                options={AVAILABLE_SIZES.map(size => ({ label: size, value: size }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="colors"
                            label="Colors"
                            rules={[{ required: true, message: 'Please enter colors' }]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select or type colors"
                                options={AVAILABLE_COLORS.map(color => ({ label: color, value: color }))}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="admin-btn">
                                Next: Configure Stock
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Variant Stock Modal */}
                <Modal
                    title="Configure Variant Stock"
                    open={isVariantModalOpen}
                    onCancel={handleCancelVariantModal}
                    onOk={handleFinalSubmit}
                    okText={editingProduct ? 'Update Product' : 'Create Product'}
                    cancelText="Back"
                    className="admin-modal"
                    width={800}
                >
                    <p style={{ marginBottom: 16, color: '#666' }}>
                        Set the stock quantity for each size and color combination:
                    </p>
                    <Form form={variantForm} layout="vertical">
                        <Row gutter={[16, 16]}>
                            {variants.map((variant, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card size="small" style={{ background: '#f5f5f5' }}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Size:</strong> {variant.size} | <strong>Color:</strong> {variant.color}
                                        </div>
                                        <Form.Item
                                            name={`variant_${index}`}
                                            rules={[{ required: true, message: 'Stock is required' }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <InputNumber
                                                min={0}
                                                style={{ width: '100%' }}
                                                addonBefore="Stock"
                                            />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Form>
                    {variants.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                            No variants configured
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
