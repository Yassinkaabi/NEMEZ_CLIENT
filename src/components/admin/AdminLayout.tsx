import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, HomeOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import { useAppSelector, useAppDispatch } from '../../store/redux';
import { logout } from '../../store/authSlice';
import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <Layout className="admin-layout">
            <div
                className={`admin-sidebar-backdrop ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <Sider
                width={250}
                className={`admin-sider ${isMobileMenuOpen ? 'open' : ''}`}
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
            >
                <AdminSidebar />
            </Sider>
            <Layout>
                <Header className="admin-header">
                    <div className="admin-header-left">
                        <button className="admin-burger-btn" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        </button>
                        <h1>Admin Dashboard</h1>
                    </div>
                    <div className="admin-header-right">
                        <span className="admin-user-name">Welcome, {user?.name}</span>
                        <button className="admin-btn-icon" onClick={handleGoHome} title="Go to Home">
                            <HomeOutlined />
                        </button>
                        <button className="admin-btn-icon" onClick={handleLogout} title="Logout">
                            <LogoutOutlined />
                        </button>
                    </div>
                </Header>
                <Content className="admin-content">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
