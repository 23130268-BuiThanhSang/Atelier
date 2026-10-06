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
import EmailVerification from "../pages/Login/EmailVerification";

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
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify_email" element={<EmailVerification />} />
            </Route>
        </Routes>
    )
}