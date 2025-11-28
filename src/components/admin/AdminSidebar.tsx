import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    NotificationOutlined,
    MailOutlined,
} from '@ant-design/icons';
import '../../styles/admin.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Users',
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/admin/categories',
            icon: <AppstoreOutlined />,
            label: 'Categories',
        },
        {
            key: '/admin/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
        },
        {
            key: '/admin/reviews',
            icon: <StarOutlined />,
            label: 'Reviews',
        },
        {
            key: '/admin/advertisements',
            icon: <NotificationOutlined />,
            label: 'Publicités',
        },
        {
            key: '/admin/newsletter',
            icon: <MailOutlined />,
            label: 'Newsletter',
        },
    ];

    const handleMenuClick = (e: any) => {
        navigate(e.key);
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <h2>Admin Panel</h2>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="admin-menu"
            />
        </div>
    );
};

export default AdminSidebar;
