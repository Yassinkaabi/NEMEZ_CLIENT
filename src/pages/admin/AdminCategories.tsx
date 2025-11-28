import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllCategories();
            setCategories(response.data.categories);
        } catch (error) {
            message.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        form.setFieldsValue(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteCategory(id);
            message.success('Category deleted successfully');
            fetchCategories();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory._id, values);
                message.success('Category updated successfully');
            } else {
                await adminService.createCategory(values);
                message.success('Category created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingCategory(null);
            fetchCategories();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to save category');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'categoryId',
            key: 'categoryId',
            width: 80,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                <img src={image} alt="Category" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Products',
            dataIndex: 'productCount',
            key: 'productCount',
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
                        title="Are you sure you want to delete this category?"
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
                    <h2 className="admin-table-title">Category Management</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        className="admin-btn"
                    >
                        Add Category
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    rowKey="_id"
                    pagination={false}
                />

                <Modal
                    title={editingCategory ? 'Edit Category' : 'Add Category'}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingCategory(null);
                    }}
                    footer={null}
                    className="admin-modal"
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="name"
                            label="Category Name"
                            rules={[{ required: true, message: 'Please enter category name' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Image URL"
                            rules={[{ required: true, message: 'Please enter image URL' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="admin-btn">
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
