import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Home from '../pages/Home/Home'
import Catalog from '../pages/Catalog/Catalog'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import DesignStudio from '../pages/DesignStudio/DesignStudio'
import MyDesigns from '../pages/MyDesigns/MyDesigns'
import Cart from '../pages/Cart/Cart'
import Checkout from '../pages/Checkout/Checkout'
import MyOrders from '../pages/MyOrders/MyOrders'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import AuthLayout from "../components/layout/AuthLayout.jsx";
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';
import ForgotPassword from "../pages/Login/ForgotPassword.jsx";
import EmailVerification from "../pages/Login/EmailVerification";
import MyProfile from "../pages/Login/MyProfile";
import PrivacyPolicy from "../pages/Policy/PrivacyPolicy.jsx";
import TermOfService from "../pages/Policy/TermOfService.jsx";
import SecurityCompliance from "../pages/Policy/SecurityComplience.jsx";
import HelpSupport from "../pages/Policy/Help_Support.jsx";
import ProducerDashboard from '../pages/Producer/ProducerDashboard.jsx';
import OrderResolutionCenter from '../pages/Producer/OrderResolutionCenter';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/design-studio" element={<DesignStudio />} />
                <Route path="/my-designs" element={<MyDesigns />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                <Route path="/term_service" element={<TermOfService />} />
                <Route path="/security_complience" element={<SecurityCompliance />} />
                <Route path="/help_support" element={<HelpSupport />} />
                <Route path="/producer/dashboard" element={<ProducerDashboard />} />
                <Route path="/orders/:id/resolution" element={<OrderResolutionCenter />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/verify_email" element={<EmailVerification />} />
                <Route path="/my_profile" element={<MyProfile />} />
            </Route>

            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/:id" element={<AdminUserDetail />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            </Route>
        </Routes>
    )
}