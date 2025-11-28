import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/redux';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
