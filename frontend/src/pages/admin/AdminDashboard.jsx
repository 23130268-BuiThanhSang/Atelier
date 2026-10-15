import React, { useState, useEffect } from 'react';
import {
    Calendar,
    ChevronDown,
    Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    // 1. Quản lý khoảng thời gian (Mặc định: 30 ngày gần nhất)
    const todayStr = new Date().toISOString().split('T')[0];
    const thirtyDaysAgoStr = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'orders'
    const [isLoading, setIsLoading] = useState(false);

    // Dữ liệu từ API Backend
    const [dashboardData, setDashboardData] = useState(null);

    // 2. Hàm gọi API Backend
    const fetchStats = async (start, end) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/v1/admin/dashboard/stats?fromDate=${start}&toDate=${end}`);
            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu thống kê:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(startDate, endDate);
    }, [startDate, endDate]);

    // Format tiền tệ VND
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
    };

    // Format số nguyên
    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num || 0);
    };

    // Chuẩn bị dữ liệu hiển thị (kết hợp fallback dữ liệu mẫu nếu backend chưa có dữ liệu)
    const kpis = [
        { title: 'TỔNG DOANH THU', value: dashboardData?.kpis ? formatCurrency(dashboardData.kpis.totalRevenue) : '' },
        { title: 'TỔNG ĐƠN HÀNG', value: dashboardData?.kpis ? formatNumber(dashboardData.kpis.totalOrders) : '' },
        { title: 'NGƯỜI DÙNG MỚI', value: dashboardData?.kpis ? formatNumber(dashboardData.kpis.newUsers) : '' },
        { title: 'SẢN PHẨM ĐÃ BÁN', value: dashboardData?.kpis ? formatNumber(dashboardData.kpis.soldProducts) : '' },
    ];

    // Lấy tối đa 10 ngày có doanh thu cao nhất:
    const topGrowthPoints = (dashboardData?.growthChart || [])
        .slice(0, 10);
    const categoryDistribution = dashboardData?.categoryDistribution?.items || [
    ];
    const totalCategoryOrders = dashboardData?.categoryDistribution?.totalCount || 0;

    // Tính toán chiều cao các cột trong Biểu đồ SVG
    const maxVal = Math.max(
        ...topGrowthPoints.map(p => Math.max(Number(p.netRevenue || 0), Number(p.grossRevenue || 0))),
        1
    );

    // Tính toán các cung cho biểu đồ tròn (Donut Chart)
    const circumference = 2 * Math.PI * 58; // r = 58 -> ~364.42
    let accumulatedOffset = 0;

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header Banner & Bộ chọn khoảng thời gian */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-zinc-200/70">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f0592a] animate-pulse"></span>
                    <h1 className="text-xl font-bold text-zinc-950">Tổng quan hệ thống</h1>
                    {isLoading && <Loader2 className="w-4 h-4 text-[#f0592a] animate-spin ml-2" />}
                </div>

                {/* Bộ lọc chọn ngày thực tế */}
                <div className="flex flex-wrap items-center gap-2 bg-zinc-50 p-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700">
                    <Calendar className="w-4 h-4 text-zinc-400 ml-1" />
                    <span>Từ:</span>
                    <input
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white border border-zinc-200 px-2 py-1 rounded-lg text-zinc-900 outline-none focus:border-[#f0592a]"
                    />
                    <span>Đến:</span>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        max={todayStr}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white border border-zinc-200 px-2 py-1 rounded-lg text-zinc-900 outline-none focus:border-[#f0592a]"
                    />
                </div>
            </div>

            {/* 2. Bốn Card KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                        <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                            {kpi.title}
                        </span>
                        <div className="text-2xl font-bold tracking-tight text-zinc-950 mt-1.5">
                            {kpi.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Đồ thị Doanh thu/Đơn hàng & Phân bổ danh mục */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Cột 8: Biểu đồ cột */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                        <h2 className="text-base font-bold text-zinc-950">Tốc độ tăng trưởng doanh thu</h2>
                    </div>

                    {/* SVG Biểu đồ cột */}
                    <div className="relative w-full pt-4">
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

                            {/* Lưới ngang */}
                            <g stroke="#f4f4f5" strokeDasharray="3 3">
                                <line x1="40" x2="670" y1="20" y2="20" />
                                <line x1="40" x2="670" y1="70" y2="70" />
                                <line x1="40" x2="670" y1="120" y2="120" />
                                <line x1="40" x2="670" y1="170" y2="170" />
                                <line x1="40" x2="670" y1="210" y2="210" stroke="#e4e4e7" strokeDasharray="0" />
                            </g>

                            {/* Các cột hiển thị */}
                            {topGrowthPoints.map((pt, idx) => {
                                // 10 cột căn đều đẹp mắt trên viewBox 680px (mỗi cột cách nhau 56px)
                                const x = 70 + idx * 56;
                                const val1 = Number(pt.grossRevenue || 0);
                                const val2 = Number(pt.netRevenue || 0);

                                const h1 = maxVal > 0 ? Math.min(190, Math.max(10, (val1 / maxVal) * 180)) : 0;
                                const h2 = maxVal > 0 ? Math.min(190, Math.max(10, (val2 / maxVal) * 180)) : 0;

                                return (
                                    <g key={idx}>
                                        {/* Cột Doanh số cơ bản */}
                                        <rect x={x} y={210 - h1} width="14" height={h1} rx="3" fill="url(#barLight)" />
                                        {/* Cột Doanh thu thuần */}
                                        <rect x={x + 16} y={210 - h2} width="14" height={h2} rx="3" fill="url(#barOrange)" />
                                        {/* Nhãn ngày tương ứng */}
                                        <text x={x + 15} y="228" fill="#71717a" fontSize="10" fontWeight="600" textAnchor="middle">
                                            {pt.label}
                                        </text>
                                    </g>
                                );
                            })}
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
                        </div>
                    </div>
                </div>

                {/* Cột 4: Biểu đồ tròn Donut phân bổ danh mục */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white shadow-xs border border-zinc-200/70 space-y-4">
                    <div className="pb-3 border-b border-zinc-100">
                        <h2 className="text-base font-bold text-zinc-950">Phân bổ danh mục</h2>
                    </div>

                    <div className="relative">
                        <select className="w-full h-10 px-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium focus:outline-none focus:border-[#f0592a] appearance-none cursor-pointer">
                            <option>Đơn hàng theo loại sản phẩm</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* SVG Biểu đồ Donut động */}
                    <div className="relative flex items-center justify-center py-2">
                        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
                            {categoryDistribution.map((cat, idx) => {
                                const strokeDash = (cat.percentage / 100) * circumference;
                                const strokeSpace = circumference - strokeDash;
                                const offset = -accumulatedOffset;
                                accumulatedOffset += strokeDash;

                                return (
                                    <circle
                                        key={idx}
                                        cx="80"
                                        cy="80"
                                        r="58"
                                        fill="none"
                                        stroke={cat.color}
                                        strokeWidth="18"
                                        strokeDasharray={`${strokeDash} ${strokeSpace}`}
                                        strokeDashoffset={offset}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <span className="text-xl font-bold text-zinc-950">{formatNumber(totalCategoryOrders)}</span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400">Tổng sản phẩm</span>
                        </div>
                    </div>

                    {/* Chú giải danh mục */}
                    <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs">
                        {categoryDistribution.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                    <span className="text-zinc-700 truncate">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-zinc-900">{formatNumber(cat.count)}</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-600">
                                        {cat.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}