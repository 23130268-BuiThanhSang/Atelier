import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Shirt,
    ReceiptText,
    Users,
    LogOut,
    Search,
    Bell,
    Scissors
} from 'lucide-react';

export default function AdminLayout() {
    const location = useLocation();

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
                        <div className="w-9 h-9 rounded-xl bg-[#f0592a] flex items-center justify-center text-white shadow-sm shrink-0">
                            <Scissors className="w-5 h-5 -rotate-45" />
                        </div>
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
                            <div className="w-8 h-8 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                M
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-zinc-900 truncate">Mai Thất Nghiệp</span>
                                <span className="text-[10px] text-zinc-500 truncate">Quản trị viên</span>
                            </div>
                        </div>
                        <button
                            title="Đăng xuất"
                            className="p-1.5 text-zinc-400 hover:text-[#f0592a] hover:bg-zinc-100 rounded-lg transition-colors"
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
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm đơn hàng, sản phẩm, người dùng..."
                            className="w-full h-10 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-xl text-zinc-500 hover:text-[#f0592a] hover:bg-zinc-50 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f0592a]"></span>
                        </button>
                        <div className="h-5 w-px bg-zinc-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs">
                                M
                            </div>
                            <span className="text-xs font-semibold text-zinc-800 hidden md:inline">Mai Thất Nghiệp</span>
                        </div>
                    </div>
                </header>

                {/* Vùng nội dung cuộn bên dưới Top Header */}
                <main className="pt-16 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}