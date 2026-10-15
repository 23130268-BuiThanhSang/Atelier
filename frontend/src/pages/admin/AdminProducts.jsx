import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Box,
    CheckCircle2,
    AlertTriangle,
    PackageX,
    Search,
    ChevronDown,
    Star,
    Edit,
    Eye,
    EyeOff,
    Trash2,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
    const [selectedIds, setSelectedIds] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 7;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [productData, setProductData] = useState({
        kpis: { totalCategories: 0, activeCount: 0, lowStockCount: 0, outOfStockCount: 0 },
        items: [],
        totalElements: 0,
        totalPages: 1
    });

    // 1. Gọi API lấy danh sách sản phẩm
    const fetchAdminProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                size: pageSize
            });
            if (searchKeyword.trim()) params.append('keyword', searchKeyword.trim());
            if (statusFilter !== 'Tất cả trạng thái') params.append('status', statusFilter);

            const res = await fetch(`http://localhost:8080/api/v1/admin/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProductData(data);
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách sản phẩm:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchKeyword, statusFilter]);

    useEffect(() => {
        fetchAdminProducts();
    }, [fetchAdminProducts]);

    // Format tiền tệ
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
    };

    // 2. Thao tác ẩn/hiện sản phẩm
    const handleToggleStatus = async (product) => {
        const nextStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const res = await fetch('/api/v1/admin/products/bulk-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productIds: [product.id],
                    targetStatus: nextStatus
                })
            });

            if (res.ok) {
                // Tải lại dữ liệu ngay lập tức
                fetchAdminProducts();
            } else {
                console.error('Lỗi khi đổi trạng thái đơn lẻ:', res.status);
            }
        } catch (err) {
            console.error('Lỗi kết nối khi đổi trạng thái:', err);
        }
    };

    // 3. Thao tác hàng loạt (Bulk)
    const handleBulkStatus = async (targetStatus) => {
        if (!selectedIds.length) return;
        try {
            const res = await fetch('/api/v1/admin/products/bulk-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: selectedIds, targetStatus })
            });
            if (res.ok) {
                setSelectedIds([]);
                fetchAdminProducts();
            }
        } catch (err) {
            console.error('Lỗi bulk status:', err);
        }
    };

    // 4. Chọn checkbox
    const toggleSelectAll = () => {
        if (selectedIds.length === productData.items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(productData.items.map(p => p.id));
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 4 KPI Stats
    const kpis = [
        { title: 'Tổng danh mục', value: `${productData.kpis.totalCategories} mục`, icon: Box, iconColor: 'text-zinc-500', bgIcon: 'bg-zinc-100' },
        { title: 'Đang mở bán', value: productData.kpis.activeCount, icon: CheckCircle2, iconColor: 'text-emerald-700', bgIcon: 'bg-emerald-50' },
        { title: 'Sắp hết hàng (<20)', value: productData.kpis.lowStockCount, icon: AlertTriangle, iconColor: 'text-amber-800', bgIcon: 'bg-amber-50' },
        { title: 'Hết hàng', value: productData.kpis.outOfStockCount, icon: PackageX, iconColor: 'text-red-600', bgIcon: 'bg-red-50' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span>Danh mục & Kho hàng</span>
                        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f0592a]" />}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Sản phẩm</h1>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products/new')}
                        className="h-11 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>
            </div>

            {/* Bốn Card KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-zinc-200/70 shadow-xs flex items-center justify-between">
                            <div>
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">{kpi.title}</span>
                                <div className="text-lg font-bold text-zinc-950 tracking-tight mt-0.5">{kpi.value}</div>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bgIcon} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toolbar bộ lọc & tìm kiếm */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-zinc-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            setCurrentPage(0);
                        }}
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] transition-all font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Trạng thái */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                        >
                            <option>Tất cả trạng thái</option>
                            <option>Đang bán</option>
                            <option>Đang ẩn</option>
                            <option>Hết hàng</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Thanh thao tác hàng loạt */}
            {selectedIds.length > 0 && (
                <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#f0592a] flex items-center justify-center text-white text-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">Đã chọn {selectedIds.length} sản phẩm</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleBulkStatus('ACTIVE')}
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                        >
                            Mở bán hàng loạt
                        </button>
                        <button
                            type="button"
                            onClick={() => handleBulkStatus('INACTIVE')}
                            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                        >
                            Ẩn hàng loạt
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

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[1020px]">
                        <thead>
                        <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-b border-zinc-100">
                            <th className="py-3.5 pl-6 pr-3 w-12 text-center">
                                <input
                                    type="checkbox"
                                    checked={productData.items.length > 0 && selectedIds.length === productData.items.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                />
                            </th>
                            <th className="py-3.5 px-4">Thông tin sản phẩm</th>
                            <th className="py-3.5 px-4">Danh mục</th>
                            <th className="py-3.5 px-4">Giá bán</th>
                            <th className="py-3.5 px-4">Mức tồn kho</th>
                            <th className="py-3.5 px-4">Trạng thái</th>
                            <th className="py-3.5 pl-4 pr-6 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {productData.items.map((p) => {
                            const isSelected = selectedIds.includes(p.id);

                            let barColor = 'bg-emerald-600';
                            let textColor = 'text-emerald-700';
                            let label = p.totalStock === 0 ? '0 chiếc' : `Còn ${p.totalStock} chiếc`;

                            if (p.stockStatus === 'hidden') {
                                barColor = 'bg-zinc-500';
                                textColor = 'text-zinc-600 font-semibold';
                                if (p.totalStock === 0) label = '0 chiếc';
                            } else if (p.stockStatus === 'out-of-stock' || p.totalStock === 0) {
                                barColor = 'bg-red-600';
                                textColor = 'text-red-600 font-semibold';
                                label = '0 chiếc';
                            } else if (p.stockStatus === 'low-stock') {
                                barColor = 'bg-amber-600';
                                textColor = 'text-amber-800 font-semibold';
                                label = `Còn ${p.totalStock} (Sắp hết)`;
                            }

                            return (
                                <tr
                                    key={p.id}
                                    className={`transition-colors ${isSelected ? 'bg-[#fefccf]/40 hover:bg-[#fefccf]/60' : 'hover:bg-zinc-50/70'}`}
                                >
                                    <td className="py-4 pl-6 pr-3 text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelectRow(p.id)}
                                            className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-4 px-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-100 shrink-0 overflow-hidden relative border border-zinc-200/70 shadow-2xs">
                                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0 max-w-xs">
                                                <span className="font-semibold text-zinc-950 truncate">{p.name}</span>
                                                {p.featured && <Star className="w-3.5 h-3.5 fill-[#f0592a] text-[#f0592a] shrink-0" />}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 align-middle font-medium text-zinc-700">{p.categoryName}</td>
                                    <td className="py-4 px-4 align-middle font-bold text-[#f0592a]">{formatCurrency(p.price)}</td>
                                    <td className="py-4 px-4 align-middle">
                                        <div className="flex flex-col gap-1 w-28">
                                            <span className={`text-[11px] ${textColor}`}>{label}</span>
                                            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${p.stockPercent}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 align-middle">
                                        {p.status === 'ACTIVE' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700">Đang bán</span>
                                        )}
                                        {p.status === 'INACTIVE' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-zinc-100 text-zinc-700">Đang ẩn</span>
                                        )}
                                        {p.status === 'OUT_OF_STOCK' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-red-50 text-red-600">Hết hàng</span>
                                        )}
                                    </td>
                                    <td className="py-4 pl-4 pr-6 align-middle text-right">
                                        <div className="inline-flex items-center gap-1.5 text-zinc-400">
                                            {/* 1. Nút Chỉnh sửa: Điều hướng sang trang edit */}
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                                                title="Chỉnh sửa sản phẩm"
                                                className="p-1.5 hover:text-[#f0592a] hover:bg-[#fefccf]/60 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            {/* 2. Nút Mắt: Chuyển đổi nhanh trạng thái Đang bán / Đang ẩn */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(p);
                                                }}
                                                title={p.status === 'INACTIVE' ? 'Nhấn để mở bán' : 'Nhấn để ẩn sản phẩm'}
                                                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                                            >
                                                {p.status === 'INACTIVE' ? (
                                                    <EyeOff className="w-4 h-4 text-zinc-400 hover:text-zinc-700 pointer-events-none" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-emerald-600 hover:text-emerald-700 pointer-events-none" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div>
                        Hiển thị <strong className="text-zinc-900">{productData.items.length ? currentPage * pageSize + 1 : 0} đến {Math.min((currentPage + 1) * pageSize, productData.totalElements)}</strong> trong <strong className="text-zinc-900">{productData.totalElements}</strong> sản phẩm
                    </div>

                    <div className="flex items-center gap-1 font-semibold">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-700 bg-white border border-zinc-200 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: productData.totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentPage === idx ? 'bg-[#f0592a] text-white shadow-xs' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage >= productData.totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 disabled:opacity-40 hover:bg-zinc-100 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}