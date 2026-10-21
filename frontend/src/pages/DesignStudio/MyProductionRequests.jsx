import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shirt,
    Layers,
    Clock,
    FileText,
    ArrowLeft,
    Eye,
    Loader2,
    CheckCircle2,
    PauseCircle,
    Inbox
} from 'lucide-react';
import { proposalApi } from '../../api/proposalApi';

export default function MyProductionRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadMyRequests = async () => {
        setIsLoading(true);
        try {
            // Đọc ID người dùng từ tất cả các vị trí lưu có thể có trong localStorage
            let currentUserId = null;
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    currentUserId = parsed.id || parsed.userId;
                }
            } catch (e) {}

            if (!currentUserId) {
                currentUserId = localStorage.getItem('userId') || localStorage.getItem('currentUserId');
            }

            // Gọi API với currentUserId (nếu không có thì truyền 1 làm mặc định)
            const targetId = currentUserId ? Number(currentUserId) : 1;
            const data = await proposalApi.getMyRequests(targetId);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Không thể nạp danh sách đơn thiết kế yêu cầu sản xuất:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMyRequests();
    }, []);

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-8 px-4 sm:px-8 xl:px-14 space-y-6">
            {/* Header trang */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-0.5">
                            <Link to="/my-designs" className="hover:text-[#f0592a] transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Thiết kế của tôi</span>
                            </Link>
                            <span>&gt;</span>
                            <span className="text-zinc-800">Đơn yêu cầu sản xuất</span>
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-950">
                            Đơn thiết kế yêu cầu sản xuất
                        </h1>
                    </div>
                </div>

                <div className="text-xs font-bold bg-[#faf8e4] text-[#f0592a] px-4 py-2 rounded-xl border border-[#f0592a]/20">
                    Tổng số đơn: {requests.length}
                </div>
            </div>

            {/* Trạng thái tải */}
            {isLoading && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f0592a] mx-auto mb-3" />
                    <p className="text-xs font-bold text-zinc-700">Đang tải danh sách đơn sản xuất của bạn...</p>
                </div>
            )}

            {/* Trạng thái trống */}
            {!isLoading && requests.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/70 space-y-3">
                    <Inbox className="w-12 h-12 text-zinc-300 mx-auto" />
                    <h3 className="text-base font-bold text-zinc-900">Bạn chưa có đơn yêu cầu sản xuất nào</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Hãy chọn một mẫu áo trong "Thiết kế của tôi" và bấm "Nhận báo giá" để bắt đầu mở đơn sản xuất.
                    </p>
                    <Link
                        to="/my-designs"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] mt-2 cursor-pointer"
                    >
                        <span>Quay lại trang Thiết kế của tôi</span>
                    </Link>
                </div>
            )}

            {/* Danh sách lưới các đơn thiết kế */}
            {!isLoading && requests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.map((req) => {
                        const isOpen = (req.status || '').toUpperCase() === 'OPEN';

                        return (
                            <div
                                key={req.requestId}
                                className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    {/* Ảnh phối cảnh và tag trạng thái */}
                                    <div className="relative h-56 bg-zinc-50 border-b border-zinc-100 p-4 flex items-center justify-center">
                                        <img
                                            src={req.previewImageUrl || 'https://picsum.photos/seed/design/400/300'}
                                            alt={req.designName}
                                            className="w-full h-full object-contain"
                                        />
                                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs border text-[10px] font-bold rounded-lg text-zinc-800">
                                            Mã: #{req.requestCode || req.requestId}
                                        </span>

                                        <span
                                            className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                                                isOpen
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                                            }`}
                                        >
                                            {isOpen ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span>Đang nhận giá</span>
                                                </>
                                            ) : (
                                                <>
                                                    <PauseCircle className="w-3 h-3 text-zinc-400" />
                                                    <span>Tạm ngưng</span>
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Chi tiết đơn */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="font-bold text-base text-zinc-950 truncate">{req.designName}</h3>

                                        <div className="space-y-2 text-xs text-zinc-600 bg-zinc-50/70 p-3.5 rounded-2xl border border-zinc-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-500">Màu phôi áo:</span>
                                                <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                                                    <span
                                                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                                                        style={{ backgroundColor: req.garmentColor || '#77C1F9' }}
                                                    />
                                                    <span>{req.garmentColor || '#77C1F9'}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-500">Số lượng đặt:</span>
                                                <span className="font-bold text-zinc-900">{req.totalQuantity} chiếc</span>
                                            </div>

                                            <div className="flex justify-between items-center pt-1 border-t border-zinc-200/60">
                                                <span className="text-zinc-500">Số báo giá đã nhận:</span>
                                                <span className="font-extrabold text-[#f0592a] text-sm">
                                                    {req.quotationCount} xưởng báo giá
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nút xem chi tiết đơn & các báo giá */}
                                <div className="p-5 pt-0">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/design-studio/${req.designId}/proposals`)}
                                        className="w-full py-2.5 px-4 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Xem chi tiết</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}