import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Factory,
    Truck,
    Scale,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    Clock,
    Ban,
    Loader2,
    X,
    Eye,
    Save
} from 'lucide-react';

const STATUS_MAP = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-800' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700' },
    IN_PRODUCTION: { label: 'Đang sản xuất', color: 'bg-emerald-50 text-emerald-700' },
    QC_INSPECTION: { label: 'Kiểm định QC', color: 'bg-emerald-50 text-emerald-700' },
    SHIPPED: { label: 'Đang vận chuyển', color: 'bg-indigo-50 text-indigo-700' },
    COMPLETED: { label: 'Đã giao hàng', color: 'bg-emerald-50 text-emerald-700' },
    DELIVERED: { label: 'Đã giao hàng', color: 'bg-emerald-50 text-emerald-700' },
    DISPUTED: { label: 'Tranh chấp', color: 'bg-red-50 text-red-600' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-zinc-100 text-zinc-500' }
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [kpis, setKpis] = useState({
        totalOrders: 0,
        inProductionOrders: 0,
        pendingDeliveryOrders: 0,
        disputedOrders: 0
    });

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState('');
    const [isSavingStatus, setIsSavingStatus] = useState(false);

    // 1. Tải số liệu KPIs
    const fetchKpis = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/orders/kpis');
            if (res.ok) {
                const data = await res.json();
                setKpis(data);
            }
        } catch (e) {
            console.error('Lỗi khi fetch KPIs:', e);
        }
    };

    // 2. Tải danh sách đơn hàng
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('size', 10);

            // CHỈ gửi status nếu khác ALL
            if (statusFilter && statusFilter !== 'ALL') {
                params.append('status', statusFilter);
            }

            // CHỈ gửi keyword nếu có nhập chữ
            if (searchKeyword && searchKeyword.trim()) {
                params.append('keyword', searchKeyword.trim());
            }

            const res = await fetch(`http://localhost:8080/api/v1/admin/orders?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            } else {
                console.error("Lỗi fetch:", res.status);
            }
        } catch (e) {
            console.error('Lỗi khi fetch đơn hàng:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKpis();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    // Xử lý tìm kiếm (Enter)
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0);
            fetchOrders();
        }
    };

    // Mở modal xem chi tiết
    const handleViewDetail = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/admin/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrder(data);
                setUpdatingStatus(data.status);
                setIsModalOpen(true);
            }
        } catch (e) {
            console.error('Lỗi fetch chi tiết đơn:', e);
        }
    };

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        setIsSavingStatus(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/admin/orders/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: updatingStatus })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchOrders();
                fetchKpis();
            } else {
                const errData = await res.json().catch(() => null);
                alert(`Lỗi ${res.status}: ${errData?.message || 'Cập nhật thất bại'}`);
            }
        } catch (e) {
            console.error('Lỗi khi cập nhật trạng thái:', e);
            alert('Lỗi kết nối máy chủ backend');
        } finally {
            setIsSavingStatus(false);
        }
    };

    // Format tiền tệ
    const formatVND = (val) => {
        if (!val) return '0 ₫';
        return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
    };

    // Format ngày giờ
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('vi-VN');
    };

    // Badge trạng thái
    const renderStatusBadge = (status) => {
        const conf = STATUS_MAP[status] || { label: status, color: 'bg-zinc-100 text-zinc-700' };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${conf.color}`}>
                {status === 'COMPLETED' || status === 'DELIVERED' ? <Check className="w-3.5 h-3.5" /> : null}
                {status === 'PENDING' ? <Clock className="w-3.5 h-3.5" /> : null}
                {status === 'CANCELLED' ? <Ban className="w-3.5 h-3.5" /> : null}
                {conf.label}
            </span>
        );
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header */}
            <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                    <span>Vận hành</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Đơn hàng</h1>
            </div>

            {/* 2. Dải 4 Card KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">Tổng đơn hàng</span>
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-zinc-800" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tracking-tight text-zinc-950">{kpis.totalOrders}</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">Đang sản xuất</span>
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <Factory className="w-4 h-4 text-zinc-800" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tracking-tight text-zinc-950">{kpis.inProductionOrders}</span>
                        <span className="text-xs text-zinc-500">lô hàng</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">Chờ giao hàng</span>
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <Truck className="w-4 h-4 text-zinc-800" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tracking-tight text-zinc-950">{kpis.pendingDeliveryOrders}</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#fffdfa] shadow-xs border border-amber-200/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">Tranh chấp</span>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Scale className="w-4 h-4 text-amber-800" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tracking-tight text-zinc-950">{kpis.disputedOrders}</span>
                    </div>
                </div>
            </div>

            {/* 3. Toolbar & Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                <div className="p-4 md:p-6 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="search"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Tìm theo mã đơn (#AT-), tên khách, SĐT... (Nhấn Enter)"
                            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] font-medium"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full sm:w-48 h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="IN_PRODUCTION">Đang sản xuất</option>
                            <option value="QC_INSPECTION">Kiểm định QC</option>
                            <option value="SHIPPED">Đang vận chuyển</option>
                            <option value="COMPLETED">Đã giao hàng</option>
                            <option value="CANCELLED">Đã hủy</option>
                            <option value="DISPUTED">Tranh chấp</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                </div>

                {/* Bảng đơn hàng */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[950px]">
                        <thead>
                        <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-y border-zinc-100">
                            <th className="py-3.5 pl-6 pr-3">Mã đơn</th>
                            <th className="py-3.5 px-4">Khách hàng</th>
                            <th className="py-3.5 px-4">Sản phẩm</th>
                            <th className="py-3.5 px-4 text-right">Tổng tiền</th>
                            <th className="py-3.5 px-4">Trạng thái</th>
                            <th className="py-3.5 px-4">Ngày tạo</th>
                            <th className="py-3.5 pr-6 pl-3 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-zinc-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#f0592a] mb-2" />
                                    Đang tải danh sách đơn hàng...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-zinc-400 font-medium">
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            orders.map((ord) => (
                                <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                                    <td className="py-4 pl-6 pr-3 font-bold text-[#f0592a] whitespace-nowrap">
                                        {ord.orderCode}
                                    </td>
                                    <td className="py-4 px-4 min-w-[170px]">
                                        <span className="font-semibold text-zinc-900 block">{ord.customerName}</span>
                                        <span className="text-[11px] text-zinc-400">{ord.customerPhone}</span>
                                    </td>
                                    <td className="py-4 px-4 min-w-[240px]">
                                        <span className="font-semibold text-zinc-900 line-clamp-1">{ord.productName}</span>
                                        <span className="text-[11px] text-zinc-400">{ord.itemsCount} sản phẩm</span>
                                    </td>
                                    <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-zinc-950">
                                        {formatVND(ord.totalAmount)}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        {renderStatusBadge(ord.status)}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                                        {formatDate(ord.createdAt)}
                                    </td>
                                    <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => handleViewDetail(ord.id)}
                                            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-[#f0592a] hover:text-white text-zinc-700 text-[11px] font-semibold transition-colors cursor-pointer"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div>
                        Hiển thị <strong>{orders.length}</strong> / <strong>{totalElements}</strong> đơn hàng
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 bg-[#f0592a] text-white rounded-lg">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MODAL CHI TIẾT & CHỈNH SỬA TRẠNG THÁI */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-base font-bold text-zinc-950">
                                Chi tiết đơn hàng: <span className="text-[#f0592a] font-mono">{selectedOrder.orderCode}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thông tin người nhận */}
                        <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl space-y-1.5 text-xs">
                            <p><strong className="text-zinc-700">Người nhận:</strong> <span className="text-zinc-900 font-medium">{selectedOrder.customerName}</span></p>
                            <p><strong className="text-zinc-700">Số điện thoại:</strong> <span className="text-zinc-900 font-mono">{selectedOrder.customerPhone}</span></p>
                            <p><strong className="text-zinc-700">Địa chỉ giao hàng:</strong> <span className="text-zinc-900">{selectedOrder.shippingAddress}</span></p>
                            <p><strong className="text-zinc-700">Ngày đặt:</strong> <span className="text-zinc-500">{formatDate(selectedOrder.createdAt)}</span></p>
                        </div>

                        {/* DANH SÁCH SẢN PHẨM ĐẶT MUA */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Danh sách sản phẩm ({selectedOrder.items?.length || 0})
                            </div>
                            <div className="border border-zinc-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-zinc-50/75 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase">
                                    <tr>
                                        <th className="py-2.5 px-3">Sản phẩm</th>
                                        <th className="py-2.5 px-3 text-center">SKU</th>
                                        <th className="py-2.5 px-3 text-center">Số lượng</th>
                                        <th className="py-2.5 px-3 text-right">Đơn giá</th>
                                        <th className="py-2.5 px-3 text-right">Thành tiền</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((it, idx) => (
                                            <tr key={idx} className="hover:bg-zinc-50/50">
                                                <td className="py-3 px-3">
                                                    <div className="font-semibold text-zinc-900">{it.productName}</div>
                                                </td>
                                                <td className="py-3 px-3 text-center font-mono text-zinc-500 text-[11px]">
                                                    {it.size || '-'}
                                                </td>
                                                <td className="py-3 px-3 text-center font-semibold text-zinc-800">
                                                    x{it.quantity}
                                                </td>
                                                <td className="py-3 px-3 text-right text-zinc-600">
                                                    {formatVND(it.price)}
                                                </td>
                                                <td className="py-3 px-3 text-right font-bold text-zinc-900">
                                                    {formatVND((it.price || 0) * (it.quantity || 1))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-zinc-400">
                                                Không có thông tin chi tiết sản phẩm
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tổng quan thanh toán */}
                        <div className="space-y-1.5 text-xs border-y border-zinc-100 py-3 bg-zinc-50/30 px-3 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Tạm tính:</span>
                                <span className="font-medium text-zinc-800">{formatVND(selectedOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Phí giao hàng:</span>
                                <span className="font-medium text-zinc-800">{formatVND(selectedOrder.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Giảm giá:</span>
                                <span className="text-red-500 font-medium">-{formatVND(selectedOrder.discountAmount)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm pt-2 border-t border-zinc-200/60">
                                <span className="text-zinc-900">Tổng thanh toán:</span>
                                <span className="text-[#f0592a]">{formatVND(selectedOrder.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Cập nhật trạng thái */}
                        <div className="space-y-2 pt-1">
                            <label className="text-xs font-bold text-zinc-800">Cập nhật trạng thái đơn hàng:</label>
                            <div className="relative">
                                <select
                                    value={updatingStatus}
                                    onChange={(e) => setUpdatingStatus(e.target.value)}
                                    className="w-full h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 appearance-none focus:outline-none focus:border-[#f0592a]"
                                >
                                    <option value="PENDING">Chờ xử lý</option>
                                    <option value="CONFIRMED">Đã xác nhận</option>
                                    <option value="IN_PRODUCTION">Đang sản xuất</option>
                                    <option value="QC_INSPECTION">Kiểm định QC</option>
                                    <option value="SHIPPED">Đang vận chuyển</option>
                                    <option value="COMPLETED">Đã giao hàng (Hoàn thành)</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                    <option value="DISPUTED">Tranh chấp</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                disabled={isSavingStatus}
                                onClick={handleUpdateStatus}
                                className="px-5 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                            >
                                {isSavingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Lưu trạng thái</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}