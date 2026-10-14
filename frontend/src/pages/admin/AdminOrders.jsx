import React, { useState } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Factory,
    Truck,
    Scale,
    Shirt,
    Wrench,
    RotateCw,
    Search,
    Calendar,
    RotateCcw,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    Clock,
    Ban
} from 'lucide-react';

export default function AdminOrders() {
    const [activeTab, setActiveTab] = useState('ready-made'); // 'ready-made' | 'batches'
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [paymentFilter, setPaymentFilter] = useState('Tất cả thanh toán');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. DỮ LIỆU MẪU: 4 Thẻ KPI phía trên
    const kpis = [
        {
            title: 'Tổng đơn hàng',
            value: '3.420',
            barColor: 'bg-[#f0592a]',
            icon: ShoppingBag,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Đang sản xuất',
            value: '48',
            sub: 'lô hàng',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            barColor: 'bg-emerald-600',
            icon: Factory,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Chờ giao hàng',
            value: '124',
            badgeColor: 'text-zinc-400 font-medium',
            barColor: 'bg-amber-600',
            icon: Truck,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Tranh chấp',
            value: '3',
            isPing: true,
            badgeColor: 'bg-red-50 text-red-600 font-bold',
            barColor: 'bg-red-600',
            icon: Scale,
            iconColor: 'text-amber-800',
            bgIcon: 'bg-amber-50',
            isDisputedCard: true,
        },
    ];

    // 2. DỮ LIỆU MẪU: Danh sách đơn hàng
    const orders = [
        {
            id: '#ORD-9842',
            customer: 'Sophia Loren',
            isVip: true,
            productName: 'Áo thun Vintage Washed Oversized Heavy Tee',
            itemsCount: '2 sản phẩm',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
            total: '760.000 ₫',
            paymentType: 'paid',
            status: 'Delivered',
            date: '28/10/2026',
        },
        {
            id: '#ORD-9840',
            customer: 'Alex Turner',
            productName: 'Lô áo in đồ họa thủ công tùy chỉnh',
            isProducerRun: true,
            itemsCount: 'Đơn hàng thương mại',
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=120&auto=format&fit=crop&q=80',
            total: '48.500.000 ₫',
            paymentType: 'deposit',
            status: 'In Production',
            date: '26/10/2026',
        },
        {
            id: '#ORD-9838',
            customer: 'Julian Lowe',
            isFlagged: true,
            productName: 'Áo nỉ cổ tròn Heavyweight Acid Wash',
            itemsCount: '1 sản phẩm',
            image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=120&auto=format&fit=crop&q=80',
            total: '1.260.000 ₫',
            paymentType: 'disputed',
            status: 'Disputed',
            date: '25/10/2026',
            isActionRow: true,
        },
        {
            id: '#ORD-9835',
            customer: 'Sienna Krause',
            productName: 'Áo thun thêu logo Atelier tối giản',
            itemsCount: '1 sản phẩm',
            image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
            total: '420.000 ₫',
            paymentType: 'paid',
            status: 'Shipped',
            trackingCode: '#USP-8921',
            date: '24/10/2026',
        },
        {
            id: '#ORD-9831',
            customer: 'Thorne & Loom Co.',
            productName: 'Lô áo nỉ chui đầu chàm tự nhiên',
            isProducerRun: true,
            itemsCount: 'Hợp đồng bán sỉ',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=80',
            total: '112.000.000 ₫',
            paymentType: 'deposit',
            status: 'Confirmed',
            date: '22/10/2026',
        },
        {
            id: '#ORD-9828',
            customer: 'Marcus Kim',
            productName: 'Áo thun nhuộm thảo mộc (Bản giới hạn)',
            itemsCount: '1 sản phẩm',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&auto=format&fit=crop&q=80',
            total: '540.000 ₫',
            paymentType: 'pending',
            status: 'Pending',
            date: '21/10/2026',
        },
        {
            id: '#ORD-9822',
            customer: 'Clara Vance',
            productName: 'Áo hoodie French Terry Heavyweight Pullover',
            itemsCount: 'Đã hoàn tiền',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
            total: '840.000 ₫',
            paymentType: 'refunded',
            status: 'Cancelled',
            date: '19/10/2026',
            isCancelled: true,
        },
    ];

    // Badge trạng thái thanh toán
    const renderPaymentBadge = (order) => {
        switch (order.paymentType) {
            case 'paid':
            case 'deposit':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                        {order.payment}
                    </span>
                );
            case 'disputed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {order.payment}
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                        {order.payment}
                    </span>
                );
            case 'refunded':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        {order.payment}
                    </span>
                );
            default:
                return null;
        }
    };

    // Badge trạng thái đơn hàng
    const renderStatusBadge = (order) => {
        switch (order.status) {
            case 'Delivered':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Đã giao hàng
                    </span>
                );
            case 'In Production':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        Đang sản xuất
                    </span>
                );
            case 'Disputed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
                        Tranh chấp (Xem xét)
                    </span>
                );
            case 'Shipped':
                return (
                    <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold w-max">
                            <Truck className="w-3 h-3 text-zinc-500" />
                            Đang vận chuyển
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">{order.trackingCode}</span>
                    </div>
                );
            case 'Confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                        Đã xác nhận
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ xử lý
                    </span>
                );
            case 'Cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-bold">
                        <Ban className="w-3.5 h-3.5" />
                        Đã hủy
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Tiêu đề trang & Các nút thao tác */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span className="text-[#f0592a] font-bold">Vận hành</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Đơn hàng</h1>
                    </div>
                </div>
            </div>

            {/* 2. Dải 4 Card KPI có thanh tiến độ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-5 rounded-2xl bg-white shadow-xs border flex flex-col justify-between transition-shadow hover:shadow-md ${
                                kpi.isDisputedCard ? 'border-amber-200/80 bg-[#fffdfa]' : 'border-zinc-200/70'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                                        kpi.isDisputedCard ? 'text-amber-800' : 'text-zinc-400'
                                    }`}
                                >
                                    {kpi.title}
                                </span>
                                <div className={`w-9 h-9 rounded-xl ${kpi.bgIcon} flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                                </div>
                            </div>

                            <div className="mt-4 flex items-baseline justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold tracking-tight text-zinc-950">{kpi.value}</span>
                                    {kpi.sub && <span className="text-xs text-zinc-500">{kpi.sub}</span>}
                                </div>

                                {kpi.growth && (
                                    <span className="text-xs font-bold text-[#f0592a] flex items-center">
                                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                                        {kpi.growth}
                                    </span>
                                )}
                                {kpi.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${kpi.badgeColor}`}>
                                        {kpi.badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Khung bảng dữ liệu chính */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                {/* Toolbar Tìm kiếm & Lọc */}
                <div className="p-4 md:p-6 bg-white flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
                    <div className="relative flex-1 min-w-[280px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="search"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Tìm kiếm theo mã đơn (#ORD-), tên khách hàng, email..."
                            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Lọc trạng thái đơn */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option>Tất cả trạng thái</option>
                                <option>Chờ xử lý</option>
                                <option>Đã xác nhận</option>
                                <option>Đang sản xuất</option>
                                <option>Đang vận chuyển</option>
                                <option>Đã giao hàng</option>
                                <option>Đã hủy</option>
                                <option>Tranh chấp</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>

                        {/* Chọn khoảng thời gian */}
                        <button
                            type="button"
                            className="h-11 px-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 flex items-center gap-2 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            <span>01/10 – 31/10/2026</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                    </div>
                </div>

                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[1020px]">
                        <thead>
                        <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-y border-zinc-100">
                            <th className="py-3.5 pl-6 pr-3">Mã đơn</th>
                            <th className="py-3.5 px-4">Khách hàng</th>
                            <th className="py-3.5 px-4">Sản phẩm</th>
                            <th className="py-3.5 px-4 text-right">Tổng tiền</th>
                            <th className="py-3.5 px-4">Trạng thái đơn</th>
                            <th className="py-3.5 px-4">Ngày tạo</th>
                            <th className="py-3.5 pr-6 pl-3 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {orders.map((ord, idx) => (
                            <tr
                                key={idx}
                                className={`transition-colors ${
                                    ord.isActionRow
                                        ? 'bg-red-50/40 hover:bg-red-50/70'
                                        : ord.isCancelled
                                            ? 'opacity-70 hover:bg-zinc-50'
                                            : 'hover:bg-zinc-50/80'
                                }`}
                            >
                                {/* Mã đơn */}
                                <td className="py-4 pl-6 pr-3 font-bold text-[#f0592a] whitespace-nowrap">
                                    {ord.id}
                                </td>

                                {/* Khách hàng */}
                                <td className="py-4 px-4 min-w-[190px]">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-zinc-900">{ord.customer}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Sản phẩm & Thông số */}
                                <td className="py-4 px-4 min-w-[280px]">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={ord.image}
                                            alt={ord.productName}
                                            className={`w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-200/80 ${
                                                ord.isCancelled ? 'grayscale' : ''
                                            }`}
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-zinc-900 truncate">{ord.productName}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Tổng tiền */}
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                    <div className="flex flex-col items-end">
                                            <span className={`font-bold ${ord.isCancelled ? 'line-through text-zinc-400' : 'text-zinc-950'}`}>
                                                {ord.total}
                                            </span>
                                    </div>
                                </td>

                                {/* Trạng thái đơn */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                    {renderStatusBadge(ord)}
                                </td>

                                {/* Ngày tạo */}
                                <td className="py-4 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                                    {ord.date}
                                </td>

                                {/* Thao tác */}
                                <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold transition-colors"
                                    >
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Footer phân trang */}
                <div className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-3">
                        <span>
                            Hiển thị <strong className="text-zinc-900">1 đến 7</strong> trong <strong className="text-zinc-900">3.420</strong> đơn hàng
                        </span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold">
                        <button
                            disabled
                            type="button"
                            className="p-2 rounded-lg text-zinc-300 cursor-not-allowed flex items-center justify-center"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#f0592a] text-white flex items-center justify-center shadow-xs"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            3
                        </button>
                        <span className="px-1 text-zinc-400 font-normal">...</span>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            489
                        </button>
                        <button
                            type="button"
                            className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}