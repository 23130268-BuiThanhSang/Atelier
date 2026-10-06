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
    Archive,
    RefreshCw
} from 'lucide-react';

export default function AdminProducts() {
    const [selectedIds, setSelectedIds] = useState([1, 2, 3]); // Mặc định chọn 3 sản phẩm đầu như mẫu[cite: 8]
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [stockFilter, setStockFilter] = useState('Stock Level: All');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. MOCK DATA: 4 thẻ KPI đầu trang[cite: 8]
    const kpis = [
        { title: 'Total Catalog', value: '184 Items', icon: Box, iconColor: 'text-zinc-500', bgIcon: 'bg-zinc-100' },
        {
            title: 'Active for Sale',
            value: '162',
            badge: '88%',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            icon: CheckCircle2,
            iconColor: 'text-emerald-700',
            bgIcon: 'bg-emerald-50'
        },
        {
            title: 'Low Stock',
            value: '8',
            badge: '< 20 units',
            badgeColor: 'bg-amber-50 text-amber-800',
            icon: AlertTriangle,
            iconColor: 'text-amber-800',
            bgIcon: 'bg-amber-50'
        },
        {
            title: 'Out of Stock',
            value: '14',
            badge: 'Restock due',
            badgeColor: 'bg-red-50 text-red-600',
            icon: PackageX,
            iconColor: 'text-red-600',
            bgIcon: 'bg-red-50'
        },
    ];

    // 2. MOCK DATA: Danh sách sản phẩm[cite: 8]
    const products = [
        {
            id: 1,
            name: 'Vintage Washed Oversized Heavy Tee',
            sku: 'SKU-TEE-084 · 280gsm Combed Cotton',
            category: 'Heavyweight Tee',
            price: '$38.00',
            stock: 420,
            stockPercent: 82,
            stockStatus: 'in-stock',
            sold: '1,420 sold',
            gmv: '$53.9k GMV',
            views: '18.4k',
            status: 'Active',
            featured: true,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 2,
            name: 'Artisan Raw Cotton Boxy Fit Tee',
            sku: 'SKU-TEE-119 · Unbleached Seed Cotton',
            category: 'Organic Vintage',
            price: '$44.00',
            stock: 185,
            stockPercent: 55,
            stockStatus: 'in-stock',
            sold: '840 sold',
            gmv: '$36.9k GMV',
            views: '11.9k',
            status: 'Active',
            featured: true,
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 3,
            name: 'Acid Wash Distressed Pocket Crew',
            sku: 'SKU-TEE-052 · Pigment Dyed Charcoal',
            category: 'Graphic Tees',
            price: '$42.00',
            stock: 85,
            stockPercent: 32,
            stockStatus: 'in-stock',
            sold: '630 sold',
            gmv: '$26.4k GMV',
            views: '9.8k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 4,
            name: 'Minimal Embroidered Atelier Logo Tee',
            sku: 'SKU-TEE-003 · Tone-on-tone Stitching',
            category: 'Graphic Tees',
            price: '$36.00',
            stock: 210,
            stockPercent: 60,
            stockStatus: 'hidden',
            sold: '540 sold',
            gmv: '$19.4k GMV',
            views: '7.2k',
            status: 'Hidden',
            image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 5,
            name: 'French Terry Heavyweight Pullover',
            sku: 'SKU-HD-014 · 450gsm Loopback Cotton',
            category: 'Heavyweight Hoodies',
            price: '$84.00',
            stock: 14,
            stockPercent: 14,
            stockStatus: 'low-stock',
            sold: '980 sold',
            gmv: '$82.3k GMV',
            views: '14.2k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 6,
            name: 'Botanical Natural Dye Limited Batch',
            sku: 'SKU-TEE-099 · Plant-based Sage Pigment',
            category: 'Organic Vintage',
            price: '$48.00',
            stock: 0,
            stockPercent: 0,
            stockStatus: 'out-of-stock',
            sold: '390 sold',
            gmv: '$18.7k GMV',
            views: '8.1k',
            status: 'Out of stock',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&auto=format&fit=crop&q=80',
        },
        {
            id: 7,
            name: 'Selvedge Woven Heavy Canvas Tote',
            sku: 'SKU-ACC-021 · 16oz Cotton Canvas',
            category: 'Canvas Totes',
            price: '$28.00',
            stock: 130,
            stockPercent: 45,
            stockStatus: 'in-stock',
            sold: '310 sold',
            gmv: '$8.6k GMV',
            views: '4.5k',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
        },
    ];

    // Xử lý chọn hàng loạt checkbox[cite: 8]
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

    // Render badge trạng thái[cite: 8]
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700">
            Active
          </span>
                );
            case 'Hidden':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-zinc-100 text-zinc-700">
            Hidden
          </span>
                );
            case 'Out of stock':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-red-50 text-red-600">
            Out of stock
          </span>
                );
            default:
                return null;
        }
    };

    // Render thanh đo tồn kho[cite: 8]
    const renderStockProgress = (product) => {
        let barColor = 'bg-emerald-600';
        let textColor = 'text-emerald-700';
        let label = `${product.stock} in stock`;

        if (product.stockStatus === 'low-stock') {
            barColor = 'bg-amber-600';
            textColor = 'text-amber-800 font-semibold';
            label = `${product.stock} left (Low)`;
        } else if (product.stockStatus === 'out-of-stock') {
            barColor = 'bg-red-600';
            textColor = 'text-red-600 font-semibold';
            label = '0 units left';
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
            {/* 1. Header & Actions[cite: 8] */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span>Catalog & Inventory</span>
                        <span className="text-zinc-300">/</span>
                        <span className="text-zinc-500">Apparel Merchandise</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Products</h1>
                        <span className="text-sm font-medium text-zinc-500">(184 items)</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
                        Manage garment blanks, curated graphic tees, artisan drops, and track velocity across all production facilities.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="h-11 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4 text-zinc-500" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        className="h-11 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* 2. Bốn Card KPI[cite: 8] */}
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

            {/* 3. Toolbar bộ lọc & tìm kiếm[cite: 8] */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-zinc-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search products by title, SKU, or tag..."
                        className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all"
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
                            <option>All Categories</option>
                            <option>Graphic Tees</option>
                            <option>Heavyweight Hoodies</option>
                            <option>Organic Crewnecks</option>
                            <option>Embroidered Caps</option>
                            <option>Canvas Totes</option>
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
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Hidden</option>
                            <option>Out of stock</option>
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
                            <option>Stock Level: All</option>
                            <option>In Stock (&gt; 20)</option>
                            <option>Low Stock (&lt; 20)</option>
                            <option>Out of Stock (0)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    <button
                        type="button"
                        className="h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setCategoryFilter('All Categories');
                            setStatusFilter('All Statuses');
                            setStockFilter('Stock Level: All');
                            setSearchKeyword('');
                        }}
                        className="h-11 px-3 rounded-xl text-[#f0592a] hover:bg-[#fefccf] text-xs font-semibold transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* 4. Thanh thao tác hàng loạt khi có chọn sản phẩm (Bulk Action Bar)[cite: 8] */}
            {selectedIds.length > 0 && (
                <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#f0592a] flex items-center justify-center text-white text-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">{selectedIds.length} products selected</span>
                        <span className="text-zinc-400 text-xs hidden sm:inline">
              · Vintage Heavy Tee, Artisan Raw Cotton, Acid Wash Pocket
            </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <span>Change Status</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Update Stock</span>
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="text-zinc-400 hover:text-white text-xs underline underline-offset-4 ml-2"
                        >
                            Clear selection
                        </button>
                    </div>
                </div>
            )}

            {/* 5. Bảng dữ liệu sản phẩm (Data Table)[cite: 8] */}
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
                            <th className="py-3.5 px-4">Product Details</th>
                            <th className="py-3.5 px-4">Category</th>
                            <th className="py-3.5 px-4">Price</th>
                            <th className="py-3.5 px-4">Stock Level</th>
                            <th className="py-3.5 px-4">Sales Performance</th>
                            <th className="py-3.5 px-4">Views</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
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
                                    {/* Checkbox chọn dòng[cite: 8] */}
                                    <td className="py-4 pl-6 pr-3 text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelectRow(p.id)}
                                            className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                        />
                                    </td>

                                    {/* Chi tiết sản phẩm[cite: 8] */}
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
                                                <span className="text-[11px] text-zinc-400 truncate">{p.sku}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category[cite: 8] */}
                                    <td className="py-4 px-4 align-middle font-medium text-zinc-700">
                                        {p.category}
                                    </td>

                                    {/* Price[cite: 8] */}
                                    <td className="py-4 px-4 align-middle font-bold text-[#f0592a]">
                                        {p.price}
                                    </td>

                                    {/* Stock Level Progress[cite: 8] */}
                                    <td className="py-4 px-4 align-middle">
                                        {renderStockProgress(p)}
                                    </td>

                                    {/* Sales Performance[cite: 8] */}
                                    <td className="py-4 px-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-zinc-900">{p.sold}</span>
                                            <span className="text-[11px] text-zinc-400">{p.gmv}</span>
                                        </div>
                                    </td>

                                    {/* Views[cite: 8] */}
                                    <td className="py-4 px-4 align-middle font-medium text-zinc-800">
                                        {p.views}
                                    </td>

                                    {/* Status[cite: 8] */}
                                    <td className="py-4 px-4 align-middle">
                                        {renderStatusBadge(p.status)}
                                    </td>

                                    {/* Actions[cite: 8] */}
                                    <td className="py-4 pl-4 pr-6 align-middle text-right">
                                        <div className="inline-flex items-center gap-1 text-zinc-400">
                                            <button
                                                type="button"
                                                title="Edit"
                                                className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title={p.status === 'Hidden' ? 'Unhide' : 'Hide'}
                                                className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                {p.status === 'Hidden' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete"
                                                className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="More"
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

                {/* 6. Thanh phân trang (Pagination)[cite: 8] */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-zinc-900">1 to 7</strong> of <strong className="text-zinc-900">184</strong> products
            </span>
                        <span className="text-zinc-300">|</span>
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-zinc-800 font-semibold focus:outline-none cursor-pointer">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                        </div>
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