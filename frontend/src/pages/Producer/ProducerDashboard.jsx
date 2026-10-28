import React, { useState, useEffect } from 'react';
import {
    List,
    Printer,
    CheckCircle2,
    Truck,
    Loader2,
    Check,
    Save,
    Phone,
    MapPin,
    Package,
    Clock,
    History,
    CheckSquare,
    CreditCard,
    Lock
} from 'lucide-react';

const STATUS_TABS = [
    { id: 'all', label: 'Tất cả đơn xưởng' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'in-production', label: 'Đang sản xuất' },
    { id: 'waiting-payment', label: 'Chờ thanh toán' },
    { id: 'shipped', label: 'Đang vận chuyển' },
    { id: 'completed', label: 'Đã giao hàng / Hoàn tất' },
];

// Thứ tự 5 trạng thái tuyến tính chuẩn
const STAGE_ORDER = [
    'CONFIRMED',        // 0: Đã xác nhận
    'IN_PRODUCTION',    // 1: Đang sản xuất
    'WAITING_PAYMENT',  // 2: Chờ thanh toán
    'SHIPPED',          // 3: Đang vận chuyển
    'DELIVERED'         // 4: Đã giao hàng
];

export default function ProducerDashboard() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const [currentStatus, setCurrentStatus] = useState('CONFIRMED');
    const [stageNotes, setStageNotes] = useState('');
    const [trackingCodeInput, setTrackingCodeInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    const formatDateTime = (dtStr) => {
        if (!dtStr) return '';
        const safeIso = typeof dtStr === 'string' && !dtStr.includes('Z') && !dtStr.includes('+')
            ? `${dtStr}Z`
            : dtStr;
        const d = new Date(safeIso);
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const raw = (status || '').toUpperCase();
        switch (raw) {
            case 'CONFIRMED':
            case 'DEPOSITED':
                return { label: 'ĐÃ XÁC NHẬN', className: 'bg-blue-50 text-blue-700 border border-blue-200' };
            case 'IN_PRODUCTION':
                return { label: 'ĐANG SẢN XUẤT', className: 'bg-amber-50 text-amber-800 border border-amber-300' };
            case 'WAITING_PAYMENT':
                return { label: 'CHỜ THANH TOÁN', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-bold' };
            case 'PAID_IN_FULL':
                return { label: 'ĐÃ TẤT TOÁN 100%', className: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold' };
            case 'SHIPPED':
                return { label: 'ĐANG VẬN CHUYỂN', className: 'bg-purple-50 text-purple-700 border border-purple-200' };
            case 'DELIVERED':
            case 'COMPLETED':
                return { label: 'ĐÃ GIAO HÀNG', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
            default:
                return { label: raw || 'ĐÃ XÁC NHẬN', className: 'bg-zinc-100 text-zinc-700 border border-zinc-200' };
        }
    };

    const fetchProducerOrders = async (targetIdToKeep = null) => {
        setIsLoadingList(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders?tab=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                if (data.length > 0) {
                    const keepId = targetIdToKeep || (selectedOrder ? selectedOrder.id : data[0].id);
                    const found = data.find(o => o.id === keepId) || data[0];
                    fetchDetail(found.id);
                } else {
                    setSelectedOrder(null);
                }
            }
        } catch (e) {
            console.error('Lỗi khi fetch đơn hàng:', e);
        } finally {
            setIsLoadingList(false);
        }
    };

    const fetchDetail = async (id) => {
        setIsLoadingDetail(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders/${id}`);
            if (res.ok) {
                const detail = await res.json();
                setSelectedOrder(detail);
                setTrackingCodeInput(detail.trackingCode || '');

                const rawSt = detail.status ? detail.status.toUpperCase() : 'CONFIRMED';
                if (rawSt === 'DEPOSITED') {
                    setCurrentStatus('CONFIRMED');
                } else if (rawSt === 'COMPLETED') {
                    setCurrentStatus('DELIVERED');
                } else if (rawSt === 'PAID_IN_FULL') {
                    setCurrentStatus('WAITING_PAYMENT');
                } else {
                    setCurrentStatus(rawSt);
                }
            }
        } catch (e) {
            console.error('Lỗi khi fetch chi tiết đơn:', e);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    useEffect(() => {
        fetchProducerOrders();
    }, [activeTab]);

    const handleSelectOrder = (id) => {
        setSaveSuccess(false);
        setStageNotes('');
        fetchDetail(id);
    };

    const handleSaveProgress = async () => {
        if (!selectedOrder) return;

        if (currentStatus === 'SHIPPED' && !trackingCodeInput.trim()) {
            alert('Vui lòng nhập Mã vận đơn trước khi chuyển sang trạng thái Đang vận chuyển!');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders/${selectedOrder.id}/progress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: currentStatus,
                    completedUnits: selectedOrder.totalUnits || 0,
                    notes: stageNotes.trim(),
                    trackingCode: trackingCodeInput.trim()
                })
            });

            if (res.ok) {
                setSaveSuccess(true);
                setStageNotes('');
                fetchProducerOrders(selectedOrder.id);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert('Cập nhật tiến độ thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối máy chủ backend');
        } finally {
            setIsSaving(false);
        }
    };

    const getStageIndex = (st) => {
        const upper = st ? st.toUpperCase() : 'CONFIRMED';
        if (upper === 'DEPOSITED' || upper === 'CONFIRMED') return 0;
        if (upper === 'IN_PRODUCTION') return 1;
        if (upper === 'WAITING_PAYMENT' || upper === 'PAID_IN_FULL') return 2;
        if (upper === 'SHIPPED') return 3;
        if (upper === 'DELIVERED' || upper === 'COMPLETED') return 4;
        return 0;
    };

    const currentOrderStageIdx = getStageIndex(selectedOrder?.status);

    // ĐÃ TẤT TOÁN 100%: Khi status là PAID_IN_FULL hoặc đã chuyển sang Vận chuyển / Đã giao hàng
    const isPaidInFull = (selectedOrder?.status || '').toUpperCase() === 'PAID_IN_FULL' || currentOrderStageIdx >= 3;
    const isWaitingPaymentStage = currentOrderStageIdx === 2;
    const isShippedOrDelivered = currentOrderStageIdx >= 3;
    const isDelivered = currentOrderStageIdx === 4; // Trạng thái ĐÃ GIAO HÀNG

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-4 sm:px-8 xl:px-12 space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                            Tiến độ sản xuất và bàn giao xưởng
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
                    {STATUS_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-[#f0592a] text-white font-bold'
                                        : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/70'
                                }`}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full flex flex-col xl:flex-row gap-6 items-start">
                {/* Hàng đợi xưởng */}
                <aside className="w-full xl:w-[380px] 2xl:w-[420px] shrink-0 space-y-4">
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <List className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Hàng đợi sản xuất</h2>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                                {orders.length} Đơn
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                            {isLoadingList ? (
                                <div className="py-12 text-center text-zinc-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#f0592a] mb-2" />
                                    Đang nạp hàng đợi...
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="py-8 text-center text-zinc-400 text-xs">
                                    Không có đơn hàng nào trong tab này.
                                </div>
                            ) : (
                                orders.map((ord) => {
                                    const isSelected = selectedOrder?.id === ord.id;
                                    const badge = getStatusBadge(ord.status);

                                    return (
                                        <div
                                            key={ord.id}
                                            onClick={() => handleSelectOrder(ord.id)}
                                            className={`rounded-xl p-4 transition-all cursor-pointer border ${
                                                isSelected
                                                    ? 'bg-[#faf8e4] border-[#f0592a] shadow-sm ring-1 ring-[#f0592a]'
                                                    : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/70'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badge.className}`}>
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-900 block truncate" title={ord.title}>
                                                        {ord.title || 'Mẫu thiết kế'}
                                                    </span>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <span className="text-xs font-bold text-[#f0592a] block">
                                                        {ord.totalUnits} chiếc
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
                                                <span className={`text-[11px] font-semibold ${ord.isWarning ? 'text-red-600 font-bold' : 'text-zinc-700'}`}>
                                                    {ord.dueDateLabel}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 truncate max-w-[140px]">
                                                    {ord.currentStage}
                                                </span>
                                            </div>

                                            <div className="w-full bg-zinc-200/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        ord.isWarning ? 'bg-red-500' : 'bg-[#f0592a]'
                                                    }`}
                                                    style={{ width: `${ord.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </aside>

                {/* Bảng chi tiết bên phải */}
                <main className="flex-1 w-full space-y-5">
                    {isLoadingDetail ? (
                        <div className="bg-white rounded-2xl p-16 text-center text-zinc-400 border border-zinc-200/70">
                            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#f0592a] mb-2" />
                            Đang tải chi tiết đơn hàng...
                        </div>
                    ) : selectedOrder ? (
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-zinc-200/70 space-y-6">

                            {/* Header chi tiết */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 border-b border-zinc-100 pb-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                        {selectedOrder.previewImageUrl ? (
                                            <img
                                                src={selectedOrder.previewImageUrl}
                                                alt={selectedOrder.title}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <Package className="w-8 h-8 text-zinc-300" />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900">{selectedOrder.title}</h2>

                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-500 mt-2">
                                            <span className="text-zinc-700 font-medium">
                                                Khách nhận: <strong className="text-zinc-900">{selectedOrder.shippingName}</strong>
                                            </span>
                                            {selectedOrder.shippingPhone && (
                                                <span className="flex items-center gap-1 font-mono text-zinc-600">
                                                    <Phone className="w-3.5 h-3.5 text-[#f0592a]" />
                                                    {selectedOrder.shippingPhone}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-zinc-600">
                                                <MapPin className="w-3.5 h-3.5 text-[#f0592a]" />
                                                {selectedOrder.shippingAddress}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BẢNG TỔNG GIÁ TRỊ: ĐỒNG BỘ 100% KHI ĐÃ TẤT TOÁN, ĐANG VẬN CHUYỂN, ĐÃ GIAO HÀNG */}
                                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/70 text-xs space-y-1.5 min-w-[220px]">
                                    <div className="flex justify-between text-zinc-500">
                                        <span>Tổng giá trị:</span>
                                        <strong className="text-zinc-900 font-bold">{formatCurrency(selectedOrder.totalAmount)}</strong>
                                    </div>
                                    <div className="flex justify-between text-emerald-700 font-semibold border-t border-zinc-200/60 pt-1.5">
                                        <span>{isPaidInFull ? 'Đã thanh toán:' : 'Đã cọc 50%:'}</span>
                                        <span className="font-bold">{formatCurrency(isPaidInFull ? selectedOrder.totalAmount : selectedOrder.depositAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400 italic">
                                        <span>Còn lại:</span>
                                        <span className={isPaidInFull ? 'text-emerald-600 font-bold not-italic' : ''}>
                                            {isPaidInFull
                                                ? '0 ₫'
                                                : formatCurrency(Number(selectedOrder.totalAmount || 0) - Number(selectedOrder.depositAmount || 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Kích cỡ & Sản lượng may đo */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Kích cỡ & Sản lượng may đo
                                </h3>
                                <div className="border border-zinc-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-zinc-50 text-[11px] font-semibold text-zinc-400 uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Kích thước</th>
                                            <th className="py-2.5 px-4">Màu phôi</th>
                                            <th className="py-2.5 px-4 text-right">Số lượng</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((it, idx) => (
                                                <tr key={idx} className="hover:bg-zinc-50/50">
                                                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                                                        Size {it.sizeLabel}
                                                    </td>
                                                    <td className="py-3 px-4 text-zinc-600">
                                                        {selectedOrder.garmentColor || 'Cotton tiêu chuẩn'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-[#f0592a]">
                                                        {it.quantity} chiếc
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-4 text-center text-zinc-400">
                                                    Không có phân rã size
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 5 Giai đoạn chuyển giao */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                                        Chuyển giao giai đoạn sản xuất
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                    {[
                                        { val: 'CONFIRMED', label: '1. Đã xác nhận', icon: CheckSquare },
                                        { val: 'IN_PRODUCTION', label: '2. Đang sản xuất', icon: Printer },
                                        { val: 'WAITING_PAYMENT', label: '3. Chờ thanh toán', icon: CreditCard },
                                        { val: 'SHIPPED', label: '4. Đang vận chuyển', icon: Truck },
                                        { val: 'DELIVERED', label: '5. Đã giao hàng', icon: CheckCircle2 },
                                    ].map((st) => {
                                        const targetIdx = getStageIndex(st.val);
                                        const isSelectedInUI = currentStatus === st.val;
                                        const isPassed = targetIdx < currentOrderStageIdx;
                                        const isNextStep = targetIdx === currentOrderStageIdx + 1;
                                        const isCurrentDBStage = targetIdx === currentOrderStageIdx;

                                        let isSelectable = isCurrentDBStage || isNextStep;
                                        if (st.val === 'SHIPPED' && !isPaidInFull && currentOrderStageIdx < 3) {
                                            isSelectable = false;
                                        }

                                        const Icon = st.icon;
                                        return (
                                            <button
                                                key={st.val}
                                                type="button"
                                                disabled={!isSelectable}
                                                onClick={() => {
                                                    if (isSelectable) setCurrentStatus(st.val);
                                                }}
                                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                                                    isSelectedInUI
                                                        ? 'bg-[#f0592a] border-[#f0592a] text-white shadow-xs cursor-pointer'
                                                        : isPassed
                                                            ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-60'
                                                            : isSelectable
                                                                ? 'bg-zinc-50 hover:bg-[#faf8e4] hover:border-[#f0592a] border-zinc-200 text-zinc-800 cursor-pointer shadow-xs'
                                                                : 'bg-zinc-50/50 border-zinc-200 text-zinc-300 cursor-not-allowed opacity-40'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-center">{st.label}</span>
                                                {isCurrentDBStage && (
                                                    <span className={`text-[9px] ${isSelectedInUI ? 'text-white/90' : 'text-[#f0592a]'} font-semibold`}>
                                                        (Hiện tại)
                                                    </span>
                                                )}
                                                {isPassed && <span className="text-[9px] text-zinc-400 font-normal">(Đã qua)</span>}
                                                {isNextStep && isSelectable && (
                                                    <span className="text-[9px] text-emerald-600 font-semibold">(Bước kế tiếp)</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* KHỐI MÃ VẬN ĐƠN */}
                            {currentOrderStageIdx >= 2 && (
                                <div className="space-y-2">
                                    {isWaitingPaymentStage && !isPaidInFull && (
                                        <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
                                            <div className="flex items-center gap-2 text-zinc-600 font-medium">
                                                <Lock className="w-4 h-4 text-zinc-400" />
                                                <span>Mã vận chuyển: Chờ thanh toán</span>
                                            </div>
                                        </div>
                                    )}

                                    {isWaitingPaymentStage && isPaidInFull && (
                                        <div className="bg-[#fffdfa] border border-amber-200/80 rounded-2xl p-4 space-y-2 animate-fadeIn">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                                                    <Truck className="w-4 h-4 text-[#f0592a]" />
                                                    <span>Mã vận đơn giao hàng (Tracking Code)</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={trackingCodeInput}
                                                onChange={(e) => setTrackingCodeInput(e.target.value)}
                                                placeholder="Nhập mã vận đơn (Ví dụ: GHTK-88992019, VTPOST-VN02...)"
                                                className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono font-bold focus:outline-none focus:border-[#f0592a]"
                                            />
                                        </div>
                                    )}

                                    {isShippedOrDelivered && (
                                        <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
                                            <div className="flex items-center gap-2 text-zinc-700">
                                                <Truck className="w-4 h-4 text-[#f0592a]" />
                                                <span className="font-bold">Mã vận đơn giao hàng:</span>
                                                <span className="font-mono font-extrabold text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200">
                                                    {trackingCodeInput || selectedOrder.trackingCode || 'Chưa có mã vận đơn'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* KHỐI NHẬP GHI CHÚ & NÚT ĐỒNG BỘ: TỰ ĐỘNG ẨN KHI ĐƠN ĐÃ Ở BƯỚC 5 "ĐÃ GIAO HÀNG" */}
                            {!isDelivered ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                                            Nhật ký tiến độ mới
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={stageNotes}
                                            onChange={(e) => setStageNotes(e.target.value)}
                                            placeholder="Nhập ghi chú cho giai đoạn này..."
                                            className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#f0592a] font-medium"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100">
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={handleSaveProgress}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : saveSuccess ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            <span>{saveSuccess ? 'Đã đồng bộ thành công!' : 'Đồng bộ tiến độ & Nhật ký'}</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div></div>
                            )}

                            {/* Lịch sử */}
                            {selectedOrder.progressHistory && selectedOrder.progressHistory.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <History className="w-4 h-4 text-[#f0592a]" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                            Lịch sử cập nhật tiến độ ({selectedOrder.progressHistory.length})
                                        </h3>
                                    </div>

                                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                        {selectedOrder.progressHistory.map((h, i) => (
                                            <div key={i} className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-xs flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-[#f0592a]">{h.stage || 'Cập nhật tiến độ'}</span>
                                                    <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDateTime(h.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-zinc-700 leading-relaxed italic">{h.note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-16 text-center text-zinc-400 border border-zinc-200/70">
                            Vui lòng chọn một đơn hàng từ hàng đợi bên trái để quản lý tiến độ.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}