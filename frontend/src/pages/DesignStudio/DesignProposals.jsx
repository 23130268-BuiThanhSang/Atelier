import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Sliders,
    Layers,
    Clock,
    DollarSign,
    Sparkles,
    CheckCircle2,
    PauseCircle,
    PlayCircle,
    Loader2,
    Calendar,
    ArrowUpRight,
    Download,
    X,
    AlertCircle
} from 'lucide-react';
import { proposalApi } from '../../api/proposalApi';

export default function DesignProposals() {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    // Hỗ trợ bắt cả params :id lẫn :designId hoặc từ state điều hướng
    const rawDesignId = params.id || params.designId || location.state?.designId;
    const designId = rawDesignId && rawDesignId !== 'undefined' ? Number(rawDesignId) : null;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState(null);

    // Bảng size & số lượng người dùng có thể tự chỉnh
    const [sizeBreakdown, setSizeBreakdown] = useState([
        { sizeLabel: 'S', quantity: 0 },
        { sizeLabel: 'M', quantity: 0 },
        { sizeLabel: 'L', quantity: 0 },
        { sizeLabel: 'XL', quantity: 0 },
        { sizeLabel: '2XL', quantity: 0 },
    ]);

    // State cho Modal Đặt cọc 50%
    const [depositModal, setDepositModal] = useState({
        isOpen: false,
        quotation: null,
        shippingName: '',
        shippingPhone: '',
        shippingAddress: '',
        paymentMethod: 'VNPAY' // 'VNPAY' hoặc 'MOMO'
    });
    const [isDepositing, setIsDepositing] = useState(false);

    // State cho Modal thông báo đẹp ở giữa màn hình
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'error'
        title: '',
        orderCode: '',
        message: ''
    });

    const closeAlert = () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        loadData(); // Tải lại dữ liệu trang sau khi đóng thông báo
    };

    const getLoggedInUserId = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const id = parsed.id || parsed.userId;
                if (id) return Number(id);
            }
        } catch (e) {}
        const directId = localStorage.getItem('userId') || localStorage.getItem('currentUserId');
        return directId ? Number(directId) : null;
    };

    const loadData = async () => {
        if (!designId) {
            console.warn('Không xác định được designId hợp lệ trên URL.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const currentUserId = getLoggedInUserId();
            const res = await proposalApi.getDetailForDesigner(designId, currentUserId);
            if (res) {
                setData(res);
                if (res.sizeBreakdown && res.sizeBreakdown.length > 0) {
                    setSizeBreakdown(res.sizeBreakdown);
                }
            }
        } catch (err) {
            console.error('Không thể nạp dữ liệu báo giá:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [designId]);

    // Thay đổi số lượng từng size
    const handleQuantityChange = (size, qty) => {
        const val = Math.max(0, parseInt(qty, 10) || 0);
        setSizeBreakdown(prev => prev.map(s => s.sizeLabel === size ? { ...s, quantity: val } : s));
    };

    const totalCalculatedQuantity = sizeBreakdown.reduce((sum, s) => sum + (s.quantity || 0), 0);

    // Xử lý Bắt đầu nhận giá / Tạm dừng nhận giá
    const handleToggleStatus = async () => {
        if (totalCalculatedQuantity <= 0) {
            setAlertModal({
                isOpen: true,
                type: 'error',
                title: 'Số lượng không hợp lệ',
                orderCode: '',
                message: 'Vui lòng nhập số lượng lớn hơn 0 cho ít nhất 1 size để bắt đầu nhận báo giá.'
            });
            return;
        }

        const currentUserId = getLoggedInUserId();

        setIsSubmitting(true);
        try {
            const payload = {
                designId: Number(designId),
                designVersionId: data?.designVersionId || location.state?.versionId || null,
                userId: currentUserId,
                garmentColor: data?.garmentColor || location.state?.garmentColor || '#77C1F9',
                printSides: data?.printSides || 'In Kỹ thuật số DTF 2 Mặt',
                sizeQuantities: sizeBreakdown
            };

            const updated = await proposalApi.toggleStatus(payload, currentUserId);
            if (updated) {
                setData(updated);
            }
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái nhận giá:', err);
            setAlertModal({
                isOpen: true,
                type: 'error',
                title: 'Cập nhật thất bại',
                orderCode: '',
                message: 'Có lỗi xảy ra khi cập nhật trạng thái nhận giá. Vui lòng kiểm tra lại kết nối.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mở modal khi bấm "Chấp thuận báo giá"
    const handleOpenDepositModal = (quotation) => {
        setDepositModal({
            isOpen: true,
            quotation,
            shippingName: '',
            shippingPhone: '',
            shippingAddress: '',
            paymentMethod: 'VNPAY'
        });
    };

    // Xác nhận cọc 50% và tạo đơn sản xuất
    const handleConfirmDeposit = async () => {
        if (!depositModal.quotation) return;

        const currentUserId = getLoggedInUserId();
        if (!currentUserId) {
            setAlertModal({
                isOpen: true,
                type: 'error',
                title: 'Chưa đăng nhập',
                orderCode: '',
                message: 'Vui lòng đăng nhập lại tài khoản để thực hiện đặt cọc.'
            });
            return;
        }

        setIsDepositing(true);
        try {
            // Gửi trực tiếp giá trị người dùng vừa nhập trong Modal
            const payload = {
                quotationId: depositModal.quotation.quotationId,
                requestId: data?.requestId,
                userId: currentUserId,
                shippingName: depositModal.shippingName.trim(),
                shippingPhone: depositModal.shippingPhone.trim(),
                shippingAddress: depositModal.shippingAddress.trim()
            };

            const res = await proposalApi.acceptAndDeposit(payload, currentUserId);

            // Đóng modal đặt cọc
            setDepositModal({ isOpen: false, quotation: null });

            // Bật Modal thông báo thành công
            setAlertModal({
                isOpen: true,
                type: 'success',
                title: 'Đặt cọc thành công!',
                orderCode: res.orderCode || '',
                message: res.message || 'Đơn gia công đã được chuyển đến xưởng may để chuẩn bị vật tư.'
            });
        } catch (err) {
            console.error('Lỗi khi chấp thuận và đặt cọc:', err);
            setAlertModal({
                isOpen: true,
                type: 'error',
                title: 'Đặt cọc thất bại',
                orderCode: '',
                message: err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận đặt cọc. Vui lòng thử lại sau.'
            });
        } finally {
            setIsDepositing(false);
        }
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fefccf] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#f0592a]" />
            </div>
        );
    }

    const isOpen = data?.status === 'OPEN';
    const isClosed = data?.status === 'CLOSED';
    const displayTitle = data?.designName || location.state?.title || 'Mẫu thiết kế';
    const displayPreview = data?.previewImageUrl || location.state?.previewUrl;
    const displayColor = data?.garmentColor || location.state?.garmentColor || '#77C1F9';

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-3 sm:px-6 xl:px-12 space-y-6">
            {/* 1. THANH TIÊU ĐỀ & NÚT TRẠNG THÁI */}
            <div className="w-full bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                        <Link to="/my-designs" className="hover:text-[#f0592a] transition-colors">Thiết kế</Link>
                        <span>&gt;</span>
                        <span className="text-zinc-800">Nhận báo giá</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                        {displayTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={isSubmitting || isClosed}
                        className={`h-11 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                            isClosed
                                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                                : isOpen
                                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                                    : 'bg-[#f0592a] hover:bg-[#d94a1f] text-white'
                        }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isClosed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isOpen ? (
                            <PauseCircle className="w-4 h-4 text-zinc-500" />
                        ) : (
                            <PlayCircle className="w-4 h-4" />
                        )}
                        <span>
                            {isClosed
                                ? 'Đã chốt xưởng sản xuất'
                                : isOpen
                                    ? 'Tạm ngưng nhận giá'
                                    : 'Bắt đầu nhận giá'}
                        </span>
                    </button>
                </div>
            </div>

            {/* 2. NỘI DUNG CHÍNH (TRÁI: THÔNG SỐ - PHẢI: BÁO GIÁ PRODUCER) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI: QUY CÁCH THIẾT KẾ & SỐ LƯỢNG TỪNG SIZE */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/70 space-y-6">
                    <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                        <Sliders className="w-4 h-4 text-[#f0592a]" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                            Quy cách thiết kế & Kỹ thuật
                        </h2>
                    </div>

                    {/* Ảnh phôi phối cảnh 2 mặt */}
                    <div className="rounded-2xl border border-zinc-200/80 p-4 bg-zinc-50/50 flex flex-col items-center">
                        <div className="w-full h-56 rounded-xl overflow-hidden bg-white border border-zinc-100 flex items-center justify-center p-2">
                            {displayPreview ? (
                                <img
                                    src={displayPreview}
                                    alt={displayTitle}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-xs text-zinc-400">Chưa có ảnh phối cảnh</div>
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-3">
                            PHỐI CẢNH 2 MẶT (TRƯỚC & SAU)
                        </span>
                    </div>

                    {/* Chi tiết thông số & Chọn số lượng từng size */}
                    <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Màu phôi áo:</span>
                            <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                                <span
                                    className="w-4 h-4 rounded-full border border-black/10 inline-block"
                                    style={{ backgroundColor: displayColor }}
                                />
                                <span>{displayColor}</span>
                            </div>
                        </div>

                        {/* Chọn số lượng theo từng Size */}
                        <div className="space-y-2 pt-2 border-t border-zinc-100">
                            <div className="flex items-center justify-between font-bold">
                                <span className="text-zinc-700">Số lượng dự kiến theo Size:</span>
                                <span className="text-[#f0592a] text-sm">{totalCalculatedQuantity} Chiếc</span>
                            </div>

                            <div className="grid grid-cols-5 gap-1.5 bg-zinc-50 p-2 rounded-2xl border border-zinc-200/60">
                                {sizeBreakdown.map((s) => (
                                    <div key={s.sizeLabel} className="flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-zinc-500 mb-1">{s.sizeLabel}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            disabled={isClosed}
                                            value={s.quantity}
                                            onChange={(e) => handleQuantityChange(s.sizeLabel, e.target.value)}
                                            className="w-full h-8 text-center bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#f0592a] disabled:bg-zinc-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH BÁO GIÁ TỪ CÁC XƯỞNG MAY */}
                <div className="lg:col-span-7 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                        Báo giá từ các xưởng may ({data?.quotations?.length || 0})
                    </h2>

                    {(!data?.quotations || data.quotations.length === 0) ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/70 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#faf8e4] text-[#f0592a] flex items-center justify-center mx-auto border border-[#f0592a]/20">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-zinc-950">Chưa có báo giá nào</h3>
                            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                                {isOpen
                                    ? 'Đơn thiết kế đang được hiển thị cho các xưởng may. Báo giá gửi đến sớm nhất sẽ hiển thị ngay tại đây.'
                                    : 'Vui lòng nhấn nút "Bắt đầu nhận giá" phía trên để mở cổng nhận báo giá từ các xưởng sản xuất.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.quotations.map((q, idx) => (
                                <div
                                    key={q.quotationId}
                                    className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/80 space-y-4 relative overflow-hidden"
                                >
                                    {idx === 0 && (
                                        <div className="absolute top-0 right-0 bg-[#f0592a] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                            LỰA CHỌN TỐI ƯU NHẤT
                                        </div>
                                    )}

                                    {/* Header Báo giá */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                                                <img
                                                    src={q.producerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120'}
                                                    alt={q.producerName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-sm text-zinc-950">{q.producerName}</h3>
                                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                                        {q.badge}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                                    ★ {q.rating} • {q.completedOrders} đơn hoàn tất • {q.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-lg font-extrabold text-[#f0592a]">
                                                {formatCurrency(q.unitPrice)} <span className="text-xs text-zinc-400 font-normal">/ áo</span>
                                            </div>
                                            <div className="text-[11px] text-zinc-500 font-medium">
                                                Tổng: <strong className="text-zinc-800">{formatCurrency(q.totalAmount)}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thời gian hoàn thành */}
                                    <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                        <Clock className="w-4 h-4 text-[#f0592a]" />
                                        <span>
                                            Thời gian hoàn thành: <strong className="text-red-500">{q.leadTimeDays} ngày làm việc</strong>
                                        </span>
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="p-3.5 rounded-2xl bg-[#faf8e4]/60 border border-[#f0592a]/15 text-xs text-zinc-700 leading-relaxed italic">
                                        "{q.note}"
                                    </div>

                                    {/* Thao tác Chấp thuận */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            disabled={isClosed}
                                            onClick={() => handleOpenDepositModal(q)}
                                            className="px-5 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{isClosed ? 'Đơn đã chốt xưởng' : 'Chấp thuận báo giá'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL XÁC NHẬN CỌC 50% NẰM CHÍNH GIỮA MÀN HÌNH */}
            {depositModal.isOpen && depositModal.quotation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-lg w-full p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setDepositModal({ isOpen: false, quotation: null })}
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
                                    <h3 className="text-base font-bold text-zinc-950">Xác nhận đặt cọc sản xuất (50%)</h3>
                                    <p className="text-xs text-zinc-500">Xưởng may: {depositModal.quotation.producerName}</p>
                                </div>
                            </div>

                            {/* Bảng kê số tiền */}
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/70 space-y-2.5 text-xs">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Tổng số lượng:</span>
                                    <strong className="text-zinc-900">{totalCalculatedQuantity} áo</strong>
                                </div>
                                <div className="flex justify-between text-zinc-600">
                                    <span>Đơn giá gia công:</span>
                                    <strong className="text-zinc-900">{formatCurrency(depositModal.quotation.unitPrice)} / áo</strong>
                                </div>
                                <div className="flex justify-between text-zinc-600 border-t border-zinc-200/60 pt-2">
                                    <span>Tổng giá trị đơn hàng:</span>
                                    <strong className="text-zinc-900 text-sm">{formatCurrency(depositModal.quotation.totalAmount)}</strong>
                                </div>
                                <div className="flex justify-between items-center bg-[#fefccf] p-2.5 rounded-xl border border-[#f0592a]/20">
                                    <span className="font-bold text-zinc-800">Số tiền cọc đợt 1 (50%):</span>
                                    <span className="font-extrabold text-[#f0592a] text-base">
                                        {formatCurrency(Number(depositModal.quotation.totalAmount) / 2)}
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 italic">
                                    * 50% còn lại ({formatCurrency(Number(depositModal.quotation.totalAmount) / 2)}) sẽ thanh toán sau khi xưởng hoàn thiện may xong.
                                </p>
                            </div>

                            {/* KHU VỰC CỔNG THANH TOÁN (GIAO DIỆN THỬ NGHIỆM - CHỜ TÍCH HỢP GATEWAY) */}
                            {/* TODO: PAYMENT_GATEWAY_INTEGRATION - Thành viên thanh toán sẽ nhúng SDK/QR Code vào đây */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-700">Phương thức đặt cọc</span>
                                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                        Thử nghiệm (Chờ tích hợp Gateway)
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <label
                                        onClick={() => setDepositModal({ ...depositModal, paymentMethod: 'VNPAY' })}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                            depositModal.paymentMethod === 'VNPAY'
                                                ? 'border-[#f0592a] bg-[#faf8e4]/50'
                                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payMethod"
                                            checked={depositModal.paymentMethod === 'VNPAY'}
                                            onChange={() => {}}
                                            className="accent-[#f0592a]"
                                        />
                                        <span className="font-semibold text-zinc-800">Cổng VNPAY / QR</span>
                                    </label>

                                    <label
                                        onClick={() => setDepositModal({ ...depositModal, paymentMethod: 'MOMO' })}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                            depositModal.paymentMethod === 'MOMO'
                                                ? 'border-[#f0592a] bg-[#faf8e4]/50'
                                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payMethod"
                                            checked={depositModal.paymentMethod === 'MOMO'}
                                            onChange={() => {}}
                                            className="accent-[#f0592a]"
                                        />
                                        <span className="font-semibold text-zinc-800">Ví MoMo / Thẻ</span>
                                    </label>
                                </div>
                            </div>

                            {/* Thông tin nhận hàng (placeholder gợi ý chìm chìm mờ mờ) */}
                            <div className="space-y-2 text-xs pt-1">
                                <span className="font-bold text-zinc-700">Thông tin giao nhận sau khi may xong</span>
                                <input
                                    type="text"
                                    placeholder="Gợi ý: Designer Atelier"
                                    value={depositModal.shippingName}
                                    onChange={(e) => setDepositModal({ ...depositModal, shippingName: e.target.value })}
                                    className="w-full h-9 px-3 rounded-xl border border-zinc-200 text-xs placeholder:text-zinc-400 placeholder:italic outline-none focus:border-[#f0592a]"
                                />
                                <input
                                    type="text"
                                    placeholder="Gợi ý: 0900000000"
                                    value={depositModal.shippingPhone}
                                    onChange={(e) => setDepositModal({ ...depositModal, shippingPhone: e.target.value })}
                                    className="w-full h-9 px-3 rounded-xl border border-zinc-200 text-xs placeholder:text-zinc-400 placeholder:italic outline-none focus:border-[#f0592a]"
                                />
                                <input
                                    type="text"
                                    placeholder="Gợi ý: Địa chỉ giao hàng mặc định của tôi"
                                    value={depositModal.shippingAddress}
                                    onChange={(e) => setDepositModal({ ...depositModal, shippingAddress: e.target.value })}
                                    className="w-full h-9 px-3 rounded-xl border border-zinc-200 text-xs placeholder:text-zinc-400 placeholder:italic outline-none focus:border-[#f0592a]"
                                />
                            </div>

                            {/* Nút hành động */}
                            <div className="grid grid-cols-2 gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setDepositModal({ isOpen: false, quotation: null })}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    disabled={isDepositing}
                                    onClick={handleConfirmDeposit}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#f0592a] hover:bg-[#d94a1f] disabled:bg-zinc-400 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    {isDepositing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Đang xử lý cọc...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Xác nhận cọc 50%</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÔNG BÁO THÀNH CÔNG / THẤT BẠI Ở CHÍNH GIỮA MÀN HÌNH */}
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
                            {/* Icon trạng thái */}
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

                            {/* Mã đơn gia công làm nổi bật */}
                            {alertModal.orderCode && (
                                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/70 inline-block">
                                    <span className="text-[11px] text-zinc-500">Mã đơn gia công: </span>
                                    <strong className="text-xs font-bold text-[#f0592a]">
                                        {alertModal.orderCode}
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