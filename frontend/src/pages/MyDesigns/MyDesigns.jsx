import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Palette,
    Plus,
    Edit3,
    Share2,
    EyeOff,
    Send,
    Lock,
    Globe,
    Layers,
    Loader2,
    AlertCircle,
    Sparkles,
    FileText
} from 'lucide-react';
import { designApi } from '../../api/designApi';

export default function MyDesigns() {
    const navigate = useNavigate();
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const fetchDesigns = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            // Lấy ID người dùng đang đăng nhập từ localStorage
            let currentUserId = null;
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    currentUserId = parsed.id || parsed.userId;
                }
            } catch (e) {
                console.error('Không thể đọc user từ localStorage', e);
            }

            // Nếu lưu trực tiếp userId ở key riêng:
            if (!currentUserId) {
                currentUserId = localStorage.getItem('userId');
            }

            // Gọi API với đúng ID tài khoản đang xem
            const data = await designApi.getMyDesigns(currentUserId);
            setDesigns(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi khi tải danh sách thiết kế:', err);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    // Xử lý bật / tắt chia sẻ (PRIVATE <-> PUBLIC) an toàn và chuẩn xác
    const handleToggleVisibility = async (design) => {
        setTogglingId(design.designId);
        const currentVis = (design.visibility || 'PRIVATE').toUpperCase();
        const nextVis = currentVis === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

        try {
            const res = await designApi.toggleVisibility(design.designId);
            const serverVis = (res?.visibility || res?.data?.visibility || nextVis).toUpperCase();

            setDesigns((prev) =>
                prev.map((item) =>
                    item.designId === design.designId
                        ? { ...item, visibility: serverVis }
                        : item
                )
            );
        } catch (err) {
            console.error('Không thể cập nhật trạng thái chia sẻ:', err);
            alert('Không thể thay đổi trạng thái chia sẻ. Vui lòng kiểm tra lại!');
        } finally {
            setTogglingId(null);
        }
    };

    // Chuyển vào trang Thiết kế (/design-studio) kèm dữ liệu để chỉnh sửa
    const handleEditDesign = (design) => {
        navigate(`/design-studio?designId=${design.designId}`, {
            state: { editDesign: design }
        });
    };

    // Chuyển vào trang Nhận báo giá (/design-studio/:id/proposals)
    const handleRequestQuote = (design) => {
        navigate(`/design-studio/${design.designId}/proposals`, {
            state: {
                designId: design.designId,
                versionId: design.versionNumber || 1,
                title: design.name,
                garmentColor: design.garmentColor || '#F5F2DC',
                previewUrl: design.previewImageUrl
            }
        });
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-3 sm:px-6 xl:px-10 space-y-6">
            {/* HEADER TRANG */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-zinc-950">
                            Thiết kế của tôi
                        </h1>
                    </div>
                </div>

                {/* KHU VỰC CÁC NÚT ĐIỀU HƯỚNG */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    {/* NÚT XEM ĐƠN THIẾT KẾ (NẰM BÊN TRÁI NÚT TẠO MỚI) */}
                    <Link
                        to="/my-production-requests"
                        className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
                    >
                        <FileText className="w-4 h-4 text-[#f0592a]" />
                        <span>Xem đơn thiết kế</span>
                    </Link>

                    {/* NÚT TẠO MẪU THIẾT KẾ MỚI */}
                    <Link
                        to="/design-studio"
                        className="px-4 py-2.5 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tạo mẫu thiết kế mới</span>
                    </Link>
                </div>
            </div>

            {/* TRẠNG THÁI ĐANG TẢI */}
            {isLoading && (
                <div className="bg-white rounded-2xl border border-zinc-200/70 p-16 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 text-[#f0592a] animate-spin mb-3" />
                    <p className="text-sm font-bold text-zinc-800">Đang tải danh sách thiết kế...</p>
                </div>
            )}

            {/* TRẠNG THÁI LỖI */}
            {!isLoading && isError && (
                <div className="bg-white rounded-2xl border border-red-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">Có lỗi xảy ra khi tải dữ liệu</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-md">
                        Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại kết nối và thử lại.
                    </p>
                    <button
                        type="button"
                        onClick={fetchDesigns}
                        className="mt-4 px-4 py-2 bg-[#f0592a] text-white rounded-lg text-xs font-bold hover:bg-[#d94a1f] transition-all cursor-pointer"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* TRẠNG THÁI TRỐNG */}
            {!isLoading && !isError && designs.length === 0 && (
                <div className="bg-white rounded-2xl border border-zinc-200/70 p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center mb-4">
                        <Layers className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-950">Chưa có mẫu thiết kế nào</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                        Bạn chưa lưu mẫu thiết kế nào. Hãy bắt đầu sáng tạo mẫu áo 2D/3D đầu tiên của bạn ngay hôm nay!
                    </p>
                    <Link
                        to="/design-studio"
                        className="mt-5 px-5 py-2.5 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Bắt đầu thiết kế ngay</span>
                    </Link>
                </div>
            )}

            {/* LƯỚI DANH SÁCH THIẾT KẾ */}
            {!isLoading && !isError && designs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {designs.map((design) => {
                        const isPublic = (design.visibility || '').toUpperCase() === 'PUBLIC';
                        const isToggling = togglingId === design.designId;

                        return (
                            <div
                                key={design.designId}
                                className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                            >
                                {/* PHẦN TRÊN: KHUNG ẢNH & TAG VISIBILITY */}
                                <div>
                                    <div className="relative bg-zinc-50 border-b border-zinc-100 h-60 p-4 flex items-center justify-center overflow-hidden">
                                        {design.previewImageUrl ? (
                                            <img
                                                src={design.previewImageUrl}
                                                alt={design.name}
                                                className="w-full h-full object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-xs text-zinc-400 flex flex-col items-center gap-2">
                                                <Palette className="w-8 h-8 text-zinc-300" />
                                                <span>Chưa có ảnh xem trước</span>
                                            </div>
                                        )}

                                        {/* Tag Phiên bản ở góc trên trái */}
                                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-zinc-200/80 text-zinc-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-[#f0592a]" />
                                            Phiên bản #{design.versionNumber || 1}
                                        </span>

                                        {/* Tag Visibility (PUBLIC / PRIVATE) ở góc trên phải */}
                                        <span
                                            className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 border ${
                                                isPublic
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-zinc-100 text-zinc-700 border-zinc-200/80'
                                            }`}
                                        >
                                            {isPublic ? (
                                                <>
                                                    <Globe className="w-3 h-3 text-emerald-600" />
                                                    <span>Công khai</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-3 h-3 text-zinc-500" />
                                                    <span>Riêng tư</span>
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* THÔNG TIN TÊN & MÀU ÁO */}
                                    <div className="p-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3
                                                className="font-bold text-sm sm:text-base text-zinc-950 truncate"
                                                title={design.name}
                                            >
                                                {design.name || 'Mẫu áo chưa đặt tên'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* PHẦN DƯỚI: 3 NÚT HÀNH ĐỘNG */}
                                <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                                    {/* 1. Nút Chỉnh sửa */}
                                    <button
                                        type="button"
                                        onClick={() => handleEditDesign(design)}
                                        className="py-2 px-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                        <span className="truncate">Chỉnh sửa</span>
                                    </button>

                                    {/* 2. Nút Chia sẻ / Tắt chia sẻ */}
                                    <button
                                        type="button"
                                        disabled={isToggling}
                                        onClick={() => handleToggleVisibility(design)}
                                        className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border ${
                                            isPublic
                                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                                                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                                        }`}
                                    >
                                        {isToggling ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                        ) : isPublic ? (
                                            <EyeOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                        ) : (
                                            <Share2 className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                        )}
                                        <span className="truncate">
                                            {isPublic ? 'Riêng tư' : 'Công khai'}
                                        </span>
                                    </button>

                                    {/* 3. Nút Nhận báo giá */}
                                    <button
                                        type="button"
                                        onClick={() => handleRequestQuote(design)}
                                        className="py-2 px-2.5 rounded-lg bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">Nhận báo giá</span>
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