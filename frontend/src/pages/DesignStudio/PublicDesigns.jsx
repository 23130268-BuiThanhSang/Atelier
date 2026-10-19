import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Sparkles,
    Send,
    Edit3,
    Layers,
    Loader2,
    AlertCircle,
    Eye,
    Palette
} from 'lucide-react';
import { designApi } from '../../api/designApi';

export default function PublicDesigns() {
    const navigate = useNavigate();
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchPublicDesigns = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const data = await designApi.getPublicDesigns();
                setDesigns(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi khi tải bộ sưu tập thiết kế cộng đồng:', err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicDesigns();
    }, []);

    // Hành động: Sử dụng thiết kế và nhận báo giá
    const handleUseAndQuote = (design) => {
        navigate(`/design-studio/${design.designId}/proposals`, {
            state: {
                designId: design.designId,
                versionId: design.versionNumber || 1,
                title: design.name,
                garmentColor: design.garmentColor || '#F5F2DC',
                previewUrl: design.previewImageUrl,
                isRemix: true
            }
        });
    };

    // Hành động: Mở tùy chỉnh lại trên 2D/3D Canvas trước khi đặt
    const handleRemixInStudio = (design) => {
        navigate(`/design-studio?remixFrom=${design.designId}`, {
            state: { editDesign: design, isRemix: true }
        });
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-8 px-4 sm:px-6 xl:px-12 space-y-6">
            {/* BANNER HEADER */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-zinc-950">Thiết kế từ cộng đồng</h1>
                </div>

                <Link
                    to="/design-studio"
                    className="px-5 py-3 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] shrink-0"
                >
                    <Palette className="w-4 h-4" />
                    <span>Tự tạo mẫu mới</span>
                </Link>
            </div>

            {/* TRẠNG THÁI LOADING */}
            {isLoading && (
                <div className="bg-white rounded-2xl border border-zinc-200/70 p-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#f0592a] animate-spin mb-3" />
                    <p className="text-sm font-bold text-zinc-800">Đang tải bộ sưu tập thiết kế cộng đồng...</p>
                </div>
            )}

            {/* TRẠNG THÁI LỖI */}
            {!isLoading && isError && (
                <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-zinc-900">Không thể tải danh sách thiết kế công khai</p>
                </div>
            )}

            {/* TRẠNG THÁI DANH SÁCH TRỐNG */}
            {!isLoading && !isError && designs.length === 0 && (
                <div className="bg-white rounded-2xl border border-zinc-200/70 p-16 text-center">
                    <Layers className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-zinc-900">Chưa có thiết kế công khai nào</h3>
                </div>
            )}

            {/* DANH SÁCH THIẾT KẾ GRID */}
            {!isLoading && !isError && designs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map((design) => (
                        <div
                            key={design.designId}
                            className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
                        >
                            {/* KHUNG PREVIEW */}
                            <div className="relative bg-zinc-50 border-b border-zinc-100 h-64 p-4 flex items-center justify-center overflow-hidden">
                                {design.previewImageUrl ? (
                                    <img
                                        src={design.previewImageUrl}
                                        alt={design.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-xs text-zinc-400 flex flex-col items-center gap-2">
                                        <Palette className="w-8 h-8 text-zinc-300" />
                                        <span>Không có ảnh preview</span>
                                    </div>
                                )}
                            </div>

                            {/* THÔNG TIN CHI TIẾT */}
                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-zinc-950 truncate" title={design.name}>
                                        {design.name || 'Mẫu áo chưa đặt tên'}
                                    </h3>

                                    {/* HIỂN THỊ TÊN NGƯỜI THIẾT KẾ */}
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                                        <span className="text-zinc-400">Bởi:</span>
                                        <span className="font-semibold text-zinc-700 truncate max-w-[180px]">
                                            {design.designerName || 'Atelier Designer'}
                                        </span>
                                    </div>
                                </div>

                                {/* CỤM NÚT HÀNH ĐỘNG */}
                                <div className="space-y-2">
                                    {/* Nút hành động chính: Sử dụng thiết kế và báo giá */}
                                    <button
                                        type="button"
                                        onClick={() => handleUseAndQuote(design)}
                                        className="w-full py-2.5 px-3 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Sử dụng thiết kế và báo giá</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}