import React, { useState } from 'react';
import {
    Download,
    Plus,
    Box,
    CheckCircle2,
    AlertTriangle,
    PackageX,
    Search,
    ChevronDown,
    SlidersHorizontal,
    Star,
    Edit,
    Eye,
    EyeOff,
    Trash2,
    MoreVertical,
    Check,
    ChevronLeft,
    ChevronRight,
    Archive
} from 'lucide-react';

export default function AdminProducts() {
    const [selectedIds, setSelectedIds] = useState([1, 2, 3]); // Mặc định chọn 3 sản phẩm đầu
    const [categoryFilter, setCategoryFilter] = useState('Tất cả danh mục');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [stockFilter, setStockFilter] = useState('Mức tồn kho: Tất cả');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. DỮ LIỆU MẪU: 4 thẻ KPI đầu trang
    const kpis = [
        { title: 'Tổng danh mục', value: '184 mục', icon: Box, iconColor: 'text-zinc-500', bgIcon: 'bg-zinc-100' },
        {
            title: 'Đang mở bán',
            value: '162',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            icon: CheckCircle2,
            iconColor: 'text-emerald-700',
            bgIcon: 'bg-emerald-50'
        },
        {
            title: 'Sắp hết hàng',
            value: '8',
            badgeColor: 'bg-amber-50 text-amber-800',
            icon: AlertTriangle,
            iconColor: 'text-amber-800',
            bgIcon: 'bg-amber-50'
        },
        {
            title: 'Hết hàng',
            value: '14',
            badgeColor: 'bg-red-50 text-red-600',
            icon: PackageX,
            iconColor: 'text-red-600',
            bgIcon: 'bg-red-50'
        },
    ];

    // 2. DỮ LIỆU MẪU: Danh sách sản phẩm
    const products = [
        {
            id: 1,
            name: 'Áo thun Vintage Washed Oversized Heavy Tee',
            sku: 'SKU-TEE-084 · 280gsm Cotton chải kỹ',
            category: 'Áo thun Heavyweight',
            price: '380.000 ₫',
            stock: 420,
            stockPercent: 82,
            stockStatus: 'in-stock',
            sold: '1.420 đã bán',
            gmv: '53,9 triệu ₫ GMV',
            views: '18.4k',
            status: 'Active',
            featured: true,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 2,
            name: 'Áo thun Artisan Raw Cotton Boxy Fit Tee',
            sku: 'SKU-TEE-119 · Cotton thô mộc không tẩy',
            category: 'Vintage Organic',
            price: '440.000 ₫',
            stock: 185,
            stockPercent: 55,
            stockStatus: 'in-stock',
            sold: '840 đã bán',
            gmv: '36,9 triệu ₫ GMV',
            views: '11.9k',
            status: 'Active',
            featured: true,
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 3,
            name: 'Áo thun Acid Wash Distressed Pocket Crew',
            sku: 'SKU-TEE-052 · Nhuộm sắc tố Charcoal',
            category: 'Áo thun Graphic',
            price: '420.000 ₫',
            stock: 85,
            stockPercent: 32,
            stockStatus: 'in-stock',
            sold: '630 đã bán',
            gmv: '26,4 triệu ₫ GMV',
            views: '9.8k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 4,
            name: 'Áo thun thêu logo Atelier tối giản',
            sku: 'SKU-TEE-003 · Chỉ thêu đồng sắc độ',
            category: 'Áo thun Graphic',
            price: '360.000 ₫',
            stock: 210,
            stockPercent: 60,
            stockStatus: 'hidden',
            sold: '540 đã bán',
            gmv: '19,4 triệu ₫ GMV',
            views: '7.2k',
            status: 'Hidden',
            image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 5,
            name: 'Áo hoodie French Terry Heavyweight Pullover',
            sku: 'SKU-HD-014 · 450gsm Cotton vảy cá Loopback',
            category: 'Áo hoodie nỉ dày',
            price: '840.000 ₫',
            stock: 14,
            stockPercent: 14,
            stockStatus: 'low-stock',
            sold: '980 đã bán',
            gmv: '82,3 triệu ₫ GMV',
            views: '14.2k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 6,
            name: 'Áo thun nhuộm thảo mộc tự nhiên (Bản giới hạn)',
            sku: 'SKU-TEE-099 · Sắc tố thực vật màu Sage',
            category: 'Vintage Organic',
            price: '480.000 ₫',
            stock: 0,
            stockPercent: 0,
            stockStatus: 'out-of-stock',
            sold: '390 đã bán',
            gmv: '18,7 triệu ₫ GMV',
            views: '8.1k',
            status: 'Out of stock',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 7,
            name: 'Túi tote Selvedge Woven Heavy Canvas',
            sku: 'SKU-ACC-021 · Vải bố Canvas 16oz',
            category: 'Túi vải Canvas',
            price: '280.000 ₫',
            stock: 130,
            stockPercent: 45,
            stockStatus: 'in-stock',
            sold: '310 đã bán',
            gmv: '8,6 triệu ₫ GMV',
            views: '4.5k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
        },
    ];

    // Xử lý chọn hàng loạt checkbox
    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Render badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700">
                        Đang bán
                    </span>
                );
            case 'Hidden':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-zinc-100 text-zinc-700">
                        Đang ẩn
                    </span>
                );
            case 'Out of stock':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-red-50 text-red-600">
                        Hết hàng
                    </span>
                );
            default:
                return null;
        }
    };

    // Render thanh đo tồn kho
    const renderStockProgress = (product) => {
        let barColor = 'bg-emerald-600';
        let textColor = 'text-emerald-700';
        let label = `Còn ${product.stock} chiếc`;

        if (product.stockStatus === 'low-stock') {
            barColor = 'bg-amber-600';
            textColor = 'text-amber-800 font-semibold';
            label = `Còn ${product.stock} (Sắp hết)`;
        } else if (product.stockStatus === 'out-of-stock') {
            barColor = 'bg-red-600';
            textColor = 'text-red-600 font-semibold';
            label = '0 chiếc';
        } else if (product.stockStatus === 'hidden') {
            barColor = 'bg-zinc-500';
            textColor = 'text-zinc-600 font-semibold';
        }

        return (
            <div className="flex flex-col gap-1 w-28">
                <span className={`text-[11px] ${textColor}`}>{label}</span>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${product.stockPercent}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Tiêu đề trang & Các nút hành động */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span>Danh mục & Kho hàng</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Sản phẩm</h1>
                        <span className="text-sm font-medium text-zinc-500">(184 sản phẩm)</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="h-11 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4 text-zinc-500" />
                        <span>Xuất CSV</span>
                    </button>
                    <button
                        type="button"
                        className="h-11 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>
            </div>

            {/* 2. Bốn Card KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-zinc-200/70 shadow-xs flex items-center justify-between">
                            <div>
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                                    {kpi.title}
                                </span>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="text-lg font-bold text-zinc-950 tracking-tight">{kpi.value}</span>
                                    {kpi.badge && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${kpi.badgeColor}`}>
                                            {kpi.badge}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bgIcon} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Toolbar bộ lọc & tìm kiếm */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-zinc-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo tên sản phẩm, mã SKU, thẻ tag..."
                        className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Lọc Category */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                        >
                            <option>Tất cả danh mục</option>
                            <option>Áo thun Graphic</option>
                            <option>Áo hoodie nỉ dày</option>
                            <option>Áo nỉ cổ tròn Organic</option>
                            <option>Mũ lưỡi trai thêu</option>
                            <option>Túi vải Canvas</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* Lọc Status */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                        >
                            <option>Tất cả trạng thái</option>
                            <option>Đang bán</option>
                            <option>Đang ẩn</option>
                            <option>Hết hàng</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* Lọc Stock level */}
                    <div className="relative">
                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                        >
                            <option>Mức tồn kho: Tất cả</option>
                            <option>Còn hàng (&gt; 20)</option>
                            <option>Sắp hết (&lt; 20)</option>
                            <option>Hết hàng (0)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    <button
                        type="button"
                        className="h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Bộ lọc</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setCategoryFilter('Tất cả danh mục');
                            setStatusFilter('Tất cả trạng thái');
                            setStockFilter('Mức tồn kho: Tất cả');
                            setSearchKeyword('');
                        }}
                        className="h-11 px-3 rounded-xl text-[#f0592a] hover:bg-[#fefccf] text-xs font-semibold transition-colors"
                    >
                        Đặt lại
                    </button>
                </div>
            </div>

            {/* 4. Thanh thao tác hàng loạt khi có chọn sản phẩm (Bulk Action Bar) */}
            {selectedIds.length > 0 && (
                <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#f0592a] flex items-center justify-center text-white text-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">Đã chọn {selectedIds.length} sản phẩm</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <span>Đổi trạng thái</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Cập nhật kho</span>
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Xuất dữ liệu</span>
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="text-zinc-400 hover:text-white text-xs underline underline-offset-4 ml-2"
                        >
                            Bỏ chọn tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* 5. Bảng dữ liệu sản phẩm (Data Table) */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[1020px]">
                        <thead>
                        <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-b border-zinc-100">
                            <th className="py-3.5 pl-6 pr-3 w-12 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === products.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                />
                            </th>
                            <th className="py-3.5 px-4">Thông tin sản phẩm</th>
                            <th className="py-3.5 px-4">Danh mục</th>
                            <th className="py-3.5 px-4">Giá bán</th>
                            <th className="py-3.5 px-4">Mức tồn kho</th>
                            <th className="py-3.5 px-4">Lượt xem</th>
                            <th className="py-3.5 px-4">Trạng thái</th>
                            <th className="py-3.5 pl-4 pr-6 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {products.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <tr
                                    key={p.id}
                                    className={`transition-colors ${
                                        isSelected ? 'bg-[#fefccf]/40 hover:bg-[#fefccf]/60' : 'hover:bg-zinc-50/70'
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <td className="py-4 pl-6 pr-3 text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelectRow(p.id)}
                                            className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                        />
                                    </td>

                                    {/* Thông tin sản phẩm */}
                                    <td className="py-4 px-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-100 shrink-0 overflow-hidden relative border border-zinc-200/70 shadow-2xs">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col min-w-0 max-w-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-zinc-950 truncate">{p.name}</span>
                                                    {p.featured && (
                                                        <Star className="w-3.5 h-3.5 fill-[#f0592a] text-[#f0592a] shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Danh mục */}
                                    <td className="py-4 px-4 align-middle font-medium text-zinc-700">
                                        {p.category}
                                    </td>

                                    {/* Giá bán */}
                                    <td className="py-4 px-4 align-middle font-bold text-[#f0592a]">
                                        {p.price}
                                    </td>

                                    {/* Mức tồn kho */}
                                    <td className="py-4 px-4 align-middle">
                                        {renderStockProgress(p)}
                                    </td>

                                    {/* Lượt xem */}
                                    <td className="py-4 px-4 align-middle font-medium text-zinc-800">
                                        {p.views}
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="py-4 px-4 align-middle">
                                        {renderStatusBadge(p.status)}
                                    </td>

                                    {/* Thao tác */}
                                    <td className="py-4 pl-4 pr-6 align-middle text-right">
                                        <div className="inline-flex items-center gap-1 text-zinc-400">
                                            <button
                                                type="button"
                                                title="Chỉnh sửa"
                                                className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title={p.status === 'Hidden' ? 'Hiện sản phẩm' : 'Ẩn sản phẩm'}
                                                className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                {p.status === 'Hidden' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                title="Xóa"
                                                className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Khác"
                                                className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* 6. Thanh phân trang */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
                        <span>
                            Hiển thị <strong className="text-zinc-900">1 đến 7</strong> trong <strong className="text-zinc-900">184</strong> sản phẩm
                        </span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold">
                        <button
                            disabled
                            type="button"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 bg-white border border-zinc-200 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-lg bg-[#f0592a] text-white flex items-center justify-center shadow-xs"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            3
                        </button>
                        <span className="w-7 text-center text-zinc-400 font-normal">…</span>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                        >
                            19
                        </button>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}