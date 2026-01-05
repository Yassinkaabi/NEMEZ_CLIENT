import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, Select, message, Popconfirm, Tag, Card, Row, Col, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const { Search } = Input;

interface Variant {
    size: string;
    color: string;
    stock: number;
}

interface ColorOption {
    name: string;
    value: string;
    hex: string;
    images: string[];
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLOR_PRESETS = [
    { name: 'Noir', value: 'noir', hex: '#000000' },
    { name: 'Blanc', value: 'blanc', hex: '#ffffff' },
    { name: 'Gris', value: 'gris', hex: '#8c8c8c' },
    { name: 'Bleu', value: 'bleu', hex: '#0074d9' },
    { name: 'Rouge', value: 'rouge', hex: '#ff4136' },
    { name: 'Vert', value: 'vert', hex: '#2ecc40' },
    { name: 'Rose', value: 'rose', hex: '#ff69b4' },
    { name: 'Marron', value: 'marron', hex: '#8b4513' },
    { name: 'Jaune', value: 'jaune', hex: '#f1c40f' },
    { name: 'Beige', value: 'beige', hex: '#f5f5dc' },
    { name: 'Orange', value: 'orange', hex: '#ffa500' },
];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isColorImagesModalOpen, setIsColorImagesModalOpen] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [form] = Form.useForm();
    const [variantForm] = Form.useForm();
    const [tempSizes, setTempSizes] = useState<string[]>([]);
    const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingColorImages, setUploadingColorImages] = useState<{ [key: string]: boolean }>({});

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
        setUploadedImages([]);
        setColorOptions([]);
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId._id,
            sizes: product.sizes,
        });
        setUploadedImages(product.images || []);
        
        // Handle colors - convert old format to new if needed
        const colors = Array.isArray(product.colors) 
            ? product.colors.map((c: any) => {
                // Already in new format
                if (typeof c === 'object' && c.value && c.images) {
                    return {
                        name: c.name || c.value,
                        value: c.value.toLowerCase().trim(),
                        hex: c.hex || '#000000',
                        images: Array.isArray(c.images) ? c.images : []
                    };
                }
                // Old format (string)
                if (typeof c === 'string') {
                    const lower = c.toLowerCase().trim();
                    const preset = COLOR_PRESETS.find(p => p.value === lower);
                    return {
                        name: c,
                        value: lower,
                        hex: preset?.hex || '#000000',
                        images: []
                    };
                }
                // Fallback
                return {
                    name: 'Unknown',
                    value: 'unknown',
                    hex: '#000000',
                    images: []
                };
              })
            : [];
        setColorOptions(colors);
        
        // Set the colors field in the form
        form.setFieldValue('colors', colors.map((c: any) => c.value));
        
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

    const handleImageUpload = async (file: File) => {
        try {
            setUploadingImages(true);
            const url = await adminService.uploadImage(file);
            setUploadedImages(prev => [...prev, url]);
            message.success('Image uploaded successfully');
        } catch (error) {
            message.error('Failed to upload image');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleColorImageUpload = async (file: File, colorValue: string) => {
        try {
            setUploadingColorImages(prev => ({ ...prev, [colorValue]: true }));
            const url = await adminService.uploadImage(file);
            setColorOptions(prev => 
                prev.map(color => 
                    color.value === colorValue 
                        ? { 
                            ...color, 
                            images: [...(Array.isArray(color.images) ? color.images : []), url] 
                          }
                        : color
                )
            );
            message.success(`Image uploaded for ${colorValue}`);
        } catch (error) {
            message.error('Failed to upload image');
        } finally {
            setUploadingColorImages(prev => ({ ...prev, [colorValue]: false }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveColorImage = (colorValue: string, imageIndex: number) => {
        setColorOptions(prev => 
            prev.map(color => 
                color.value === colorValue 
                    ? { 
                        ...color, 
                        images: (Array.isArray(color.images) ? color.images : []).filter((_, i) => i !== imageIndex) 
                      }
                    : color
            )
        );
    };

    const handleBasicInfoSubmit = (values: any) => {
        if (uploadedImages.length === 0) {
            message.error('Please upload at least one default image');
            return;
        }
        
        const selectedColors = values.colors || [];
        const newColorOptions = selectedColors.map((colorValue: string) => {
            const existing = colorOptions.find(c => c.value === colorValue);
            if (existing) return existing;
            
            const preset = COLOR_PRESETS.find(c => c.value === colorValue);
            return preset || { name: colorValue, value: colorValue, hex: '#000000', images: [] };
        });
        
        setColorOptions(newColorOptions);
        setIsModalOpen(false);
        setIsColorImagesModalOpen(true);
    };

    const handleColorImagesSubmit = () => {
        const sizes = form.getFieldValue('sizes');
        setTempSizes(sizes);

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
            colorOptions.forEach((color) => {
                const key = `${size}-${color.value}`;
                const stock = existingVariantsMap.has(key) ? existingVariantsMap.get(key) : 10;

                newVariants.push({
                    size,
                    color: color.value,
                    stock,
                });
                variantFields[`variant_${index}`] = stock;
                index++;
            });
        });

        setVariants(newVariants);
        variantForm.setFieldsValue(variantFields);

        setIsColorImagesModalOpen(false);
        setIsVariantModalOpen(true);
    };

    const handleFinalSubmit = async () => {
        try {
            await variantForm.validateFields();
            const variantValues = variantForm.getFieldsValue();

            const updatedVariants = variants.map((variant, index) => ({
                ...variant,
                stock: variantValues[`variant_${index}`] || 0,
            }));

            const formValues = form.getFieldsValue();
            const productData = {
                ...formValues,
                images: uploadedImages,
                sizes: tempSizes,
                colors: colorOptions,
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
            setColorOptions([]);
            fetchProducts();
        } catch (error) {
            message.error('Failed to save product');
        }
    };

    const handleCancelVariantModal = () => {
        variantForm.resetFields();
        setIsVariantModalOpen(false);
        setIsColorImagesModalOpen(true);
    };

    const handleCancelColorImagesModal = () => {
        setIsColorImagesModalOpen(false);
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

                {/* Step 1: Basic Info Modal */}
                <Modal
                    title={`${editingProduct ? 'Edit' : 'Add'} Product - Step 1: Basic Info`}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingProduct(null);
                        setVariants([]);
                        setUploadedImages([]);
                        setColorOptions([]);
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
                            label="Price (TND)"
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
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

                        <Form.Item label="Default Images" required>
                            <div style={{ marginBottom: 16 }}>
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleImageUpload(file);
                                        return false;
                                    }}
                                    disabled={uploadingImages}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        loading={uploadingImages}
                                        disabled={uploadingImages}
                                    >
                                        {uploadingImages ? 'Uploading...' : 'Upload Image'}
                                    </Button>
                                </Upload>
                            </div>
                            {uploadedImages.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                                    {uploadedImages.map((url, index) => (
                                        <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #d9d9d9' }}>
                                            <img
                                                src={url}
                                                alt={`Product ${index + 1}`}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => handleRemoveImage(index)}
                                                style={{ position: 'absolute', top: 4, right: 4 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            name="sizes"
                            label="Sizes"
                            rules={[{ required: true, message: 'Please select sizes' }]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select sizes"
                                options={AVAILABLE_SIZES.map(size => ({ label: size, value: size }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="colors"
                            label="Colors"
                            rules={[{ required: true, message: 'Please select colors' }]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select colors"
                                options={COLOR_PRESETS.map(color => ({ label: color.name, value: color.value }))}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="admin-btn">
                                Next: Upload Color Images
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Step 2: Color Images Modal */}
                <Modal
                    title={`${editingProduct ? 'Edit' : 'Add'} Product - Step 2: Color-Specific Images`}
                    open={isColorImagesModalOpen}
                    onCancel={handleCancelColorImagesModal}
                    onOk={handleColorImagesSubmit}
                    okText="Next: Configure Stock"
                    cancelText="Back"
                    className="admin-modal"
                    width={900}
                >
                    <p style={{ marginBottom: 16, color: '#666' }}>
                        Upload specific images for each color variant. If no images are uploaded for a color, default images will be used.
                    </p>
                    <div style={{ display: 'grid', gap: 16 }}>
                        {colorOptions.map((color) => (
                            <Card 
                                key={color.value} 
                                size="small" 
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div 
                                            style={{ 
                                                width: 24, 
                                                height: 24, 
                                                borderRadius: 4, 
                                                background: color.hex,
                                                border: '1px solid #d9d9d9'
                                            }} 
                                        />
                                        <span>{color.name}</span>
                                    </div>
                                }
                            >
                                <div style={{ marginBottom: 12 }}>
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleColorImageUpload(file, color.value);
                                            return false;
                                        }}
                                        disabled={uploadingColorImages[color.value]}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            size="small"
                                            loading={uploadingColorImages[color.value]}
                                            disabled={uploadingColorImages[color.value]}
                                        >
                                            {uploadingColorImages[color.value] ? 'Uploading...' : `Upload for ${color.name}`}
                                        </Button>
                                    </Upload>
                                </div>
                                {Array.isArray(color.images) && color.images.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                                        {color.images.map((url, index) => (
                                            <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid #d9d9d9' }}>
                                                <img
                                                    src={url}
                                                    alt={`${color.name} ${index + 1}`}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <Button
                                                    type="primary"
                                                    danger
                                                    size="small"
                                                    icon={<CloseCircleOutlined />}
                                                    onClick={() => handleRemoveColorImage(color.value, index)}
                                                    style={{ position: 'absolute', top: 2, right: 2, padding: '2px 4px', fontSize: 12 }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: 20, textAlign: 'center', color: '#999', background: '#f5f5f5', borderRadius: 4 }}>
                                        No images uploaded (will use default images)
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </Modal>

                {/* Step 3: Variant Stock Modal */}
                <Modal
                    title={`${editingProduct ? 'Edit' : 'Add'} Product - Step 3: Configure Stock`}
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