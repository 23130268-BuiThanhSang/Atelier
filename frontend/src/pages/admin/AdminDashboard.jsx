import React, { useState } from 'react';
import {
    Calendar,
    Download,
    Shirt,
    Flame,
    Eye,
    ChevronDown
} from 'lucide-react';

export default function AdminDashboard() {
    const [selectedRange, setSelectedRange] = useState('30D');
    const [activeTab, setActiveTab] = useState('revenue');

    // DỮ LIỆU MẪU (MOCK DATA) - Sau này thay bằng hook useQuery({ queryKey: [...], queryFn: adminApi.getStats })
    const kpis = [
        { title: 'Tổng doanh thu', value: '184.920.000 ₫'},
        { title: 'Tổng đơn hàng', value: '4.812'},
        { title: 'Người dùng mới', value: '1.240'},
        { title: 'Sản phẩm đã bán', value: '9.450'},
    ];

    const bestSellers = [
        { name: 'Áo thun Vintage Mineral', sold: '1.420 đã bán', price: '380.000 ₫', img: 'https://picsum.photos/seed/tee1/100/100' },
        { name: 'Áo hoodie nỉ dáng hộp Twill', sold: '980 đã bán', price: '840.000 ₫', img: 'https://picsum.photos/seed/hoodie1/100/100' },
        { name: 'Áo thun thêu thủ công Chainstitch', sold: '840 đã bán', price: '440.000 ₫', img: 'https://picsum.photos/seed/tee2/100/100' },
        { name: 'Áo nỉ cổ tròn Raw viền sờn', sold: '710 đã bán', price: '620.000 ₫', img: 'https://picsum.photos/seed/crew1/100/100' },
        { name: 'Áo thun vai trễ nhuộm Pigment', sold: '630 đã bán', price: '400.000 ₫', img: 'https://picsum.photos/seed/tee3/100/100' },
    ];

    const newestProducts = [
        { name: 'Áo thun thêu Sashiko Nhật Bản', tag: 'Mới', time: 'Vừa thêm 2 giờ trước', img: 'https://picsum.photos/seed/sashiko/100/100' },
        { name: 'Áo thun Washed Indigo dày dặn', tag: 'Tồn kho: 120', time: 'Thêm 1 ngày trước', img: 'https://picsum.photos/seed/indigo/100/100' },
        { name: 'Túi tote Canvas nhãn dệt', tag: 'Tồn kho: 250', time: 'Thêm 3 ngày trước', img: 'https://picsum.photos/seed/tote/100/100' },
        { name: 'Áo thun in họa tiết Acid Wash', tag: 'Tồn kho: 85', time: 'Thêm 4 ngày trước', img: 'https://picsum.photos/seed/acid/100/100' },
        { name: 'Áo nỉ chui đầu French Terry viền thô', tag: 'Tồn kho: 64', time: 'Thêm 5 ngày trước', img: 'https://picsum.photos/seed/terry/100/100' },
    ];

    const mostViewed = [
        { name: 'Áo thun đồ họa Retro Cyber', views: '18.4k', growth: '+24%', img: 'https://picsum.photos/seed/cyber/100/100' },
        { name: 'Áo thun thêu viền tối giản', views: '14.2k', growth: '+18%', img: 'https://picsum.photos/seed/embroid/100/100' },
        { name: 'Áo hoodie phai màu Distressed Sun', views: '11.9k', growth: '+11%', img: 'https://picsum.photos/seed/fade/100/100' },
        { name: 'Áo thun Organic nhuộm thảo mộc', views: '9.8k', growth: '+31%', img: 'https://picsum.photos/seed/botanic/100/100' },
        { name: 'Áo thun in khắc gỗ Bản giới hạn', views: '8.1k', growth: '+9%', img: 'https://picsum.photos/seed/block/100/100' },
    ];

    const suggestedPromos = [
        { name: 'Áo sơ mi vải Selvedge Canvas', badge: 'Chuyển đổi cao', img: 'https://picsum.photos/seed/workshirt/100/100' },
        { name: 'Áo Henley dệt kim tổ ong Waffle', badge: 'Chất liệu xu hướng', img: 'https://picsum.photos/seed/waffle/100/100' },
        { name: 'Áo nỉ khóa đồng Brass Zip', badge: 'Xưởng đạt chuẩn', img: 'https://picsum.photos/seed/fleece/100/100' },
        { name: 'Áo nỉ cổ tròn hạ vai màu Clay', badge: 'Tốc độ bán thấp', img: 'https://picsum.photos/seed/clay/100/100' },
        { name: 'Mũ lưỡi trai Twill thêu thủ công', badge: 'Xu hướng mạng xã hội', img: 'https://picsum.photos/seed/cap/100/100' },
    ];

    const rangeLabels = {
        Today: 'Hôm nay',
        '7D': '7 ngày',
        '30D': '30 ngày',
        '12M': '12 tháng',
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-zinc-200/70">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f0592a] animate-pulse"></span>
                        <h1 className="text-xl font-bold text-zinc-950">Tổng quan hệ thống</h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>01/10 — 31/10/2026</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all">
                        <Download className="w-4 h-4" />
                        <span>Xuất báo cáo</span>
                    </button>
                </div>
            </div>

            {/* 2. Bốn Card KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => {
                    return (
                        <div key={idx} className="p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                                        {kpi.title}
                                    </span>
                                    <div className="text-2xl font-bold tracking-tight text-zinc-950 mt-1.5">
                                        {kpi.value}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Đồ thị Doanh thu & Phân bố danh mục (8 cột : 4 cột) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Cột 8: Biểu đồ doanh thu & đơn hàng */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                        <div>
                            <h2 className="text-base font-bold text-zinc-950">Tốc độ tăng trưởng Doanh thu & Đơn hàng</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="inline-flex p-1 rounded-xl bg-zinc-100">
                                <button
                                    onClick={() => setActiveTab('revenue')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeTab === 'revenue' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                >
                                    Doanh thu
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeTab === 'orders' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                >
                                    Đơn hàng
                                </button>
                            </div>

                            <div className="inline-flex p-1 rounded-xl bg-zinc-100">
                                {['Today', '7D', '30D', '12M'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setSelectedRange(range)}
                                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                                            selectedRange === range ? 'bg-[#f0592a] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                                        }`}
                                    >
                                        {rangeLabels[range]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SVG Biểu đồ cột */}
                    <div className="relative w-full pt-2">
                        <div className="absolute top-2 right-8 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-[11px] font-medium shadow-md flex items-center gap-2 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                            <span>Ngày 24: <strong>14.820.000 ₫</strong> (312 đơn)</span>
                        </div>

                        <svg className="w-full h-64 overflow-visible" preserveAspectRatio="none" viewBox="0 0 680 240">
                            <defs>
                                <linearGradient id="barOrange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f0592a" />
                                    <stop offset="100%" stopColor="#d94a1f" />
                                </linearGradient>
                                <linearGradient id="barLight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ffdbd0" />
                                    <stop offset="100%" stopColor="#fefccf" />
                                </linearGradient>
                            </defs>
                            <g stroke="#f4f4f5" strokeDasharray="3 3">
                                <line x1="40" x2="670" y1="20" y2="20" />
                                <line x1="40" x2="670" y1="70" y2="70" />
                                <line x1="40" x2="670" y1="120" y2="120" />
                                <line x1="40" x2="670" y1="170" y2="170" />
                                <line x1="40" x2="670" y1="210" y2="210" stroke="#e4e4e7" strokeDasharray="0" />
                            </g>
                            <g fill="#a1a1aa" fontSize="10" textAnchor="end">
                                <text x="35" y="24">30tr</text>
                                <text x="35" y="74">20tr</text>
                                <text x="35" y="124">10tr</text>
                                <text x="35" y="174">5tr</text>
                                <text x="35" y="214">0đ</text>
                            </g>

                            {/* Cột dữ liệu */}
                            {[
                                { x: 60, h1: 90, h2: 70 },
                                { x: 110, h1: 110, h2: 100 },
                                { x: 160, h1: 130, h2: 120 },
                                { x: 210, h1: 80, h2: 60 },
                                { x: 260, h1: 140, h2: 150 },
                                { x: 310, h1: 100, h2: 115 },
                                { x: 360, h1: 120, h2: 135 },
                                { x: 410, h1: 110, h2: 125 },
                                { x: 460, h1: 150, h2: 165 },
                                { x: 510, h1: 120, h2: 145 },
                                { x: 560, h1: 180, h2: 175, highlight: true },
                                { x: 610, h1: 130, h2: 145 },
                            ].map((bar, i) => (
                                <g key={i}>
                                    <rect x={bar.x} y={210 - bar.h1} width="14" height={bar.h1} rx="3" fill="url(#barLight)" />
                                    <rect
                                        x={bar.x + 16}
                                        y={210 - bar.h2}
                                        width="14"
                                        height={bar.h2}
                                        rx="3"
                                        fill={bar.highlight ? '#18181b' : 'url(#barOrange)'}
                                    />
                                </g>
                            ))}

                            <g fill="#71717a" fontSize="10" textAnchor="middle">
                                {['02/10', '05/10', '08/10', '11/10', '14/10', '17/10', '20/10', '23/10', '26/10', '28/10', '30/10', 'Hôm nay'].map((label, idx) => (
                                    <text key={idx} x={75 + idx * 50} y="228" fill={idx === 10 ? '#f0592a' : '#71717a'} fontWeight={idx === 10 ? '700' : '400'}>
                                        {label}
                                    </text>
                                ))}
                            </g>
                        </svg>

                        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-[#f0592a]"></span>
                                <span>Doanh thu thuần (₫)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-[#ffdbd0] border border-zinc-200"></span>
                                <span>Tổng doanh số cơ bản</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-zinc-900"></span>
                                <span>Đỉnh tăng trưởng ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột 4: Biểu đồ tròn phân bổ danh mục */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 space-y-4">
                    <div className="pb-3 border-b border-zinc-100">
                        <h2 className="text-base font-bold text-zinc-950">Phân bổ danh mục</h2>
                    </div>

                    <div className="relative">
                        <select className="w-full h-10 px-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium focus:outline-none focus:border-[#f0592a] appearance-none cursor-pointer">
                            <option>Đơn hàng theo loại sản phẩm</option>
                            <option>Doanh thu theo danh mục</option>
                            <option>Trạng thái & giai đoạn đơn</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* SVG Biểu đồ Donut */}
                    <div className="relative flex items-center justify-center py-2">
                        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#f0592a" strokeWidth="18" strokeDasharray="167.6 196.8" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#18181b" strokeWidth="18" strokeDasharray="102 262.4" strokeDashoffset="-167.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#71717a" strokeWidth="18" strokeDasharray="51 313.4" strokeDashoffset="-269.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#d4d4d8" strokeWidth="18" strokeDasharray="29 335.3" strokeDashoffset="-320.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#fefccf" strokeWidth="18" strokeDasharray="14.5 349.9" strokeDashoffset="-349.7" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xl font-bold text-zinc-950">4.812</span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400">Tổng đơn hàng</span>
                        </div>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs">
                        {[
                            { label: 'Áo thun Graphic', count: '2.214', pct: '46%', color: 'bg-[#f0592a]' },
                            { label: 'Áo hoodie dày dặn', count: '1.347', pct: '28%', color: 'bg-zinc-900' },
                            { label: 'Áo nỉ cổ tròn Organic', count: '674', pct: '14%', color: 'bg-zinc-500' },
                            { label: 'Mũ lưỡi trai thêu', count: '385', pct: '8%', color: 'bg-zinc-300' },
                            { label: 'Túi tote & Phụ kiện', count: '192', pct: '4%', color: 'bg-[#fefccf] border border-zinc-300' },
                        ].map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                                    <span className="text-zinc-700 truncate">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-zinc-900">{cat.count}</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-600">{cat.pct}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Ba Panel Danh sách Sản phẩm (3 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Panel 1: Bán chạy nhất */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Flame className="w-4 h-4 text-[#f0592a]" />
                                <span>Bán chạy nhất</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">Xem tất cả</a>
                        </div>
                        <div className="space-y-3">
                            {bestSellers.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400 shrink-0 whitespace-nowrap">{item.sold}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel 2: Mới về */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Shirt className="w-4 h-4 text-[#f0592a]" />
                                <span>Hàng mới về</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">Xem tất cả</a>
                        </div>
                        <div className="space-y-3">
                            {newestProducts.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400 shrink-0 whitespace-nowrap">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel 3: Xem nhiều nhất */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Eye className="w-4 h-4 text-[#f0592a]" />
                                <span>Xem nhiều nhất</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">Xem tất cả</a>
                        </div>
                        <div className="space-y-3">
                            {mostViewed.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400 shrink-0 whitespace-nowrap">{item.views} lượt xem</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}