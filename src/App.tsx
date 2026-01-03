import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Category from './pages/Category';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { useAppDispatch } from './store/redux';
import { useEffect } from 'react';
import { loadUserProfile } from './store/authSlice';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAdvertisements from './pages/admin/AdminAdvertisements';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import UnsubscribeResult from './pages/UnsubscribePage';
import NewsPage from './pages/News';

import { Toaster } from './components/ui/toaster';

const { Content } = Layout;

function App() {

  function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
      if (token) {
        dispatch(loadUserProfile());
      }
    }, [token, dispatch]);

    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  function AppLayout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
      <Layout style={{ minHeight: '100vh', background: isAdminRoute ? '#f0f2f5' : '#F7F7F8' }}>
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unsubscribe-result" element={<UnsubscribeResult />} />
            <Route path="/news" element={<NewsPage />} />
            {/* Routes protégées */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/account" element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/reviews" element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            } />
            <Route path="/admin/advertisements" element={
              <AdminRoute>
                <AdminAdvertisements />
              </AdminRoute>
            } />
            <Route path="/admin/newsletter" element={
              <AdminRoute>
                <AdminNewsletter />
              </AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
        {!isAdminRoute && <Footer />}
      </Layout>
    );
  }

  return (
    <AppInitializer>
      <AppLayout />
    </AppInitializer>
  );
}

export default App;