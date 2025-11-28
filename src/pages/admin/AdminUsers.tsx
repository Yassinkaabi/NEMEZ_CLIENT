import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, message, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import '../../styles/admin.css';

const { Search } = Input;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers({
                page: pagination.page,
                limit: pagination.limit,
                search,
            });
            setUsers(response.data.users);
            setPagination({ ...pagination, total: response.data.pagination.total });
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPagination({ ...pagination, page: 1 });
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        form.setFieldsValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteUser(id);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingUser) {
                await adminService.updateUser(editingUser._id, values);
                message.success('User updated successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            message.error('Failed to save user');
        }
    };

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 100,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'purple' : 'blue'} className="status-badge">
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
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
                        title="Are you sure you want to delete this user?"
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
                    <h2 className="admin-table-title">User Management</h2>
                    <div className="admin-table-actions">
                        <Search
                            placeholder="Search users..."
                            onSearch={handleSearch}
                            className="admin-search"
                            prefix={<SearchOutlined />}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        onChange: (page) => setPagination({ ...pagination, page }),
                    }}
                />

                <Modal
                    title={editingUser ? 'Edit User' : 'Add User'}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingUser(null);
                    }}
                    footer={null}
                    className="admin-modal"
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter name' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter valid email' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>

                        <Form.Item name="address" label="Address">
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select role' }]}
                        >
                            <Select>
                                <Select.Option value="user">User</Select.Option>
                                <Select.Option value="admin">Admin</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="admin-btn">
                                {editingUser ? 'Update User' : 'Add User'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
