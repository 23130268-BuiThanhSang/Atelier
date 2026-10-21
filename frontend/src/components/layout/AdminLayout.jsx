import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    Shirt,
    ReceiptText,
    Users,
    LogOut,
    AlertTriangle,
    X
} from 'lucide-react';
import logo from "../../assets/logo.png";

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [adminUser, setAdminUser] = useState({
        name: 'Quản trị viên',
        roleTitle: 'Quản trị viên',
        initialLetter: 'A'
    });

    // Quản lý trạng thái mở modal xác nhận đăng xuất
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // 1. Tải thông tin tài khoản admin từ localStorage khi mở trang
    useEffect(() => {
        let fullName = localStorage.getItem('userName') || '';

        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                fullName = parsed.fullName || parsed.name || parsed.username || fullName;
            }
        } catch (e) {
            console.error('Không thể đọc dữ liệu user từ localStorage:', e);
        }

        const displayName = fullName.trim() || 'Quản trị viên';
        const initial = displayName.charAt(0).toUpperCase();

        setAdminUser({
            name: displayName,
            roleTitle: 'Quản trị viên',
            initialLetter: initial
        });
    }, []);

    // 2. Thực hiện đăng xuất khi người dùng bấm xác nhận trên Modal
    const confirmLogout = () => {
        setIsLogoutModalOpen(false);

        // Dọn sạch toàn bộ token và thông tin session đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('role');

        navigate('/login', { replace: true });
    };

    const navItems = [
        { label: 'Bảng điều khiển', path: '/admin', icon: LayoutGrid },
        { label: 'Sản phẩm', path: '/admin/products', icon: Shirt },
        { label: 'Đơn hàng', path: '/admin/orders', icon: ReceiptText },
        { label: 'Người dùng', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#fefccf] text-zinc-900 font-sans antialiased">
            {/* Sidebar cố định bên trái */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200/70 z-50 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div>
                    {/* Logo Header */}
                    <div className="h-16 px-6 border-b border-zinc-100 flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fefccf] to-[#f0592a] shadow-[0_4px_12px_rgba(240,89,42,0.15)] ring-1 ring-[#f0592a]/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                            <img
                                src={logo}
                                alt="Atelier Logo Icon"
                                className="h-7 w-7 object-contain"
                            />
                        </span>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm tracking-wider uppercase text-zinc-950 truncate">
                                Quản trị viên
                            </span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.path === '/admin'
                                ? location.pathname === '/admin'
                                : location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        isActive
                                            ? 'bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 shadow-xs'
                                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#f0592a]' : 'text-zinc-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Card ở đáy Sidebar */}
                <div className="p-3 border-t border-zinc-100 bg-white">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {adminUser.initialLetter}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-zinc-900 truncate" title={adminUser.name}>
                                    {adminUser.name}
                                </span>
                                <span className="text-[10px] text-zinc-500 truncate">
                                    {adminUser.roleTitle}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            title="Đăng xuất"
                            className="p-1.5 text-zinc-400 hover:text-[#f0592a] hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Cột chính có lề trái 64 (256px) */}
            <div className="pl-64 flex flex-col min-h-screen">
                {/* Top Header cố định */}
                <header className="fixed top-0 left-64 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/70 z-40 px-8 flex items-center justify-between shadow-xs">
                    <div className="relative w-full max-w-md"></div>

                    <div className="flex items-center gap-4">
                        <div className="h-5 w-px bg-zinc-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                {adminUser.initialLetter}
                            </div>
                            <span className="text-xs font-semibold text-zinc-800 hidden md:inline">
                                {adminUser.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Vùng nội dung cuộn bên dưới Top Header */}
                <main className="pt-16 flex-1">
                    <Outlet />
                </main>
            </div>

            {/* MODAL XÁC NHẬN ĐĂNG XUẤT NẰM GIỮA MÀN HÌNH */}
            {isLogoutModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 backdrop-blur-xs p-4 animate-fadeIn"
                    onClick={() => setIsLogoutModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-sm w-full p-6 relative overflow-hidden flex flex-col items-center text-center transform transition-all animate-scaleUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút X đóng góc phải */}
                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon cảnh báo */}
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mb-3.5 shadow-2xs">
                            <AlertTriangle className="w-7 h-7" />
                        </div>

                        {/* Tiêu đề & Nội dung */}
                        <h3 className="text-base font-bold text-zinc-950">
                            Xác nhận đăng xuất?
                        </h3>

                        {/* Cụm nút hành động */}
                        <div className="w-full grid grid-cols-2 gap-2.5 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="w-full py-2.5 px-3 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}