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
    ChevronRight
} from 'lucide-react';

export default function AdminUsers() {
    const [activeTab, setActiveTab] = useState('all');
    const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. DỮ LIỆU MẪU: 4 chỉ số thống kê trên cùng
    const metrics = [
        {
            title: 'Xưởng sản xuất đang hoạt động',
            value: '268 Xưởng',
            subColor: 'text-[#f0592a] font-bold',
            icon: Shirt,
            iconColor: 'text-[#f0592a]',
        },
        {
            title: 'Hồ sơ xưởng chờ duyệt',
            value: '12 Đang chờ',
            icon: ShieldCheck,
            iconColor: 'text-[#f0592a]',
        },
        {
            title: 'Chỉ số tín nhiệm chung',
            value: '96.4%',
            subColor: 'text-zinc-500',
            icon: Activity,
            iconColor: 'text-[#f0592a]',
        },
        {
            title: 'Khách hàng thân thiết',
            value: '960 Đã đăng ký',
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
            org: 'Thorne Screen & Loom Co.',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            email: 'elias@thorneloom.studio',
            role: 'Producer',
            trustScore: 98,
            orders: '142 lô sản xuất',
            ordersSub: '4.280 sản phẩm',
            joined: '14/10/2023',
            status: 'Active',
            verified: true,
        },
        {
            id: 2,
            name: 'Sienna Krause',
            org: 'Thành viên Bạc · Silver Patron',
            avatarInitial: 'SK',
            email: 'sienna.k@archway.io',
            role: 'Customer',
            trustScore: 92,
            orders: '24 đơn hàng',
            ordersSub: '46.000.000 ₫ tích lũy',
            joined: '05/01/2024',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Mira Vance',
            org: 'Studio Botanical Dye',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
            email: 'mira@botanicaldye.co',
            role: 'Producer',
            trustScore: 65,
            orders: '0 lô sản xuất',
            ordersSub: 'Xét duyệt giai đoạn 3',
            joined: '18/03/2024',
            status: 'Pending verification',
            pendingIcon: true,
        },
        {
            id: 4,
            name: 'Julian Lowe',
            org: 'Có lịch sử tranh chấp giao dịch',
            avatarInitial: 'JL',
            email: 'j.lowe@outerloop.net',
            role: 'Customer',
            trustScore: 45,
            orders: '3 đơn hàng',
            ordersSub: '2 khiếu nại đang mở',
            joined: '22/11/2023',
            status: 'Suspended',
        },
        {
            id: 5,
            name: 'Devon Castillo',
            org: 'Trưởng ban An toàn & Vận hành',
            tag: 'VẬN HÀNH',
            email: 'devon@atelier.style',
            role: 'Admin',
            trustScore: 100,
            orders: '—',
            ordersSub: 'Nhân sự nội bộ',
            joined: '10/08/2023',
            status: 'Active',
            isAdminIcon: true,
        },
        {
            id: 6,
            name: 'Kenzo Mori',
            org: 'Mori Raw Cotton Works',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            email: 'k.mori@moricotton.jp',
            role: 'Producer',
            trustScore: 99,
            orders: '89 lô sản xuất',
            ordersSub: '3.110 sản phẩm',
            joined: '01/12/2023',
            status: 'Active',
            verified: true,
        },
        {
            id: 7,
            name: 'Aria Lindqvist',
            org: 'Khách mua tiêu chuẩn',
            avatarInitial: 'AL',
            email: 'aria.l@stockholmart.se',
            role: 'Customer',
            trustScore: 91,
            orders: '8 đơn hàng',
            ordersSub: '13.500.000 ₫ tích lũy',
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
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                        <span>Quản trị tài khoản</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Người dùng</h1>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="h-11 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4 text-zinc-500" />
                        <span>Xuất tệp</span>
                    </button>
                    <button
                        type="button"
                        className="h-11 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Thêm người dùng</span>
                    </button>
                </div>
            </div>

            {/* 2. Dải 4 Card chỉ số (Metric Strip) */}
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
                {/* Tab chuyển danh mục */}
                <div className="px-6 pt-3 flex items-center justify-between gap-4 overflow-x-auto bg-[#faf8e4]/60 border-b border-zinc-200/60">
                    <div className="flex items-center gap-2 shrink-0">
                        {[
                            { id: 'all', label: 'Tất cả người dùng', count: '1.240' },
                            { id: 'customers', label: 'Khách hàng', count: '960' },
                            { id: 'producers', label: 'Xưởng sản xuất', count: '268' },
                            { id: 'pending', label: 'Chờ xác minh xưởng', count: '12' },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    type="button"
                                    className={`relative pb-3 px-3 flex items-center gap-2 text-xs font-semibold transition-colors ${
                                        isActive ? 'text-[#f0592a]' : 'text-zinc-500 hover:text-zinc-900'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                                            isActive ? 'bg-[#fefccf] text-[#f0592a] font-bold border border-[#f0592a]/20' : 'bg-zinc-100 text-zinc-600'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0592a] rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

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

                        <button
                            type="button"
                            title="Bộ lọc tùy chỉnh"
                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
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
                            <th className="py-3 px-4">Điểm tín nhiệm</th>
                            <th className="py-3 px-4">Đơn hàng / Lô may</th>
                            <th className="py-3 px-4">Ngày tham gia</th>
                            <th className="py-3 px-4">Trạng thái</th>
                            <th className="py-3 px-6 text-right"><span className="sr-only">Thao tác</span></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {users.map((u) => {
                            const isTrustCritical = u.trustScore < 50;
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
                                                    {u.verified && (
                                                        <CheckCircle2 className="w-4 h-4 text-[#f0592a]" />
                                                    )}
                                                    {u.pendingIcon && (
                                                        <Hourglass className="w-3.5 h-3.5 text-zinc-400" />
                                                    )}
                                                    {u.tag && (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-[#f0592a] text-white">
                                                                {u.tag}
                                                            </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-zinc-400 truncate">{u.org}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="py-4 px-4 text-zinc-500 font-medium">{u.email}</td>

                                    {/* Vai trò */}
                                    <td className="py-4 px-4">{renderRoleBadge(u.role)}</td>

                                    {/* Điểm tín nhiệm */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                                        isTrustCritical ? 'bg-red-500' : 'bg-[#f0592a]'
                                                    }`}
                                                />
                                            <span className={`font-semibold ${isTrustCritical ? 'text-red-500' : 'text-zinc-900'}`}>
                                                    {u.trustScore}/100
                                                </span>
                                        </div>
                                    </td>

                                    {/* Đơn hàng / Lô may */}
                                    <td className="py-4 px-4 text-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{u.orders}</span>
                                            <span className={`text-[11px] ${u.ordersSub.includes('khiếu nại') ? 'text-red-500 font-medium' : 'text-zinc-400'}`}>
                                                    {u.ordersSub}
                                                </span>
                                        </div>
                                    </td>

                                    {/* Ngày tham gia */}
                                    <td className="py-4 px-4 text-zinc-400 text-[11px]">{u.joined}</td>

                                    {/* Trạng thái */}
                                    <td className="py-4 px-4">{renderStatusBadge(u.status)}</td>

                                    {/* Hành động */}
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            type="button"
                                            title="Tùy chọn khác"
                                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
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
                            <span className="hidden sm:inline">Trước</span>
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
                            <span className="hidden sm:inline">Sau</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}