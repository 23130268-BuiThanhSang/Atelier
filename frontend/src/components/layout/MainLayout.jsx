import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {
    return (
        <div className="min-h-screen">
            <nav className="flex gap-4 border-b p-4">
                <Link to="/">Trang chủ</Link>
                <Link to="/catalog">Sản phẩm</Link>
                <Link to="/design-studio">Thiết kế</Link>
                <Link to="/cart">Giỏ hàng</Link>
                <Link to="/login">Đăng nhập</Link>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}