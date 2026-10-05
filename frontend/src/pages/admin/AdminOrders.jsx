import React, { useState } from 'react';
import {
    Download,
    SlidersHorizontal,
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
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [paymentFilter, setPaymentFilter] = useState('All Payments');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. MOCK DATA: 4 Card KPIs phía trên
    const kpis = [
        {
            title: 'Total Orders',
            value: '3,420',
            growth: '+12.4%',
            barColor: 'bg-[#f0592a]',
            barWidth: '78%',
            icon: ShoppingBag,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Active Production',
            value: '48',
            sub: 'batches',
            badge: 'On Schedule',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            barColor: 'bg-emerald-600',
            barWidth: '64%',
            icon: Factory,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Pending Fulfillment',
            value: '124',
            badge: 'Avg 18h turnaround',
            badgeColor: 'text-zinc-400 font-medium',
            barColor: 'bg-amber-600',
            barWidth: '42%',
            icon: Truck,
            iconColor: 'text-zinc-800',
            bgIcon: 'bg-zinc-100',
        },
        {
            title: 'Disputed / Action',
            value: '3',
            isPing: true,
            badge: 'Needs Review',
            badgeColor: 'bg-red-50 text-red-600 font-bold',
            barColor: 'bg-red-600',
            barWidth: '100%',
            icon: Scale,
            iconColor: 'text-amber-800',
            bgIcon: 'bg-amber-50',
            isDisputedCard: true,
        },
    ];

    // 2. MOCK DATA: Danh sách đơn hàng
    const orders = [
        {
            id: '#ORD-9842',
            customer: 'Sophia Loren',
            email: 'sophia@craft.co',
            isVip: true,
            productName: 'Vintage Washed Oversized Heavy Tee',
            variant: 'Charcoal • Size L',
            itemsCount: '2 items',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
            total: '$76.00',
            payment: 'Paid in Full',
            paymentType: 'paid',
            status: 'Delivered',
            date: 'Oct 28, 2026',
        },
        {
            id: '#ORD-9840',
            customer: 'Alex Turner',
            email: 'alex.turner@design.io',
            productName: 'Custom Artisan Graphic Batch',
            variant: 'Studio Nord • 250 units',
            isProducerRun: true,
            itemsCount: 'Commercial run',
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=120&auto=format&fit=crop&q=80',
            total: '$4,850.00',
            payment: 'Deposit (50% - $2,425)',
            paymentType: 'deposit',
            status: 'In Production',
            date: 'Oct 26, 2026',
        },
        {
            id: '#ORD-9838',
            customer: 'Julian Lowe',
            email: 'j.lowe@outerloop.net',
            isFlagged: true,
            productName: 'Heavyweight Acid Wash Crewneck',
            variant: 'Size XL • Single Item',
            itemsCount: '1 item',
            image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=120&auto=format&fit=crop&q=80',
            total: '$126.00',
            payment: 'Payment Disputed',
            paymentType: 'disputed',
            status: 'Disputed',
            date: 'Oct 25, 2026',
            isActionRow: true,
        },
        {
            id: '#ORD-9835',
            customer: 'Sienna Krause',
            email: 'sienna.k@archway.io',
            productName: 'Minimalist Embroidered Atelier Tee',
            variant: 'Sand • Size M',
            itemsCount: '1 item',
            image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
            total: '$42.00',
            payment: 'Paid in Full',
            paymentType: 'paid',
            status: 'Shipped',
            trackingCode: '#USP-8921',
            date: 'Oct 24, 2026',
        },
        {
            id: '#ORD-9831',
            customer: 'Thorne & Loom Co.',
            email: 'elias@thorneloom.studio',
            productName: 'Bespoke Raw Indigo Pullover run',
            variant: '500 units • Custom Loom',
            isProducerRun: true,
            itemsCount: 'Contract Wholesale',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=80',
            total: '$11,200.00',
            payment: 'Deposit Escrowed (50%)',
            paymentType: 'deposit',
            status: 'Confirmed',
            date: 'Oct 22, 2026',
        },
        {
            id: '#ORD-9828',
            customer: 'Marcus Kim',
            email: 'm.kim@studio.org',
            productName: 'Botanical Natural Dye Limited Batch',
            variant: 'Sage • Size S',
            itemsCount: '1 item',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&auto=format&fit=crop&q=80',
            total: '$54.00',
            payment: 'Pending Payment',
            paymentType: 'pending',
            status: 'Pending',
            date: 'Oct 21, 2026',
        },
        {
            id: '#ORD-9822',
            customer: 'Clara Vance',
            email: 'clara@atelierdesign.co',
            productName: 'French Terry Heavyweight Pullover',
            variant: 'Oatmeal • Size M',
            itemsCount: 'Refunded',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
            total: '$84.00',
            payment: 'Refunded ($84.00)',
            paymentType: 'refunded',
            status: 'Cancelled',
            date: 'Oct 19, 2026',
            isCancelled: true,
        },
    ];

    // Helper render Badge trạng thái thanh toán
    const renderPaymentBadge = (order) => {
        switch (order.paymentType) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                        {order.payment}
          </span>
                );
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

    // Helper render Badge trạng thái đơn hàng
    const renderStatusBadge = (order) => {
        switch (order.status) {
            case 'Delivered':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
            <Check className="w-3.5 h-3.5" />
            Delivered
          </span>
                );
            case 'In Production':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
            <RotateCw className="w-3 h-3 animate-spin" />
            In Production
          </span>
                );
            case 'Disputed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            Disputed (Review)
          </span>
                );
            case 'Shipped':
                return (
                    <div className="flex flex-col">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold w-max">
              <Truck className="w-3 h-3 text-zinc-500" />
              Shipped
            </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">{order.trackingCode}</span>
                    </div>
                );
            case 'Confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Confirmed
          </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
                );
            case 'Cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-bold">
            <Ban className="w-3 h-3" />
            Cancelled
          </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 mb-1">
                        <span>Operations</span>
                        <span className="text-zinc-300">/</span>
                        <span className="text-[#f0592a] font-bold">Fulfillment</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span className="px-2 py-0.5 rounded-full bg-[#faf8e4] text-[#f0592a] border border-[#f0592a]/20 text-[10px] font-bold">
              Live Syncing
            </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Orders</h1>
                        <span className="text-sm text-zinc-500 font-medium">(3,420 orders)</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 max-w-2xl leading-relaxed">
                        Manage retail customer shipments and bespoke producer manufacturing batches across all regional ateliers.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="h-11 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                    >
                        <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                        <span>Filter view</span>
                    </button>
                    <button
                        type="button"
                        className="h-11 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* 2. Dải 4 Card KPIs có thanh Progress */}
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
                                    {kpi.isPing && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping ml-1" />}
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

                            {/* Progress Bar ở đáy card */}
                            <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className={`h-full rounded-full ${kpi.barColor}`} style={{ width: kpi.barWidth }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Khung bảng chính (Tabs, Toolbar, Table) */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                {/* Tab phân loại đơn hàng */}
                <div className="px-6 pt-3 bg-[#faf8e4]/60 border-b border-zinc-200/60 flex items-center gap-4 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ready-made')}
                        className={`pb-3.5 pt-1 px-1 relative text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors ${
                            activeTab === 'ready-made' ? 'text-[#f0592a]' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                    >
                        <Shirt className="w-4 h-4" />
                        <span>Ready-made orders</span>
                        <span
                            className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'ready-made'
                                    ? 'bg-[#f0592a] text-white font-bold'
                                    : 'bg-zinc-200/70 text-zinc-600'
                            }`}
                        >
              2,840
            </span>
                        {activeTab === 'ready-made' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0592a] rounded-full" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('batches')}
                        className={`pb-3.5 pt-1 px-1 relative text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors ${
                            activeTab === 'batches' ? 'text-[#f0592a]' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                    >
                        <Wrench className="w-4 h-4" />
                        <span>Production batches</span>
                        <span
                            className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'batches'
                                    ? 'bg-[#f0592a] text-white font-bold'
                                    : 'bg-zinc-200/70 text-zinc-600'
                            }`}
                        >
              580
            </span>
                        {activeTab === 'batches' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0592a] rounded-full" />
                        )}
                    </button>

                    <div className="ml-auto hidden lg:flex items-center gap-2.5 pb-3 text-xs text-zinc-400 font-medium">
                        <span>Batch Sync: Today, 14:32 PST</span>
                        <button
                            type="button"
                            title="Refresh"
                            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                            <RotateCw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Toolbar: Tìm kiếm & Bộ lọc Dropdown */}
                <div className="p-4 md:p-6 bg-white flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
                    <div className="relative flex-1 min-w-[280px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="search"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Search by Order ID (#ORD-), customer name, or email..."
                            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Filter Status */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option>All Statuses</option>
                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>In Production</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                                <option>Disputed</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>

                        {/* Date Range Picker */}
                        <button
                            type="button"
                            className="h-11 px-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 flex items-center gap-2 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            <span>Oct 1 – Oct 31, 2026</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>

                        {/* Payment Filter */}
                        <div className="relative">
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option>All Payments</option>
                                <option>Paid in Full</option>
                                <option>Deposit Escrowed (50%)</option>
                                <option>Pending Settlement</option>
                                <option>Refunded</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>

                        {/* Reset Filter */}
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('All Statuses');
                                setPaymentFilter('All Payments');
                                setSearchKeyword('');
                            }}
                            className="h-11 px-3 text-zinc-500 hover:text-[#f0592a] text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Data Table Area */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[1020px]">
                        <thead>
                        <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-y border-zinc-100">
                            <th className="py-3.5 pl-6 pr-3">Order ID</th>
                            <th className="py-3.5 px-4">Customer</th>
                            <th className="py-3.5 px-4">Items / Garment Specs</th>
                            <th className="py-3.5 px-4 text-right">Total</th>
                            <th className="py-3.5 px-4">Payment / Escrow</th>
                            <th className="py-3.5 px-4">Order Status</th>
                            <th className="py-3.5 px-4">Date</th>
                            <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
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
                                {/* Order ID */}
                                <td className="py-4 pl-6 pr-3 font-bold text-[#f0592a] whitespace-nowrap">
                                    {ord.id}
                                </td>

                                {/* Customer */}
                                <td className="py-4 px-4 min-w-[190px]">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-zinc-900">{ord.customer}</span>
                                            {ord.isVip && (
                                                <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 text-[9px] font-bold uppercase">
                            VIP
                          </span>
                                            )}
                                            {ord.isFlagged && (
                                                <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-600 text-[9px] font-bold">
                            Flagged
                          </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-zinc-400 truncate">{ord.email}</span>
                                    </div>
                                </td>

                                {/* Items / Specs */}
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
                                            <span
                                                className={`text-[11px] truncate ${
                                                    ord.isProducerRun ? 'text-[#f0592a] font-medium' : 'text-zinc-400'
                                                }`}
                                            >
                          {ord.variant}
                        </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Total Amount */}
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                    <div className="flex flex-col items-end">
                      <span className={`font-bold ${ord.isCancelled ? 'line-through text-zinc-400' : 'text-zinc-950'}`}>
                        {ord.total}
                      </span>
                                        <span className="text-[11px] text-zinc-400">{ord.itemsCount}</span>
                                    </div>
                                </td>

                                {/* Payment Status */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                    {renderPaymentBadge(ord)}
                                </td>

                                {/* Order Status */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                    {renderStatusBadge(ord)}
                                </td>

                                {/* Date */}
                                <td className="py-4 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                                    {ord.date}
                                </td>

                                {/* Actions */}
                                <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                                    {ord.isActionRow ? (
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 rounded-lg bg-[#f0592a] hover:bg-[#d94a1f] text-white text-[11px] font-bold shadow-xs active:scale-[0.98] transition-all"
                                        >
                                            Resolve
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold transition-colors"
                                        >
                                            View
                                        </button>
                                    )}
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
              Showing <strong className="text-zinc-900">1 to 7</strong> of <strong className="text-zinc-900">3,420</strong> orders
            </span>
                        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-zinc-200">
                            <span>Rows per page:</span>
                            <select className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-zinc-800 font-semibold focus:outline-none cursor-pointer">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>
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