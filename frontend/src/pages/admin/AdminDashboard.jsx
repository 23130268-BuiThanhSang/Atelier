import React, { useState } from 'react';
import {
    TrendingUp,
    Calendar,
    RotateCw,
    Download,
    DollarSign,
    ShoppingBag,
    UserPlus,
    Shirt,
    Flame,
    Sparkles,
    Eye,
    Pin,
    ChevronDown,
    ArrowRight,
    Truck,
    Box
} from 'lucide-react';

export default function AdminDashboard() {
    const [selectedRange, setSelectedRange] = useState('30D');
    const [activeTab, setActiveTab] = useState('revenue');

    // MOCK DATA - Sau này thay bằng hook useQuery({ queryKey: [...], queryFn: adminApi.getStats })
    const kpis = [
        { title: 'Total Revenue', value: '$184,920.00', growth: '+14.2%', sub: 'vs. last month', icon: DollarSign },
        { title: 'Total Orders', value: '4,812', growth: '+8.6%', sub: 'vs. last month', icon: ShoppingBag },
        { title: 'New Users', value: '1,240', growth: '+18.4%', sub: 'creators & makers', icon: UserPlus },
        { title: 'Products Sold', value: '9,450', growth: '+6.1%', sub: 'apparel units', icon: Shirt },
    ];

    const bestSellers = [
        { name: 'Vintage Mineral Tee', sold: '1,420 sold', price: '$38.00', img: 'https://picsum.photos/seed/tee1/100/100' },
        { name: 'Heavy Twill Boxy Hoodie', sold: '980 sold', price: '$84.00', img: 'https://picsum.photos/seed/hoodie1/100/100' },
        { name: 'Artisan Chainstitch Tee', sold: '840 sold', price: '$44.00', img: 'https://picsum.photos/seed/tee2/100/100' },
        { name: 'Oversized Raw Crewneck', sold: '710 sold', price: '$62.00', img: 'https://picsum.photos/seed/crew1/100/100' },
        { name: 'Drop-Shoulder Pigment Tee', sold: '630 sold', price: '$40.00', img: 'https://picsum.photos/seed/tee3/100/100' },
    ];

    const newestProducts = [
        { name: 'Japanese Sashiko Tee', tag: 'New', time: 'Added 2 hrs ago', img: 'https://picsum.photos/seed/sashiko/100/100' },
        { name: 'Washed Indigo Heavy', tag: 'Stock: 120', time: 'Added 1 day ago', img: 'https://picsum.photos/seed/indigo/100/100' },
        { name: 'Woven Patch Canvas Tote', tag: 'Stock: 250', time: 'Added 3 days ago', img: 'https://picsum.photos/seed/tote/100/100' },
        { name: 'Acid Wash Print Tee', tag: 'Stock: 85', time: 'Added 4 days ago', img: 'https://picsum.photos/seed/acid/100/100' },
        { name: 'Raw Hem French Terry', tag: 'Stock: 64', time: 'Added 5 days ago', img: 'https://picsum.photos/seed/terry/100/100' },
    ];

    const mostViewed = [
        { name: 'Retro Cyber Graphic Tee', views: '18.4k', growth: '+24%', img: 'https://picsum.photos/seed/cyber/100/100' },
        { name: 'Minimal Embroidered Tee', views: '14.2k', growth: '+18%', img: 'https://picsum.photos/seed/embroid/100/100' },
        { name: 'Distressed Sun Fade Hoodie', views: '11.9k', growth: '+11%', img: 'https://picsum.photos/seed/fade/100/100' },
        { name: 'Botanical Dye Organic Tee', views: '9.8k', growth: '+31%', img: 'https://picsum.photos/seed/botanic/100/100' },
        { name: 'Block Print Limited Edition', views: '8.1k', growth: '+9%', img: 'https://picsum.photos/seed/block/100/100' },
    ];

    const suggestedPromos = [
        { name: 'Selvedge Work Shirt', badge: 'High Conversion', img: 'https://picsum.photos/seed/workshirt/100/100' },
        { name: 'Waffle Knit Henley', badge: 'Trending Fabric', img: 'https://picsum.photos/seed/waffle/100/100' },
        { name: 'Brass Zip Fleece', badge: 'Producer Verified', img: 'https://picsum.photos/seed/fleece/100/100' },
        { name: 'Clay Drop Crewneck', badge: 'Low Stock Velocity', img: 'https://picsum.photos/seed/clay/100/100' },
        { name: 'Needlecraft Twill Cap', badge: 'Viral Social Tag', img: 'https://picsum.photos/seed/cap/100/100' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-zinc-200/70">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f0592a] animate-pulse"></span>
                        <h1 className="text-xl font-bold text-zinc-950">Dashboard Overview</h1>
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#fefccf] text-[#f0592a] text-[11px] font-bold uppercase tracking-wider border border-[#f0592a]/20">
              Live Storefront
            </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Comprehensive studio metrics, apparel inventory velocity, and dispatch status
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>Oct 1 — Oct 31, 2026</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors">
                        <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Updated 2m ago</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* 2. Bốn Card KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
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
                                <div className="w-10 h-10 rounded-xl bg-[#fefccf] text-[#f0592a] flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                    {kpi.growth}
                </span>
                                <span className="text-zinc-400">{kpi.sub}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Đồ thị Doanh số & Phân bố danh mục (8 cols : 4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cột 8: Revenue Velocity Chart */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                        <div>
                            <h2 className="text-base font-bold text-zinc-950">Revenue & Orders Velocity</h2>
                            <p className="text-xs text-zinc-500">Trajectory distribution over the selected financial window</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="inline-flex p-1 rounded-xl bg-zinc-100">
                                <button
                                    onClick={() => setActiveTab('revenue')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeTab === 'revenue' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                >
                                    Revenue
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeTab === 'orders' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                >
                                    Orders
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
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SVG Cột Bar Graph */}
                    <div className="relative w-full pt-2">
                        <div className="absolute top-2 right-8 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-[11px] font-medium shadow-md flex items-center gap-2 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                            <span>Day 24: <strong>$14,820</strong> (312 orders)</span>
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
                                <text x="35" y="24">$30k</text>
                                <text x="35" y="74">$20k</text>
                                <text x="35" y="124">$10k</text>
                                <text x="35" y="174">$5k</text>
                                <text x="35" y="214">$0</text>
                            </g>

                            {/* Các cột minh họa */}
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
                                {['Oct 02', 'Oct 05', 'Oct 08', 'Oct 11', 'Oct 14', 'Oct 17', 'Oct 20', 'Oct 23', 'Oct 26', 'Oct 28', 'Oct 30', 'Today'].map((label, idx) => (
                                    <text key={idx} x={75 + idx * 50} y="228" fill={idx === 10 ? '#f0592a' : '#71717a'} fontWeight={idx === 10 ? '700' : '400'}>
                                        {label}
                                    </text>
                                ))}
                            </g>
                        </svg>

                        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-[#f0592a]"></span>
                                <span>Net Revenue ($)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-[#ffdbd0] border border-zinc-200"></span>
                                <span>Gross Sales Baseline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-zinc-900"></span>
                                <span>Peak Daily Velocity</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột 4: Donut Catalog Distribution */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 space-y-4">
                    <div className="pb-3 border-b border-zinc-100">
                        <h2 className="text-base font-bold text-zinc-950">Catalog Distribution</h2>
                        <span className="text-xs text-zinc-500">Category share & breakdown</span>
                    </div>

                    <div className="relative">
                        <select className="w-full h-10 px-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium focus:outline-none focus:border-[#f0592a] appearance-none cursor-pointer">
                            <option>Orders by product category</option>
                            <option>Revenue by category</option>
                            <option>Order status & stage</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* SVG Donut Visual */}
                    <div className="relative flex items-center justify-center py-2">
                        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#f0592a" strokeWidth="18" strokeDasharray="167.6 196.8" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#18181b" strokeWidth="18" strokeDasharray="102 262.4" strokeDashoffset="-167.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#71717a" strokeWidth="18" strokeDasharray="51 313.4" strokeDashoffset="-269.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#d4d4d8" strokeWidth="18" strokeDasharray="29 335.3" strokeDashoffset="-320.6" />
                            <circle cx="80" cy="80" r="58" fill="none" stroke="#fefccf" strokeWidth="18" strokeDasharray="14.5 349.9" strokeDashoffset="-349.7" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xl font-bold text-zinc-950">4,812</span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400">Total Orders</span>
                        </div>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs">
                        {[
                            { label: 'Graphic Tees', count: '2,214', pct: '46%', color: 'bg-[#f0592a]' },
                            { label: 'Heavyweight Hoodies', count: '1,347', pct: '28%', color: 'bg-zinc-900' },
                            { label: 'Organic Crewnecks', count: '674', pct: '14%', color: 'bg-zinc-500' },
                            { label: 'Embroidered Caps', count: '385', pct: '8%', color: 'bg-zinc-300' },
                            { label: 'Tote Bags & Accessories', count: '192', pct: '4%', color: 'bg-[#fefccf] border border-zinc-300' },
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

            {/* 4. Bốn Panel Danh sách Sản phẩm (4 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Panel 1: Best-Selling */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Flame className="w-4 h-4 text-[#f0592a]" />
                                <span>Best-Selling</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">View all</a>
                        </div>
                        <div className="space-y-3">
                            {bestSellers.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400">{item.sold}</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#f0592a] shrink-0">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Velocity: Strong</span>
                        <span className="text-[#f0592a] font-semibold">48.2% of catalog GMV</span>
                    </div>
                </div>

                {/* Panel 2: Newest Arrivals */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Shirt className="w-4 h-4 text-[#f0592a]" />
                                <span>Newest Arrivals</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">View all</a>
                        </div>
                        <div className="space-y-3">
                            {newestProducts.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400">{item.time}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">{item.tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Curated batch 44B</span>
                        <span className="text-zinc-700 font-semibold">12 items queued</span>
                    </div>
                </div>

                {/* Panel 3: Most Viewed */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Eye className="w-4 h-4 text-[#f0592a]" />
                                <span>Most Viewed</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-[#f0592a] hover:underline">View all</a>
                        </div>
                        <div className="space-y-3">
                            {mostViewed.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-medium text-zinc-900 truncate group-hover:text-[#f0592a] transition-colors">{item.name}</h4>
                                        <span className="text-[11px] text-zinc-400">{item.views} views</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-600">{item.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Click-through: 4.8%</span>
                        <span className="text-zinc-900 font-semibold">High Intent</span>
                    </div>
                </div>

                {/* Panel 4: Suggested Promos */}
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-950">
                                <Sparkles className="w-4 h-4 text-[#f0592a]" />
                                <span>Suggested Promos</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#ffdbd0] text-[#f0592a] text-[10px] font-bold">AI Pick</span>
                        </div>
                        <div className="space-y-3">
                            {suggestedPromos.map((item, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 group">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-medium text-zinc-900 truncate">{item.name}</h4>
                                            <span className="text-[10px] text-[#f0592a] font-medium">{item.badge}</span>
                                        </div>
                                    </div>
                                    <button className="p-1.5 rounded-lg bg-zinc-50 hover:bg-[#f0592a] hover:text-white text-zinc-400 transition-colors" title="Pin to top">
                                        <Pin className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="mt-4 w-full py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                        <span>Apply Promotion Bundle</span>
                    </button>
                </div>
            </div>

            {/* 5. Footer Operational Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-zinc-200/70 text-xs text-zinc-500 shadow-xs">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>Order Pipeline: <strong className="text-zinc-800">99.8% Healthy</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-zinc-400" />
                        <span>Avg Fulfillment: <strong className="text-zinc-800">22.4 Hours</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-zinc-400" />
                        <span>Warehouse Stock: <strong className="text-zinc-800">14,890 units</strong></span>
                    </div>
                </div>

                <a href="#" className="flex items-center gap-1 text-[#f0592a] font-semibold hover:underline">
                    <span>Go to Live Order Fulfillment Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}