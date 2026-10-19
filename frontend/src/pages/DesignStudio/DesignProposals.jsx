import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    ChevronRight,
    Sliders,
    PauseCircle,
    FileEdit,
    Layers,
    Star,
    MapPin,
    Truck,
    Quote,
    CheckCircle2,
    Handshake,
    MessageSquare,
    Download,
    Flame
} from 'lucide-react';

export default function DesignProposals() {
    const { id } = useParams();
    const location = useLocation();

    // Dữ liệu mẫu thiết kế nhận từ Modal chuyển sang hoặc fallback mặc định
    const [designInfo, setDesignInfo] = useState({
        designId: id || '#REQ-88219',
        versionId: location.state?.versionId || 1,
        title: location.state?.title || 'Vintage Sunburst Echo',
        garmentColor: location.state?.garmentColor || '#F5F2DC',
        previewUrl: location.state?.previewUrl || null
    });

    // Nếu người dùng F5 hoặc truy cập trực tiếp qua link URL, tải từ backend theo ID
    useEffect(() => {
        if (!location.state?.title && id) {
            fetch(`/api/v1/designs/${id}`)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data) {
                        setDesignInfo({
                            designId: data.id || id,
                            versionId: data.currentVersion || 1,
                            title: data.name || 'Mẫu thiết kế áo thun',
                            garmentColor: data.garmentColor || '#F5F2DC',
                            previewUrl: data.previewImageUrl || null
                        });
                    }
                })
                .catch((err) => console.warn('Không thể nạp thông tin thiết kế từ API:', err));
        }
    }, [id, location.state]);

    // State bộ lọc sắp xếp báo giá
    const [sortFilter] = useState('lowest');
    const [rfqPaused, setRfqPaused] = useState(false);

    // Danh sách các xưởng gửi báo giá mẫu
    const proposals = [
        {
            id: 1,
            makerName: 'Studio Kanto Printmakers',
            badge: 'ĐÃ XÁC MINH',
            rating: 4.9,
            completedOrders: 340,
            hub: 'Trạm xưởng Tokyo',
            logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
            unitPrice: '440.000 ₫',
            totalPrice: '22.000.000 ₫',
            leadDays: '9 ngày làm việc',
            deliveryDate: '24/10',
            message:
                'Chào bạn, xưởng hiện có sẵn phôi áo cotton hữu cơ 240 GSM màu kem tại xưởng và có thể in test màu DTF vào sáng mai. Giá đã bao gồm túi bọc sinh học và dịch vụ giặt xử lý co mềm vải.',
            isBestValue: true,
            priceVal: 18.5,
            deliveryVal: 9,
            ratingVal: 4.9,
        },
        {
            id: 2,
            makerName: 'Heritage Press Co.',
            badge: 'NGHỆ NHÂN CẤP CAO',
            rating: 4.8,
            completedOrders: 190,
            hub: 'Trạm xưởng Berlin',
            logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
            unitPrice: '475.000 ₫',
            totalPrice: '23.750.000 ₫',
            leadDays: '11 ngày làm việc',
            deliveryDate: '26/10',
            message:
                'Xưởng có kinh nghiệm chuyên sâu về tách màu in trame cổ điển nhiều lớp. Cam kết chuẩn xác dải màu hoàng hôn Sunburst bằng mực gốc nước cao cấp cho cảm giác sờ vải mềm mịn tự nhiên.',
            priceVal: 19.8,
            deliveryVal: 11,
            ratingVal: 4.8,
        },
        {
            id: 3,
            makerName: 'Lisbon Textile Workshop',
            badge: 'XƯỞNG NGHỆ NHÂN',
            rating: 4.7,
            completedOrders: 120,
            hub: 'Trạm xưởng Lisbon',
            logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=140&auto=format&fit=crop&q=80',
            unitPrice: '500.000 ₫',
            totalPrice: '25.000.000 ₫',
            leadDays: '13 ngày làm việc',
            deliveryDate: '30/10',
            message:
                'Xưởng chuyên biệt công nghệ xả màu (discharge) kết hợp in lai DTF giúp hình in trên nền áo cotton dày dặn thấm hoàn toàn vào sớ vải, không hề có cảm giác cộm dính cao su.',
            priceVal: 21.0,
            deliveryVal: 13,
            ratingVal: 4.7,
        },
    ];

    const sortedProposals = [...proposals].sort((a, b) => {
        if (sortFilter === 'lowest') return a.priceVal - b.priceVal;
        if (sortFilter === 'fastest') return a.deliveryVal - b.deliveryVal;
        if (sortFilter === 'rating') return b.ratingVal - a.ratingVal;
        return 0;
    });

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-5 px-3 sm:px-6 xl:px-10 space-y-4">
            {/* 1. THANH BREADCRUMB */}
            <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium flex-wrap">
                <div className="transition-colors flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#f0592a]" />
                    <span>Thiết kế</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-950 font-bold">Nhận báo giá</span>
            </nav>

            {/* 2. HEADER TỔNG QUAN */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                                {designInfo.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setRfqPaused(!rfqPaused)}
                            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                            <PauseCircle className="w-4 h-4 text-zinc-500" />
                            <span>{rfqPaused ? 'Mở lại yêu cầu' : 'Tạm dừng nhận giá'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. NỘI DUNG CHÍNH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* CỘT TRÁI: Quy cách mẫu thiết kế vừa lưu */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-sm font-bold text-zinc-950">Quy cách thiết kế & Kỹ thuật</h2>
                            </div>
                        </div>

                        {/* Bản xem trước thiết kế (Ảnh 2 mặt ghép đã lưu) */}
                        <div className="rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 p-2 flex flex-col items-center justify-center">
                            {designInfo.previewUrl ? (
                                <img
                                    src={designInfo.previewUrl}
                                    alt="Bản thiết kế 2 mặt"
                                    className="w-full h-auto max-h-56 object-contain rounded-lg"
                                />
                            ) : (
                                <div className="h-40 flex items-center justify-center text-xs text-zinc-400">
                                    Chưa có ảnh xem trước
                                </div>
                            )}
                            <span className="mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                                Phối cảnh 2 mặt (Trước & Sau)
                            </span>
                        </div>

                        {/* Bảng thông tin chi tiết */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Màu phôi áo:</span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs"
                                        style={{ backgroundColor: designInfo.garmentColor }}
                                    />
                                    <span className="font-bold text-zinc-900 uppercase">
                                        {designInfo.garmentColor}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start justify-between">
                                <span className="text-zinc-500">Số lượng dự kiến:</span>
                                <div className="text-right">
                                    <span className="font-bold text-zinc-950">50 Chiếc</span>
                                    <div className="flex gap-1 justify-end mt-1 text-[10px] font-bold">
                                        <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">10 S</span>
                                        <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">15 M</span>
                                        <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">15 L</span>
                                        <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">10 XL</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between">
                                <span className="text-zinc-500">Công nghệ in:</span>
                                <span className="font-semibold text-zinc-800 text-right">
                                    In Kỹ thuật số DTF 2 Mặt
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                            <a href="#" className="text-[#f0592a] font-bold hover:underline flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" />
                                <span>Tải bộ hồ sơ Tech Pack (.ZIP)</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Danh sách báo giá từ xưởng */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-zinc-950">Báo giá từ các xưởng may</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedProposals.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {item.isBestValue && (
                                    <div className="absolute top-0 right-0 bg-[#f0592a] text-white text-[10px] font-bold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>Lựa chọn tối ưu nhất</span>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.logo}
                                            alt={item.makerName}
                                            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                                        />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-zinc-950 text-sm hover:text-[#f0592a] cursor-pointer transition-colors">
                                                    {item.makerName}
                                                </span>
                                                <span className="bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                                    <CheckCircle2 className="w-3 h-3" /> {item.badge}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                                                <span className="flex items-center gap-0.5 font-bold text-[#f0592a]">
                                                    <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                                                </span>
                                                <span>•</span>
                                                <span>{item.completedOrders} đơn hoàn tất</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-0.5">
                                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {item.hub}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0">
                                        <div className="text-base sm:text-lg font-bold text-[#f0592a]">
                                            {item.unitPrice} <span className="text-xs text-zinc-400 font-normal">/ áo</span>
                                        </div>
                                        <span className="text-xs text-zinc-500">
                                            Tổng: <strong className="text-zinc-950 font-bold">{item.totalPrice}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 rounded-xl p-3 text-xs flex items-center gap-2 text-zinc-800">
                                    <Truck className="w-4 h-4 text-[#f0592a] shrink-0" />
                                    <span>Thời gian hoàn thành: <strong className="text-[#f0592a] font-bold">{item.leadDays}</strong> (Bàn giao {item.deliveryDate})</span>
                                </div>

                                <div className="flex gap-2.5 bg-[#faf8e4]/60 p-3.5 rounded-xl border border-[#f0592a]/20">
                                    <Quote className="w-4 h-4 text-[#f0592a] shrink-0 mt-0.5" />
                                    <p className="text-xs text-zinc-700 italic leading-relaxed">
                                        “{item.message}”
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-zinc-100">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                    >
                                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                                        <span>Nhắn tin</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="px-5 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Handshake className="w-4 h-4" />
                                        <span>Chấp thuận báo giá</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}