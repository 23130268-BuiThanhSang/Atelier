import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Palette,
    Plus,
    Edit3,
    Trash2,
    Share2,
    EyeOff,
    Send,
    Lock,
    Globe,
    Layers,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    FileText,
    X
} from 'lucide-react';
import { designApi } from '../../api/designApi';

export default function MyDesigns() {
    const navigate = useNavigate();
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // State cho Modal Xác nhận Xóa ở giữa màn hình
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        design: null
    });

    // State cho Modal Thông báo (Alert) ở giữa màn hình
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'error' | 'warning'
        title: '',
        message: ''
    });

    const showAlert = (title, message, type = 'success') => {
        setAlertModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const closeAlert = () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
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

    const fetchDesigns = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const currentUserId = getLoggedInUserId();
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

    // Xử lý bật / tắt chia sẻ (PRIVATE <-> PUBLIC)
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
            showAlert(
                'Cập nhật thành công',
                `Mẫu thiết kế đã được chuyển sang chế độ ${serverVis === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}.`,
                'success'
            );
        } catch (err) {
            console.error('Không thể cập nhật trạng thái chia sẻ:', err);
            showAlert('Lỗi cập nhật', 'Không thể thay đổi trạng thái chia sẻ. Vui lòng kiểm tra lại!', 'error');
        } finally {
            setTogglingId(null);
        }
    };

    // Mở Modal xác nhận xóa
    const openDeleteModal = (design) => {
        setConfirmModal({
            isOpen: true,
            design
        });
    };

    // Thực thi xóa sau khi đã bấm xác nhận trên Modal
    const handleConfirmDelete = async () => {
        const design = confirmModal.design;
        if (!design) return;

        setDeletingId(design.designId);
        setConfirmModal({ isOpen: false, design: null });

        try {
            const currentUserId = getLoggedInUserId();
            await designApi.deleteDesign(design.designId, currentUserId);
            // Loại bỏ khỏi state ngay lập tức
            setDesigns(prev => prev.filter(item => item.designId !== design.designId));
            showAlert('Đã xóa thiết kế', `Mẫu "${design.name || 'Mẫu áo chưa đặt tên'}" đã được xóa vĩnh viễn khỏi hệ thống.`, 'success');
        } catch (err) {
            console.error('Lỗi khi xóa thiết kế:', err);
            const errMsg = err.response?.data?.message || err.message || 'Không thể xóa mẫu thiết kế này. Vui lòng thử lại sau.';
            showAlert('Xóa thất bại', errMsg, 'error');
        } finally {
            setDeletingId(null);
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
                    <Link
                        to="/my-production-requests"
                        className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
                    >
                        <FileText className="w-4 h-4 text-[#f0592a]" />
                        <span>Xem đơn thiết kế</span>
                    </Link>

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
                        const isDeleting = deletingId === design.designId;

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

                                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-zinc-200/80 text-zinc-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-[#f0592a]" />
                                            Phiên bản #{design.versionNumber || 1}
                                        </span>

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

                                    {/* THÔNG TIN TÊN THIẾT KẾ */}
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

                                {/* PHẦN DƯỚI: 4 NÚT HÀNH ĐỘNG - NÚT XÓA Ở GIỮA CHỈNH SỬA VÀ CÔNG KHAI */}
                                <div className="p-4 pt-0 grid grid-cols-4 gap-1.5">
                                    {/* 1. Nút Chỉnh sửa */}
                                    <button
                                        type="button"
                                        onClick={() => handleEditDesign(design)}
                                        title="Chỉnh sửa thiết kế"
                                        className="py-2 px-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                        <span className="truncate">Sửa</span>
                                    </button>

                                    {/* 2. Nút Xóa (NẰM Ở GIỮA) */}
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={() => openDeleteModal(design)}
                                        title="Xóa vĩnh viễn thiết kế này"
                                        className="py-2 px-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                        )}
                                        <span className="truncate">Xóa</span>
                                    </button>

                                    {/* 3. Nút Chia sẻ / Tắt chia sẻ (Công khai / Riêng tư) */}
                                    <button
                                        type="button"
                                        disabled={isToggling}
                                        onClick={() => handleToggleVisibility(design)}
                                        title={isPublic ? 'Chuyển về riêng tư' : 'Chia sẻ lên cộng đồng'}
                                        className={`py-2 px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer border ${
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
                                            {isPublic ? 'Ẩn' : 'Công khai'}
                                        </span>
                                    </button>

                                    {/* 4. Nút Nhận báo giá */}
                                    <button
                                        type="button"
                                        onClick={() => handleRequestQuote(design)}
                                        title="Gửi yêu cầu nhận báo giá sản xuất"
                                        className="py-2 px-1.5 rounded-lg bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">Báo giá</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL XÁC NHẬN XÓA (NẰM CHÍNH GIỮA MÀN HÌNH) */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-sm w-full p-6 relative overflow-hidden animate-scaleIn">
                        <button
                            type="button"
                            onClick={() => setConfirmModal({ isOpen: false, design: null })}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 border border-red-200/60 flex items-center justify-center mb-4">
                                <Trash2 className="w-7 h-7" />
                            </div>

                            <h3 className="text-lg font-bold text-zinc-950">
                                Xác nhận xóa thiết kế?
                            </h3>
                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                Bạn có chắc chắn muốn xóa vĩnh viễn mẫu{' '}
                                <strong className="text-zinc-800 font-semibold">
                                    "{confirmModal.design?.name || 'Mẫu áo chưa đặt tên'}"
                                </strong>
                                ? Toàn bộ phiên bản và dữ liệu liên quan sẽ bị xóa và không thể khôi phục.
                            </p>

                            <div className="w-full grid grid-cols-2 gap-2.5 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal({ isOpen: false, design: null })}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-all cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs cursor-pointer"
                                >
                                    Xóa vĩnh viễn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÔNG BÁO (ALERT CHÍNH GIỮA MÀN HÌNH) */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 max-w-sm w-full p-6 relative overflow-hidden animate-scaleIn">
                        <button
                            type="button"
                            onClick={closeAlert}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
                                    alertModal.type === 'success'
                                        ? 'bg-[#fefccf] text-[#f0592a] border-[#f0592a]/20'
                                        : 'bg-red-50 text-red-500 border-red-200/60'
                                }`}
                            >
                                {alertModal.type === 'success' ? (
                                    <CheckCircle2 className="w-7 h-7" />
                                ) : (
                                    <AlertCircle className="w-7 h-7" />
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-zinc-950">
                                {alertModal.title}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                {alertModal.message}
                            </p>

                            <div className="w-full mt-6">
                                <button
                                    type="button"
                                    onClick={closeAlert}
                                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#f0592a] hover:bg-[#d94a1f] transition-all shadow-xs cursor-pointer"
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