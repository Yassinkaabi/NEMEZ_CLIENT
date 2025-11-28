import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/redux';

const PrivateRoute = ({ children }: { children: any }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;