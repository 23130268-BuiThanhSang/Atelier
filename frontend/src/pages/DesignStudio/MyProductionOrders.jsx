import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    Factory,
    CheckCircle2,
    Calendar,
    Phone,
    MapPin,
    Package,
    Loader2,
    Inbox,
    History,
    Printer,
    Truck,
    ChevronDown,
    ChevronUp,
    Sparkles,
    CreditCard,
    X,
    CheckSquare
} from 'lucide-react';
import { proposalApi } from '../../api/proposalApi';

// Danh sách 5 công đoạn chuẩn
const PRODUCTION_STAGES = [
    { key: 'CONFIRMED', label: 'Đã xác nhận', icon: CheckSquare },
    { key: 'IN_PRODUCTION', label: 'Đang sản xuất', icon: Printer },
    { key: 'WAITING_PAYMENT', label: 'Chờ thanh toán', icon: CreditCard },
    { key: 'SHIPPED', label: 'Đang vận chuyển', icon: Truck },
    { key: 'DELIVERED', label: 'Đã giao hàng', icon: CheckCircle2 },
];

export default function MyProductionOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const [payModal, setPayModal] = useState({
        isOpen: false,
        order: null,
        paymentMethod: 'VNPAY'
    });
    const [isPaying, setIsPaying] = useState(false);

    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        orderCode: '',
        message: ''
    });

    const closeAlert = () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        fetchOrders();
    };

    const getLoggedInUserId = () => {
        try {
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            if (stored.id || stored.userId) return Number(stored.id || stored.userId);
        } catch (e) {}
        const directId = localStorage.getItem('userId') || localStorage.getItem('currentUserId');
        return directId ? Number(directId) : null;
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const currentUserId = getLoggedInUserId();
            const targetId = currentUserId ? Number(currentUserId) : 1;
            const data = await proposalApi.getMyOrders(targetId);
            const list = Array.isArray(data) ? data : [];
            setOrders(list);
            if (list.length > 0 && !expandedOrderId) {
                setExpandedOrderId(list[0].id);
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách đơn gia công:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Đang cập nhật';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const getStageIndex = (st) => {
        const upper = (st || '').toUpperCase();
        if (upper === 'DEPOSITED' || upper === 'CONFIRMED' || upper === 'PREPARING_FABRIC') return 0;
        if (upper === 'IN_PRODUCTION') return 1;
        if (upper === 'WAITING_PAYMENT') return 2;
        if (upper === 'SHIPPED') return 3;
        if (upper === 'DELIVERED' || upper === 'COMPLETED') return 4;
        return 0;
    };

    const toggleExpand = (id) => {
        setExpandedOrderId(prev => prev === id ? null : id);
    };

    const handleOpenPayModal = (order) => {
        setPayModal({
            isOpen: true,
            order,
            paymentMethod: 'VNPAY'
        });
    };

    const handleConfirmPayment = async () => {
        if (!payModal.order) return;

        const currentUserId = getLoggedInUserId() || 1;
        setIsPaying(true);

        try {
            const payload = {
                productionOrderId: payModal.order.id,
                userId: currentUserId,
                paymentMethod: payModal.paymentMethod
            };

            const res = await proposalApi.payRemaining(payload, currentUserId);

            setPayModal({ isOpen: false, order: null, paymentMethod: 'VNPAY' });

            setAlertModal({
                isOpen: true,
                type: 'success',
                title: 'Tất toán thành công!',
                orderCode: res.orderCode || payModal.order.orderCode,
                message: res.message || 'Đơn gia công đã được thanh toán 100%. Xưởng may đang tiến hành giao hàng đến bạn.'
            });

        } catch (err) {
            console.error('Lỗi khi thanh toán tất toán:', err);
            setAlertModal({
                isOpen: true,
                type: 'error',
                title: 'Thanh toán thất bại',
                orderCode: payModal.order?.orderCode || '',
                message: err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thực hiện thanh toán.'
            });
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-8 px-4 sm:px-8 xl:px-14 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <Factory className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-0.5">
                            <Link to="/my-designs" className="hover:text-[#f0592a] transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Thiết kế của tôi</span>
                            </Link>
                            <span>&gt;</span>
                            <span className="text-zinc-800">Đơn đặt may gia công</span>
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-950">
                            Tiến độ gia công sản xuất
                        </h1>
                    </div>
                </div>

                <div className="text-xs font-bold bg-[#faf8e4] text-[#f0592a] px-4 py-2 rounded-xl border border-[#f0592a]/20">
                    Tổng cộng: {orders.length} đơn sản xuất
                </div>
            </div>

            {isLoading && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f0592a] mx-auto mb-3" />
                    <p className="text-xs font-bold text-zinc-700">Đang đồng bộ tiến độ từ các xưởng may...</p>
                </div>
            )}

            {!isLoading && orders.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70 space-y-3">
                    <Inbox className="w-12 h-12 text-zinc-300 mx-auto" />
                    <h3 className="text-base font-bold text-zinc-900">Chưa có đơn gia công nào đang chạy</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Sau khi bạn chấp thuận báo giá từ xưởng may và đặt cọc 50%, đơn sản xuất sẽ xuất hiện tại đây để theo dõi tiến độ.
                    </p>
                    <Link
                        to="/my-designs"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] mt-2 cursor-pointer"
                    >
                        <span>Quay lại trang Thiết kế của tôi</span>
                    </Link>
                </div>
            )}

            {!isLoading && orders.length > 0 && (
                <div className="space-y-5">
                    {orders.map((ord) => {
                        const rawStatus = (ord.status || '').toUpperCase();
                        const currentStageIdx = getStageIndex(ord.status);
                        const isExpanded = expandedOrderId === ord.id;

                        // Kiểm tra đơn đã hoàn tất tất toán chưa:
                        // 1. Trạng thái là PAID_IN_FULL
                        // 2. Hoặc đơn đã sang bước SHIPPED / DELIVERED
                        // 3. Hoặc tiền còn lại <= 0
                        const isPaidInFull = rawStatus === 'PAID_IN_FULL' ||
                            currentStageIdx >= 3 ||
                            (Number(ord.remainingAmount || 0) <= 0);

                        // CHỈ HIỂN THỊ NÚT THANH TOÁN KHI:
                        // - Trạng thái chính xác là "WAITING_PAYMENT" (hoặc stage index == 2)
                        // - VÀ CHƯA THANH TOÁN 100%
                        const canPayRemaining = !isPaidInFull && (rawStatus === 'WAITING_PAYMENT' || currentStageIdx === 2);

                        return (
                            <div
                                key={ord.id}
                                className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/80 space-y-5 relative overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="text-xs font-bold text-zinc-400">Mã đơn:</span>
                                        <span className="text-sm font-extrabold text-[#f0592a] bg-[#fefccf] px-2.5 py-1 rounded-lg border border-[#f0592a]/20 font-mono">
                                            #{ord.orderCode}
                                        </span>
                                        <span className="text-xs text-zinc-600 font-semibold">• Xưởng may: <strong className="text-zinc-900">{ord.producerName}</strong></span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(ord.id)}
                                            className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
                                            title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                                        >
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* STEPPER 5 CÔNG ĐOẠN */}
                                <div className="py-2 px-2 sm:px-6">
                                    <div className="grid grid-cols-5 relative">
                                        <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-zinc-100 -z-0 rounded-full" />
                                        <div
                                            className="absolute top-4 left-[10%] h-1 bg-[#f0592a] -z-0 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(currentStageIdx / (PRODUCTION_STAGES.length - 1)) * 80}%`
                                            }}
                                        />

                                        {PRODUCTION_STAGES.map((st, idx) => {
                                            const isPassed = idx < currentStageIdx;
                                            const isCurrent = idx === currentStageIdx;
                                            const Icon = st.icon;

                                            return (
                                                <div key={st.key} className="flex flex-col items-center text-center z-10">
                                                    <div
                                                        className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                                                            isPassed || (isPaidInFull && idx <= 2)
                                                                ? 'bg-emerald-600 text-white shadow-2xs'
                                                                : isCurrent
                                                                    ? 'bg-[#f0592a] text-white ring-4 ring-[#fefccf] shadow-sm'
                                                                    : 'bg-zinc-100 text-zinc-400'
                                                        }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span
                                                        className={`text-[11px] mt-2 font-bold max-w-[90px] leading-tight ${
                                                            isCurrent
                                                                ? 'text-[#f0592a]'
                                                                : isPassed || (isPaidInFull && idx <= 2)
                                                                    ? 'text-zinc-900'
                                                                    : 'text-zinc-400 font-normal'
                                                        }`}
                                                    >
                                                        {st.label}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="text-[9px] text-[#f0592a] font-semibold mt-0.5">
                                                            (Hiện tại)
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Chi tiết sản phẩm & tài chính */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-2">
                                    <div className="lg:col-span-3 bg-zinc-50 rounded-2xl p-3 border border-zinc-200/60 flex flex-col items-center">
                                        <div className="w-full h-40 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-zinc-100 p-2">
                                            {ord.previewImageUrl ? (
                                                <img
                                                    src={ord.previewImageUrl}
                                                    alt={ord.designName}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-zinc-300" />
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold text-zinc-900 mt-2 truncate max-w-full text-center">
                                            {ord.designName}
                                        </h4>
                                    </div>

                                    <div className="lg:col-span-5 space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Giai đoạn hiện tại của xưởng:</span>
                                            <strong className="text-[#f0592a]">{ord.currentStage || 'Đã xác nhận'}</strong>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Hạn chót xưởng cam kết:</span>
                                            <span className="font-bold text-zinc-800 flex items-center gap-1">
                                                {formatDate(ord.deadline)}
                                            </span>
                                        </div>

                                        {/* HIỂN THỊ MÃ VẬN ĐƠN KHI ĐƠN Ở BƯỚC ĐANG VẬN CHUYỂN HOẶC ĐÃ GIAO HÀNG */}
                                        {(currentStageIdx >= 3 || rawStatus === 'SHIPPED' || rawStatus === 'DELIVERED') && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500">Mã vận đơn:</span>
                                                <strong className="text-[#f0592a]">{ord.trackingCode ? ord.trackingCode : 'Đang cập nhật...'}</strong>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-zinc-100">
                                            <span className="font-bold text-zinc-700 block mb-1">
                                                Sản lượng đặt may: <strong className="text-[#f0592a]">{ord.totalQuantity} chiếc</strong>
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {ord.items?.map((it) => (
                                                    <div
                                                        key={it.sizeLabel}
                                                        className="px-2.5 py-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-zinc-800 text-[11px] font-bold"
                                                    >
                                                        Size {it.sizeLabel}: <span className="text-[#f0592a]">{it.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Khối tài chính */}
                                    <div className="lg:col-span-4 bg-[#fffdfa] p-4 rounded-2xl border border-amber-200/80 space-y-2.5 text-xs">
                                        <div className="flex justify-between text-zinc-600">
                                            <span>Tổng giá trị đơn hàng:</span>
                                            <strong className="text-zinc-950 font-bold">{formatCurrency(ord.totalAmount)}</strong>
                                        </div>
                                        <div className="flex justify-between text-emerald-700 font-semibold border-t border-amber-100 pt-1.5">
                                            <span>Đã thanh toán:</span>
                                            <span>{formatCurrency(isPaidInFull ? ord.totalAmount : ord.depositAmount)}</span>
                                        </div>

                                        {isPaidInFull ? (
                                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                                                <span>Đơn hàng đã được thanh toán 100%</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-[#f0592a] font-bold bg-[#fefccf] p-2 rounded-xl border border-[#f0592a]/20">
                                                    <span>Còn lại cần thanh toán (50%):</span>
                                                    <span>{formatCurrency(ord.remainingAmount)}</span>
                                                </div>

                                                {/* CHỈ HIỂN THỊ NÚT KHI ĐANG Ở BƯỚC "CHỜ THANH TOÁN" VÀ CHƯA TẤT TOÁN */}
                                                {canPayRemaining ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenPayModal(ord)}
                                                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] bg-[#f0592a] hover:bg-[#d94a1f] text-white cursor-pointer ring-2 ring-[#f0592a]/20"
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>Thanh toán 50% còn lại</span>
                                                    </button>
                                                ) : (
                                                    <div className="py-2.5 px-3 rounded-xl bg-zinc-100 text-zinc-500 text-center text-[11px] font-medium border border-zinc-200/60">
                                                        <span>Chờ xưởng hoàn tất để thanh toán</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Lịch sử tiến độ */}
                                {isExpanded && (
                                    <div className="pt-4 border-t border-zinc-100 space-y-3 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <History className="w-4 h-4 text-[#f0592a]" />
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                                    Nhật ký cập nhật từ xưởng ({ord.progressHistory?.length || 0})
                                                </h4>
                                            </div>
                                        </div>

                                        {(!ord.progressHistory || ord.progressHistory.length === 0) ? (
                                            <p className="text-xs text-zinc-400 italic p-3 bg-zinc-50 rounded-xl text-center">
                                                Chưa có cập nhật mới từ xưởng.
                                            </p>
                                        ) : (
                                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                                {ord.progressHistory.map((logItem, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-xs space-y-1"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <strong className="text-[#f0592a] font-bold">
                                                                {logItem.stage}
                                                            </strong>
                                                            <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                                                                <Clock className="w-3 h-3" />
                                                                {formatDateTime(logItem.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-zinc-700 leading-relaxed italic">
                                                            "{logItem.note}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal thanh toán 50% */}
            {payModal.isOpen && payModal.order && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-md w-full p-6 relative overflow-hidden animate-scaleIn">
                        <button
                            type="button"
                            onClick={() => setPayModal({ isOpen: false, order: null, paymentMethod: 'VNPAY' })}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#fefccf] text-[#f0592a] flex items-center justify-center font-bold">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-950">Tất toán đơn gia công (50% còn lại)</h3>
                                    <p className="text-xs text-zinc-500">Mã đơn: #{payModal.order.orderCode}</p>
                                </div>
                            </div>

                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/70 space-y-2 text-xs">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Tổng giá trị đơn:</span>
                                    <strong className="text-zinc-900">{formatCurrency(payModal.order.totalAmount)}</strong>
                                </div>
                                <div className="flex justify-between text-zinc-600">
                                    <span>Đã thanh toán cọc đợt 1:</span>
                                    <span className="text-emerald-600 font-semibold">{formatCurrency(payModal.order.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-[#fefccf] p-2.5 rounded-xl border border-[#f0592a]/20 mt-1">
                                    <span className="font-bold text-zinc-800">Số tiền cần tất toán:</span>
                                    <span className="font-extrabold text-[#f0592a] text-base">
                                        {formatCurrency(payModal.order.remainingAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-700">Phương thức thanh toán</span>
                                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                        Thử nghiệm
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <label
                                        onClick={() => setPayModal({ ...payModal, paymentMethod: 'VNPAY' })}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                            payModal.paymentMethod === 'VNPAY'
                                                ? 'border-[#f0592a] bg-[#faf8e4]/50'
                                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payMethodFinal"
                                            checked={payModal.paymentMethod === 'VNPAY'}
                                            onChange={() => {}}
                                            className="accent-[#f0592a]"
                                        />
                                        <span className="font-semibold text-zinc-800">Cổng VNPAY / QR</span>
                                    </label>

                                    <label
                                        onClick={() => setPayModal({ ...payModal, paymentMethod: 'MOMO' })}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                            payModal.paymentMethod === 'MOMO'
                                                ? 'border-[#f0592a] bg-[#faf8e4]/50'
                                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payMethodFinal"
                                            checked={payModal.paymentMethod === 'MOMO'}
                                            onChange={() => {}}
                                            className="accent-[#f0592a]"
                                        />
                                        <span className="font-semibold text-zinc-800">Ví MoMo / Thẻ</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setPayModal({ isOpen: false, order: null, paymentMethod: 'VNPAY' })}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    disabled={isPaying}
                                    onClick={handleConfirmPayment}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#f0592a] hover:bg-[#d94a1f] disabled:bg-zinc-400 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    {isPaying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Xác nhận tất toán</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thông báo kết quả */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-sm w-full p-6 relative overflow-hidden animate-scaleIn text-center">
                        <button
                            type="button"
                            onClick={closeAlert}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
                                    alertModal.type === 'success'
                                        ? 'bg-[#fefccf] text-[#f0592a] border-[#f0592a]/20 text-3xl'
                                        : 'bg-red-50 text-red-500 border-red-200 text-3xl'
                                }`}
                            >
                                {alertModal.type === 'success' ? '🎉' : '⚠️'}
                            </div>

                            <h3 className="text-lg font-bold text-zinc-950">
                                {alertModal.title}
                            </h3>

                            {alertModal.orderCode && (
                                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/70 inline-block font-mono">
                                    <span className="text-[11px] text-zinc-500">Mã đơn: </span>
                                    <strong className="text-xs font-bold text-[#f0592a]">
                                        #{alertModal.orderCode}
                                    </strong>
                                </div>
                            )}

                            <p className="text-xs text-zinc-600 mt-3 leading-relaxed px-2">
                                {alertModal.message}
                            </p>

                            <div className="w-full mt-6">
                                <button
                                    type="button"
                                    onClick={closeAlert}
                                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#f0592a] hover:bg-[#d94a1f] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                                >
                                    Đã hiểu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}