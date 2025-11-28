import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import { useAppSelector, useAppDispatch } from '../../store/redux';
import { logout } from '../../store/authSlice';
import '../../styles/admin.css';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Layout className="admin-layout">
            <Sider width={250} className="admin-sider">
                <AdminSidebar />
            </Sider>
            <Layout>
                <Header className="admin-header">
                    <div className="admin-header-left">
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
