import { Outlet, Link } from 'react-router-dom';
import { Globe, User } from 'lucide-react';
import React from "react";
import logo from '../../assets/logo.png';

export default function AuthLayout() {
    return (
        <div className="min-h-[100dvh] bg-[#fefccf] flex flex-col font-sans text-zinc-950">

            {/* Header */}
            <header className="flex justify-between items-center p-6 md:px-12 w-full">
                <Link to="/" className="group flex shrink-0 items-center gap-3 cursor-pointer" aria-label="Trang chủ Atelier">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fefccf] to-[#f0592a] shadow-[0_4px_12px_rgba(240,89,42,0.15)] ring-1 ring-[#f0592a]/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <img
                            src={logo}
                            alt="Atelier Logo Icon"
                            className="h-7 w-7 object-contain"
                        />
                    </div>
                    <span className="hidden sm:block">
                            <span className="block text-xl font-black tracking-tight text-zinc-950">Atelier</span>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Sàn giao dịch quần áo may đo theo yêu cầu
                            </span>
                        </span>
                </Link>
                <nav className="hidden md:flex gap-6 text-sm font-medium items-center text-zinc-500">
                    <a href="/" className="hover:text-zinc-900 transition-colors">Trở lại cửa hàng</a>
                    <a href="/help_support" className="hover:text-zinc-900 transition-colors">Trợ giúp & Hỗ trợ</a>
                </nav>
            </header>

            {/*Form (Login/Register/...) */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 pb-12">
                <Outlet />
            </main>

            {/* Footer */}
            <footer
                className="p-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-400">
                <div>© 2026 Atelier Studio & Apparel Co. Artisan marketplace. All rights reserved.</div>
                <div className="flex gap-6">
                    <a href="/privacy_policy" className="hover:text-zinc-700 transition-colors">Chính sách bảo mật</a>
                    <a href="/term_service" className="hover:text-zinc-700 transition-colors">Điều khoản dịch vụ</a>
                    <a href="/security_complience" className="hover:text-zinc-700 transition-colors">Bảo mật & Tuân thủ</a>
                </div>
            </footer>
        </div>
    );
}