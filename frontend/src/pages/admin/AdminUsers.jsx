import React, { useState } from 'react';
import {
    Download,
    UserPlus,
    Shirt,
    ShieldCheck,
    Activity,
    Users,
    Search,
    ChevronDown,
    SlidersHorizontal,
    MoreVertical,
    CheckCircle2,
    Hourglass,
    ShieldAlert,
    ChevronLeft,
    ChevronRight, Ban
} from 'lucide-react';

export default function AdminUsers() {
    const [activeTab, setActiveTab] = useState('all');
    const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. DỮ LIỆU MẪU: 4 chỉ số thống kê trên cùng
    const metrics = [
        {
            title: 'Xưởng sản xuất',
            value: '268',
            subColor: 'text-[#f0592a] font-bold',
            icon: Shirt,
            iconColor: 'text-[#f0592a]',
        },
        {
            title: 'Khách hàng',
            value: '960',
            subColor: 'text-[#f0592a]',
            icon: Users,
            iconColor: 'text-zinc-400',
        },
    ];

    // 2. DỮ LIỆU MẪU: Danh sách người dùng
    const users = [
        {
            id: 1,
            name: 'Elias Thorne',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            email: 'elias@thorneloom.studio',
            role: 'Producer',
            orders: '142 lô sản xuất',
            joined: '14/10/2023',
            status: 'Active',
            verified: true,
        },
        {
            id: 2,
            name: 'Sienna Krause',
            avatarInitial: 'SK',
            email: 'sienna.k@archway.io',
            role: 'Customer',
            orders: '24 đơn hàng',
            joined: '05/01/2024',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Mira Vance',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
            email: 'mira@botanicaldye.co',
            role: 'Producer',
            orders: '0 lô sản xuất',
            joined: '18/03/2024',
            status: 'Pending verification',
            pendingIcon: true,
        },
        {
            id: 4,
            name: 'Julian Lowe',
            avatarInitial: 'JL',
            email: 'j.lowe@outerloop.net',
            role: 'Customer',
            orders: '3 đơn hàng',
            joined: '22/11/2023',
            status: 'Suspended',
        },
        {
            id: 5,
            name: 'Devon Castillo',
            tag: 'VẬN HÀNH',
            email: 'devon@atelier.style',
            role: 'Admin',
            orders: '—',
            joined: '10/08/2023',
            status: 'Active',
            isAdminIcon: true,
        },
        {
            id: 6,
            name: 'Kenzo Mori',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            email: 'k.mori@moricotton.jp',
            role: 'Producer',
            orders: '89 lô sản xuất',
            joined: '01/12/2023',
            status: 'Active',
            verified: true,
        },
        {
            id: 7,
            name: 'Aria Lindqvist',
            avatarInitial: 'AL',
            email: 'aria.l@stockholmart.se',
            role: 'Customer',
            orders: '8 đơn hàng',
            joined: '14/02/2024',
            status: 'Active',
        },
    ];

    // Hàm render badge vai trò
    const renderRoleBadge = (role) => {
        switch (role) {
            case 'Producer':
                return (
                    <span className="px-2.5 py-1 rounded-full bg-[#fefccf] text-[#f0592a] text-[11px] font-semibold border border-[#f0592a]/20">
                        Xưởng sản xuất
                    </span>
                );
            case 'Admin':
                return (
                    <span className="px-2.5 py-1 rounded-full bg-[#f0592a] text-white text-[11px] font-bold">
                        Quản trị viên
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                        Khách hàng
                    </span>
                );
        }
    };

    // Hàm render trạng thái tài khoản
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="px-2.5 py-1 rounded-full bg-[#fefccf] text-[#f0592a] text-[11px] font-semibold border border-[#f0592a]/20">
                        Hoạt động
                    </span>
                );
            case 'Pending verification':
                return (
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                        Chờ xác minh
                    </span>
                );
            case 'Suspended':
                return (
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-medium border border-red-200">
                        Đình chỉ
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Tiêu đề trang & Nút hành động */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span>Quản trị tài khoản</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Người dùng</h1>
                </div>
            </div>

            {/* 2. Dải 2 Card chỉ số (Metric Strip) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                                    {metric.title}
                                </span>
                                <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <span className="text-xl font-bold text-zinc-950 tracking-tight">
                                    {metric.value}
                                </span>
                                {metric.sub && (
                                    <span className={`text-xs ${metric.subColor}`}>{metric.sub}</span>
                                )}
                                {metric.badge && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-semibold">
                                        {metric.badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Khung bảng dữ liệu chính (Table Container) */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden">
                {/* Thanh tìm kiếm & Bộ lọc */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Tìm kiếm theo tên, email, mã định danh..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Lọc theo Role */}
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option>Tất cả vai trò</option>
                                <option>Khách hàng</option>
                                <option>Xưởng sản xuất</option>
                                <option>Quản trị viên</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>

                        {/* Lọc theo Status */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option>Tất cả trạng thái</option>
                                <option>Hoạt động</option>
                                <option>Đình chỉ</option>
                                <option>Chờ xác minh</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Bảng danh sách User */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px] border-collapse">
                        <thead>
                        <tr className="bg-[#faf8e4]/40 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-y border-zinc-100">
                            <th className="py-3 px-6">Ảnh đại diện & Họ tên</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Vai trò</th>
                            <th className="py-3 px-4">Đơn hàng / Lô may</th>
                            <th className="py-3 px-4">Ngày tham gia</th>
                            <th className="py-3 px-4">Trạng thái</th>
                            <th className="py-3 px-4">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {users.map((u) => {
                            return (
                                <tr key={u.id} className="hover:bg-zinc-50/70 transition-colors">
                                    {/* Cột Tên & Avatar */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {u.avatar ? (
                                                <img
                                                    src={u.avatar}
                                                    alt={u.name}
                                                    className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs border border-zinc-200"
                                                />
                                            ) : u.isAdminIcon ? (
                                                <div className="w-10 h-10 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                    <ShieldAlert className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#f0592a]/20">
                                                    {u.avatarInitial}
                                                </div>
                                            )}

                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-zinc-900 truncate">{u.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="py-4 px-4 text-zinc-500 font-medium">{u.email}</td>

                                    {/* Vai trò */}
                                    <td className="py-4 px-4">{renderRoleBadge(u.role)}</td>

                                    {/* Đơn hàng / Lô may */}
                                    <td className="py-4 px-4 text-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{u.orders}</span>
                                        </div>
                                    </td>

                                    {/* Ngày tham gia */}
                                    <td className="py-4 px-4 text-zinc-400 text-[11px]">{u.joined}</td>

                                    {/* Trạng thái */}
                                    <td className="py-4 px-4">{renderStatusBadge(u.status)}</td>

                                    {/* Hành động */}
                                    <td className="py-4 px-6">
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang (Pagination) */}
                <div className="p-4 md:p-6 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <span>
                            Hiển thị <strong className="text-zinc-900">1 đến 7</strong> trong <strong className="text-zinc-900">1.240</strong> kết quả
                        </span>
                    </div>

                    <nav className="flex items-center gap-1.5 font-semibold">
                        <button
                            disabled
                            className="h-9 px-3 rounded-lg bg-zinc-100 text-zinc-400 opacity-50 cursor-not-allowed flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-lg bg-[#f0592a] text-white flex items-center justify-center shadow-xs">
                            1
                        </button>
                        <button className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors">
                            2
                        </button>
                        <button className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors">
                            3
                        </button>
                        <span className="px-1 text-zinc-400 font-normal">…</span>
                        <button className="h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center gap-1 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}