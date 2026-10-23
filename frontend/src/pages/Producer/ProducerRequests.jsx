import React, { useState, useEffect } from 'react';
import {
    Shirt,
    Clock,
    DollarSign,
    Layers,
    CheckCircle2,
    Calendar,
    Send,
    Eye,
    X,
    Loader2,
    Sliders,
    Check,
    Download
} from 'lucide-react';
import { proposalApi } from '../../api/proposalApi';

export default function ProducerRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [quotePrice, setQuotePrice] = useState('');
    const [leadDays, setLeadDays] = useState(7);
    const [quoteNote, setQuoteNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExportingImage, setIsExportingImage] = useState(false);

    // Toast alert thành công ở góc trên bên phải
    const [successAlert, setSuccessAlert] = useState(false);

    // Lấy ID tài khoản Producer từ localStorage
    const getCurrentUserId = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return parsed.id || parsed.userId;
            }
            return localStorage.getItem('userId') || 1;
        } catch (e) {
            return 1;
        }
    };

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const currentUserId = getCurrentUserId();
            const data = await proposalApi.getOpenRequestsForProducer(currentUserId);
            setRequests(data || []);
        } catch (err) {
            console.error('Không thể nạp danh sách đơn cần sản xuất:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    const handleOpenModal = (req) => {
        if (req.hasQuoted) return;
        setSelectedRequest(req);
        setQuotePrice('');
        setLeadDays(7);
        setQuoteNote('Chào bạn, xưởng hiện có sẵn phôi áo tiêu chuẩn và máy in DTF để gia công ngay.');
    };

    const handleSendQuote = async () => {
        if (!quotePrice || parseFloat(quotePrice) <= 0) {
            alert('Vui lòng nhập đơn giá đề xuất hợp lệ.');
            return;
        }

        setIsSubmitting(true);
        try {
            const currentUserId = getCurrentUserId();

            await proposalApi.submitQuotation({
                requestId: selectedRequest.requestId,
                unitPrice: parseFloat(quotePrice),
                leadTimeDays: parseInt(leadDays, 10) || 7,
                note: quoteNote
            }, currentUserId);

            setRequests(prev => prev.map(item =>
                item.requestId === selectedRequest.requestId
                    ? { ...item, hasQuoted: true }
                    : item
            ));

            setSelectedRequest(null);
            setSuccessAlert(true);
            setTimeout(() => setSuccessAlert(false), 4000);
        } catch (err) {
            console.error('Gửi báo giá thất bại:', err);
            alert('Không thể gửi báo giá. Vui lòng kiểm tra lại log Backend.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Trích xuất chính xác 2 vùng in (Mặt trước - Mặt sau) bên trong khung nét đứt đỏ
     * và ghép thành 1 file ảnh PNG chia 2 nửa Trái / Phải để tải về
     */
    const handleDownloadPrintFile = async (req) => {
        if (!req?.previewImageUrl) {
            alert('Không tìm thấy hình ảnh thiết kế của đơn này.');
            return;
        }

        setIsExportingImage(true);
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Không thể tải ảnh thiết kế'));
                img.src = req.previewImageUrl;
            });

            // Tỷ lệ gốc tạo từ DesignStudio là 800 x 440
            const scaleX = img.naturalWidth / 800;
            const scaleY = img.naturalHeight / 440;

            // Tọa độ vùng nét đứt đỏ chuẩn từ Canvas DesignStudio
            const frontCrop = {
                x: 129 * scaleX,
                y: 135 * scaleY,
                w: 142 * scaleX,
                h: 190 * scaleY
            };

            const backCrop = {
                x: 529 * scaleX,
                y: 135 * scaleY,
                w: 142 * scaleX,
                h: 190 * scaleY
            };

            // Tạo Canvas xuất ảnh chất lượng cao: 1200 x 800 px (Mỗi bên 600 x 800 px)
            const targetW = 600;
            const targetH = 800;
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = targetW * 2;
            outputCanvas.height = targetH;
            const ctx = outputCanvas.getContext('2d');

            // 1. Nền trắng
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

            // 2. Vẽ 2 khung viền đen chia 2 nửa Trái (Mặt trước) - Phải (Mặt sau)
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 6;
            ctx.strokeRect(3, 3, targetW - 3, targetH - 6);
            ctx.strokeRect(targetW, 3, targetW - 3, targetH - 6);

            // 3. Cắt và vẽ nội dung in Mặt Trước vào nửa bên trái (có padding 30px)
            const pad = 30;
            ctx.drawImage(
                img,
                frontCrop.x, frontCrop.y, frontCrop.w, frontCrop.h,
                pad, pad, targetW - (pad * 2), targetH - (pad * 2)
            );

            // 4. Cắt và vẽ nội dung in Mặt Sau vào nửa bên phải (có padding 30px)
            ctx.drawImage(
                img,
                backCrop.x, backCrop.y, backCrop.w, backCrop.h,
                targetW + pad, pad, targetW - (pad * 2), targetH - (pad * 2)
            );

            // 5. Thêm nhãn nhỏ góc trên: "MẶT TRƯỚC" và "MẶT SAU"
            ctx.fillStyle = '#71717a';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MẶT TRƯỚC (PRINT AREA)', targetW / 2, 24);
            ctx.fillText('MẶT SAU (PRINT AREA)', targetW + (targetW / 2), 24);

            // 6. Xuất ra file tải về
            const dataUrl = outputCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `PrintFile_${req.requestCode || req.requestId}_2Sides.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Lỗi xuất file in:', err);
            alert('Không thể xuất file in. Vui lòng kiểm tra lại ảnh thiết kế.');
        } finally {
            setIsExportingImage(false);
        }
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-8 px-4 sm:px-8 xl:px-14 space-y-6 relative">

            {/* ALERT THÔNG BÁO THÀNH CÔNG: GÓC TRÊN BÊN PHẢI */}
            {successAlert && (
                <div className="fixed top-6 right-6 z-50 animate-slideInRight">
                    <div className="bg-white/95 backdrop-blur-md border border-emerald-300 text-zinc-950 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-md">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 pr-2">
                            <div className="text-xs font-bold text-zinc-900">Báo giá thành công!</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                                Báo giá của xưởng bạn đã được gửi trực tiếp đến nhà thiết kế.
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccessAlert(false)}
                            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-950">
                            Đơn thiết kế cần sản xuất
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Danh sách các mẫu áo đang mở nhận báo giá từ các nhà thiết kế (Mới nhất)
                        </p>
                    </div>
                </div>

                <div className="text-xs font-bold bg-[#faf8e4] text-[#f0592a] px-4 py-2 rounded-xl border border-[#f0592a]/20">
                    Đang mở nhận giá: {requests.length} đơn
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f0592a] mx-auto mb-3" />
                    <p className="text-xs font-bold text-zinc-700">Đang tải đơn sản xuất...</p>
                </div>
            )}

            {/* Trống */}
            {!isLoading && requests.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70 space-y-3">
                    <Layers className="w-10 h-10 text-zinc-300 mx-auto" />
                    <h3 className="text-base font-bold text-zinc-900">Hiện chưa có đơn thiết kế nào cần báo giá</h3>
                </div>
            )}

            {/* Lưới danh sách đơn */}
            {!isLoading && requests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <div
                            key={req.requestId}
                            className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-56 bg-zinc-50 border-b border-zinc-100 p-4 flex items-center justify-center">
                                    <img
                                        src={req.previewImageUrl || 'https://picsum.photos/seed/design/400/300'}
                                        alt={req.designName}
                                        className="w-full h-full object-contain"
                                    />
                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs border text-[10px] font-bold rounded-lg text-zinc-800">
                                        Mã: #{req.requestCode || req.requestId}
                                    </span>
                                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg">
                                        Đang nhận giá
                                    </span>
                                </div>

                                <div className="p-5 space-y-3">
                                    <h3 className="font-bold text-base text-zinc-950 truncate">{req.designName}</h3>
                                    <div className="space-y-1.5 text-xs text-zinc-600">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Người thiết kế:</span>
                                            <span className="font-semibold text-zinc-800">{req.designerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Tổng số lượng:</span>
                                            <span className="font-bold text-[#f0592a] text-sm">{req.totalQuantity} Chiếc</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="p-5 pt-0">
                                {req.hasQuoted ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 text-zinc-400 border border-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                                        <span className="text-zinc-600">Đã báo giá</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModal(req)}
                                        className="w-full py-2.5 px-4 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Xem chi tiết & Báo giá</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL CHI TIẾT & BÁO GIÁ */}
            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn"
                    onClick={() => setSelectedRequest(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto space-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#faf8e4] text-[#f0592a] flex items-center justify-center">
                                <Sliders className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-zinc-950">Chi tiết đơn thiết kế & Báo giá</h2>
                                <span className="text-xs text-zinc-400">#{selectedRequest.requestCode} • {selectedRequest.designName}</span>
                            </div>
                        </div>

                        {/* Phối cảnh & Bảng Size */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-full h-44 rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center">
                                    <img
                                        src={selectedRequest.previewImageUrl}
                                        alt={selectedRequest.designName}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* DÒNG TẢI ẢNH ĐỂ IN LÊN SẢN PHẨM (TRÁI: TRƯỚC, PHẢI: SAU) */}
                                <button
                                    type="button"
                                    disabled={isExportingImage}
                                    onClick={() => handleDownloadPrintFile(selectedRequest)}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f0592a] hover:text-[#d94a1f] hover:underline cursor-pointer transition-colors"
                                >
                                    {isExportingImage ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Đang trích xuất file in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Tải ảnh để in lên trên sản phẩm</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="font-bold text-zinc-900 border-b pb-1">Chi tiết số lượng theo Size:</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedRequest.sizeBreakdown?.map((s) => (
                                        <div key={s.sizeLabel} className="flex justify-between bg-white p-2 rounded-lg border">
                                            <span className="font-bold text-zinc-700">Size {s.sizeLabel}:</span>
                                            <span className="font-extrabold text-[#f0592a]">{s.quantity} cái</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 font-bold text-zinc-800 flex justify-between">
                                    <span>Tổng số lượng:</span>
                                    <span className="text-sm text-[#f0592a]">{selectedRequest.totalQuantity} chiếc</span>
                                </div>
                            </div>
                        </div>

                        {/* Khung nhập báo giá */}
                        <div className="space-y-4 pt-2 border-t border-zinc-100">
                            <h3 className="text-sm font-bold text-zinc-900">Báo giá của xưởng bạn</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                                        Đơn giá đề xuất (VNĐ / áo) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={quotePrice}
                                        onChange={(e) => setQuotePrice(e.target.value)}
                                        placeholder="Ví dụ: 350000"
                                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-[#f0592a] focus:outline-none focus:border-[#f0592a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                                        Thời gian hoàn thành (ngày)
                                    </label>
                                    <input
                                        type="number"
                                        value={leadDays}
                                        onChange={(e) => setLeadDays(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-700 mb-1">
                                    Ghi chú / Cam kết chất lượng
                                </label>
                                <textarea
                                    rows={3}
                                    value={quoteNote}
                                    onChange={(e) => setQuoteNote(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#f0592a]"
                                />
                            </div>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleSendQuote}
                                className="w-full h-11 rounded-2xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span>Gửi báo giá cho nhà thiết kế</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}