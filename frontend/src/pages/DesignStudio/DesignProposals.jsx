import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronRight,
    Sliders,
    Clock,
    PauseCircle,
    FileEdit,
    Layers,
    Star,
    MapPin,
    Truck,
    Package,
    Quote,
    CheckCircle2,
    Handshake,
    MessageSquare,
    ShieldCheck,
    Download,
    Info,
    ExternalLink,
    Flame,
    Leaf,
    Palette
} from 'lucide-react';

export default function DesignProposals() {
    const { id } = useParams();
    const rfqId = id || '#REQ-88219';

    // State bộ lọc sắp xếp báo giá
    const [sortFilter, setSortFilter] = useState('lowest'); // 'lowest' | 'fastest' | 'rating'
    const [rfqPaused, setRfqPaused] = useState(false);

    // Danh sách các xưởng gửi báo giá
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

    // Sắp xếp báo giá
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
                <Link to="/design-studio" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#f0592a]" />
                    <span>Thiết kế</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                <Link to="/my-orders" className="hover:text-zinc-900 transition-colors">Yêu cầu sản xuất</Link>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-950 font-bold">Báo giá cho thiết kế {rfqId}</span>
            </nav>

            {/* 2. HEADER TỔNG QUAN YÊU CẦU SẢN XUẤT */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                            Yêu cầu đặt may: Vintage Sunburst Echo (50 chiếc)
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setRfqPaused(!rfqPaused)}
                            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                            <PauseCircle className="w-4 h-4 text-zinc-500" />
                            <span>{rfqPaused ? 'Mở lại yêu cầu' : 'Tạm dừng nhận giá'}</span>
                        </button>
                        <Link
                            to="/design-studio"
                            className="px-4 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                        >
                            <FileEdit className="w-4 h-4" />
                            <span>Chỉnh sửa thông số</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. LƯỚI NỘI DUNG CHÍNH (5 CỘT THÔNG SỐ - 7 CỘT DANH SÁCH BÁO GIÁ) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* CỘT TRÁI (5 Cột): Chi tiết thông số đặt may & Tiến độ đấu thầu */}
                <div className="lg:col-span-5 flex flex-col gap-4">

                    {/* Card Thông số kỹ thuật thiết kế */}
                    <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-sm font-bold text-zinc-950">Quy cách thiết kế & Kỹ thuật</h2>
                            </div>
                        </div>

                        {/* Thư viện hình ảnh mặt trước / sau */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="group relative rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 aspect-square flex flex-col items-center justify-center p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=350&auto=format&fit=crop&q=80"
                                    alt="Ảnh in mặt trước"
                                    className="w-full h-full object-contain"
                                />
                                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-zinc-900 shadow-2xs border border-zinc-200/60">
                  Mặt trước: In DTF
                </span>
                            </div>

                            <div className="group relative rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 aspect-square flex flex-col items-center justify-center p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=350&auto=format&fit=crop&q=80"
                                    alt="Ảnh in nhãn gáy"
                                    className="w-full h-full object-contain"
                                />
                                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-zinc-900 shadow-2xs border border-zinc-200/60">
                  Cổ trong: Nhãn dệt
                </span>
                            </div>
                        </div>

                        {/* Bảng thông tin chi tiết */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-start justify-between">
                                <span className="text-zinc-500">Phôi áo nền:</span>
                                <span className="font-bold text-zinc-900 text-right">Atelier Heavyweight 240 GSM (Kem ấm)</span>
                            </div>

                            <div className="flex items-start justify-between">
                                <span className="text-zinc-500">Tổng số lượng:</span>
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
                                <span className="font-semibold text-zinc-800 text-right max-w-[60%]">
                  Mặt trước in DTF (4 màu) + In lụa nhãn cổ (1 màu)
                </span>
                            </div>

                            <div className="flex items-start justify-between">
                                <span className="text-zinc-500">Hạn giao hàng mong muốn:</span>
                                <span className="font-bold text-[#f0592a]">28/10/2026</span>
                            </div>

                            {/* Ghi chú chất lượng từ khách */}
                            <div className="p-3 bg-zinc-50 rounded-xl space-y-1 border border-zinc-200/60">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Yêu cầu chất lượng từ khách hàng:
                </span>
                                <p className="text-zinc-700 italic text-[11px] leading-relaxed">
                                    “Yêu cầu đóng gói từng áo bằng túi sinh học tự hủy và thực hiện giặt xử lý co rút vải trước khi ủi gấp thành phẩm.”
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                            <a href="#" className="text-[#f0592a] font-bold hover:underline flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" />
                                <span>Tải bộ hồ sơ Tech Pack (.ZIP)</span>
                            </a>
                        </div>
                    </div>

                    {/* Card Nhật ký hoạt động đấu thầu (RFQ Activity) */}
                    <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-zinc-950">Hoạt động tiếp nhận báo giá</h2>
                            <span className="text-[11px] text-zinc-400">Cập nhật 14 phút trước</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 text-center">
                            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/50 space-y-0.5">
                                <span className="text-xl font-bold text-[#f0592a] block">3</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Báo giá đã gửi</span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/50 space-y-0.5">
                                <span className="text-xl font-bold text-zinc-950 block">38</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Lượt xưởng xem</span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/50 space-y-0.5">
                                <span className="text-xl font-bold text-zinc-950 block">440k</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Giá thấp nhất</span>
                            </div>
                        </div>

                        {/* Thanh biểu đồ tiến trình thời gian */}
                        <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[11px] text-zinc-400 font-semibold">
                                <span>Đăng: 12/10</span>
                                <span className="text-[#f0592a] font-bold">Đang chọn xưởng</span>
                                <span>Hạn chót: 28/10</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden flex">
                                <div className="bg-[#f0592a] h-full w-2/5"></div>
                                <div className="bg-amber-500 h-full w-1/5"></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CỘT PHẢI (7 Cột): Dòng các Báo giá gửi đến từ các xưởng */}
                <div className="lg:col-span-7 flex flex-col gap-4">

                    {/* Header danh sách & Bộ lọc sắp xếp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-zinc-950">Báo giá từ các xưởng may</h2>
                            <span className="bg-[#f0592a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {sortedProposals.length} Xưởng tham gia
              </span>
                        </div>
                    </div>

                    {/* DANH SÁCH THẺ BÁO GIÁ */}
                    <div className="space-y-4">
                        {sortedProposals.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Ruy-băng đánh dấu phương án tốt nhất */}
                                {item.isBestValue && (
                                    <div className="absolute top-0 right-0 bg-[#f0592a] text-white text-[10px] font-bold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>Lựa chọn tối ưu nhất</span>
                                    </div>
                                )}

                                {/* Hàng 1: Danh tính xưởng & Giá cả */}
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

                                    {/* Cột giá */}
                                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0">
                                        <div className="text-base sm:text-lg font-bold text-[#f0592a]">
                                            {item.unitPrice} <span className="text-xs text-zinc-400 font-normal">/ áo</span>
                                        </div>
                                        <span className="text-xs text-zinc-500">
                      Tổng trọn gói: <strong className="text-zinc-950 font-bold">{item.totalPrice}</strong>
                    </span>
                                    </div>
                                </div>

                                {/* Hàng 2: Thời gian giao hàng & Ưu đãi kỹ thuật */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-50 rounded-xl p-3 text-xs">
                                    <div className="flex items-center gap-2 text-zinc-800">
                                        <Truck className="w-4 h-4 text-[#f0592a] shrink-0" />
                                        <span>Thời gian hoàn thành: <strong className="text-[#f0592a] font-bold">{item.leadDays}</strong> (Bàn giao {item.deliveryDate})</span>
                                    </div>
                                </div>

                                {/* Hàng 3: Lời nhắn từ chủ xưởng */}
                                <div className="flex gap-2.5 bg-[#faf8e4]/60 p-3.5 rounded-xl border border-[#f0592a]/20">
                                    <Quote className="w-4 h-4 text-[#f0592a] shrink-0 mt-0.5" />
                                    <p className="text-xs text-zinc-700 italic leading-relaxed">
                                        “{item.message}”
                                    </p>
                                </div>

                                {/* Hàng 4: Thao tác lựa chọn */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-100">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                                        >
                                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                                            <span>Nhắn tin / Hồ sơ</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5"
                                        >
                                            <Handshake className="w-4 h-4" />
                                            <span>Chấp thuận báo giá</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}