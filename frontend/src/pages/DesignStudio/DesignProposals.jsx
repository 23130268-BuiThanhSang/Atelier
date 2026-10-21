import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    Download
} from 'lucide-react';
import { proposalApi } from '../../api/proposalApi';

export default function DesignProposals() {
    const { id: designId } = useParams();
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

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await proposalApi.getDetailForDesigner(designId);
            setData(res);
            if (res.sizeBreakdown && res.sizeBreakdown.length > 0) {
                setSizeBreakdown(res.sizeBreakdown);
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
            alert('Vui lòng nhập số lượng lớn hơn 0 cho ít nhất 1 size để bắt đầu nhận báo giá.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Lấy currentUserId từ localStorage
            let currentUserId = null;
            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUserId = storedUser.id || storedUser.userId;
            } catch (e) {}

            const payload = {
                designId: Number(designId),
                designVersionId: data?.designVersionId || null,
                garmentColor: data?.garmentColor || '#77C1F9',
                printSides: data?.printSides || 'In Kỹ thuật số DTF 2 Mặt',
                sizeQuantities: sizeBreakdown
            };

            const updated = await proposalApi.toggleStatus(payload, currentUserId);
            setData(updated);
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái nhận giá:', err);
            alert('Có lỗi xảy ra khi cập nhật trạng thái nhận giá. Vui lòng kiểm tra lại log Backend.');
        } finally {
            setIsSubmitting(false);
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
                        {data?.designName || 'Mẫu thiết kế'}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={isSubmitting}
                        className={`h-11 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                            isOpen
                                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                                : 'bg-[#f0592a] hover:bg-[#d94a1f] text-white'
                        }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isOpen ? (
                            <PauseCircle className="w-4 h-4 text-zinc-500" />
                        ) : (
                            <PlayCircle className="w-4 h-4" />
                        )}
                        <span>{isOpen ? 'Tạm ngưng nhận giá' : 'Bắt đầu nhận giá'}</span>
                    </button>
                </div>
            </div>

            {/* 2. NỘI DUNG CHÍNH (TRÁI: THÔNG SỐ - PHẢI: BÁO GIÁ PRODUCER) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI: QUY CÁCH THIẾT KẾ & SỐ LƯỢNG TỪNG SIZE (5 CỘT) */}
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
                            {data?.previewImageUrl ? (
                                <img
                                    src={data.previewImageUrl}
                                    alt="Phối cảnh 2 mặt"
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
                                    style={{ backgroundColor: data?.garmentColor || '#77C1F9' }}
                                />
                                <span>{data?.garmentColor || '#77C1F9'}</span>
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
                                            value={s.quantity}
                                            onChange={(e) => handleQuantityChange(s.sizeLabel, e.target.value)}
                                            className="w-full h-8 text-center bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#f0592a]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH BÁO GIÁ TỪ CÁC XƯỞNG MAY (7 CỘT) */}
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

                                    {/* Header của Báo giá: Profile xưởng & Đơn giá */}
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

                                    {/* Lời nhắn / Ghi chú kỹ thuật từ xưởng */}
                                    <div className="p-3.5 rounded-2xl bg-[#faf8e4]/60 border border-[#f0592a]/15 text-xs text-zinc-700 leading-relaxed italic">
                                        "{q.note}"
                                    </div>

                                    {/* Thanh tác vụ: BỎ NÚT NHẮN TIN, NÚT CHẤP THUẬN GIỮ NGUYÊN GIAO DIỆN */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            className="px-5 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Chấp thuận báo giá</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}