import React, { useState } from 'react';
import {
    ChevronRight,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Printer,
    Minus,
    Plus,
    Camera,
    RotateCw,
    Upload,
    Layers,
    MessageSquare,
    AlertTriangle,
    Download,
    Info,
    Lock,
    List,
    Truck
} from 'lucide-react';

export default function ProducerDashboard() {
    const [activeTab, setActiveTab] = useState('in-production');
    const [currentUnits, setCurrentUnits] = useState(38);
    const totalUnits = 50;
    const [stageNotes, setStageNotes] = useState(
        'Căn chỉnh bản in 4 màu đã hiệu chuẩn trên bàn in xoay. Đã hoàn thành sấy hầm nhiệt 160°C cho 38 áo đầu tiên. Mẫu thử độ bền màu đạt chuẩn kiểm tra ma sát.'
    );
    const [notifyClient, setNotifyClient] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    // Bộ điều khiển tăng giảm số lượng sản phẩm hoàn thành
    const adjustCount = (delta) => {
        setCurrentUnits((prev) => {
            const next = prev + delta;
            if (next < 0) return 0;
            if (next > totalUnits) return totalUnits;
            return next;
        });
    };

    // Thêm nhanh thẻ ghi chú mẫu
    const insertTag = (tagText) => {
        setStageNotes((prev) => (prev ? `${prev.trim()} | ${tagText}` : tagText));
    };

    // Kích hoạt đồng bộ với cổng theo dõi của khách hàng
    const triggerSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setSyncSuccess(true);
            setTimeout(() => {
                setSyncSuccess(false);
            }, 2500);
        }, 900);
    };

    const progressPercent = Math.round((currentUnits / totalUnits) * 100);

    // Dữ liệu hàng đợi đơn hàng
    const queueOrders = [
        {
            id: '#TS-99420',
            title: 'Vintage Sunburst Echo',
            units: '50 chiếc',
            spec: 'Cotton kem 240 GSM',
            status: 'Đang in',
            stage: 'In & Sấy nhiệt',
            due: 'Hạn: 28/10',
            progress: 76,
            isActive: true,
        },
        {
            id: '#TS-99381',
            title: 'Tokyo Cyber Grid',
            units: '100 chiếc',
            spec: 'Cotton đen Onyx 280 GSM',
            status: 'Cắt vải',
            stage: 'Cắt phôi chính xác',
            due: 'Hạn: 02/11',
            progress: 32,
        },
        {
            id: '#TS-99214',
            title: 'Forest Flora Botanical',
            units: '30 chiếc',
            spec: 'Cotton rêu Moss 200 GSM',
            status: 'Kiểm định',
            stage: 'Kiểm tra chất lượng cuối',
            due: 'Hạn: 25/10 (Gấp)',
            progress: 88,
            isWarning: true,
        },
        {
            id: '#TS-99105',
            title: 'Form & Axis Minimal',
            units: '75 chiếc',
            spec: 'Cotton mộc Natural 220 GSM',
            status: 'Chuẩn bị in',
            stage: 'Phơi bản & Căn khung',
            due: 'Hạn: 05/11',
            progress: 15,
        },
    ];

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-4 sm:px-8 xl:px-12 space-y-6">
            {/* 1. Header Điều hành & Chỉ số xưởng */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium flex-wrap">
                            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Xưởng sản xuất</span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-zinc-900 font-bold">Lô #TS-99420</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                            Tiến độ sản xuất và bàn giao
                        </h1>
                    </div>
                </div>

                {/* Thanh lọc trạng thái đơn */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
                    {[
                        { id: 'all', label: 'Tất cả đơn hoạt động', count: 6 },
                        { id: 'in-production', label: 'Đang sản xuất', count: 3 },
                        { id: 'pending-qc', label: 'Chờ duyệt kiểm định QC', count: 1 },
                        { id: 'completed', label: 'Đã hoàn tất / Đã gửi', count: 24 },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-[#f0592a] text-white'
                                        : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/70'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                                        isActive ? 'bg-white/20 text-white font-bold' : 'bg-zinc-100 text-zinc-700 font-semibold'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Bố cục 2 cột mở rộng: Cột trái sidebar cố định chiều ngang, Cột phải dãn hết phần còn lại */}
            <div className="w-full flex flex-col xl:flex-row gap-6 items-start">

                {/* CỘT TRÁI: Hàng đợi đơn & Ký quỹ (Độ rộng tối ưu trên màn hình lớn) */}
                <aside className="w-full xl:w-[360px] 2xl:w-[400px] flex-shrink-0 space-y-5">
                    {/* Hộp hàng đợi sản xuất */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <List className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Hàng đợi xưởng trực tiếp</h2>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                                4 Đơn chờ
                            </span>
                        </div>

                        {/* Danh sách thẻ đơn trong hàng đợi */}
                        <div className="space-y-3">
                            {queueOrders.map((ord, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-xl p-3.5 transition-all cursor-pointer border ${
                                        ord.isActive
                                            ? 'bg-[#faf8e4]/70 border-[#f0592a]/40 shadow-xs'
                                            : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200/60'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-zinc-950">{ord.id}</span>
                                                <span
                                                    className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                                                        ord.isActive
                                                            ? 'bg-amber-100 text-amber-900'
                                                            : 'bg-zinc-200 text-zinc-700'
                                                    }`}
                                                >
                                                    {ord.status}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-zinc-900 block mt-0.5">{ord.title}</span>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-bold text-[#f0592a] block">{ord.units}</span>
                                            <p className="text-[10px] text-zinc-400">{ord.spec}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-zinc-500 mt-2.5">
                                        <span className="flex items-center gap-1">
                                            {ord.isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#f0592a] animate-ping" />}
                                            {ord.stage}
                                        </span>
                                        <span className={`text-[11px] font-semibold ${ord.isWarning ? 'text-red-600' : 'text-zinc-700'}`}>
                                            {ord.due}
                                        </span>
                                    </div>

                                    <div className="w-full bg-zinc-200/70 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${ord.isWarning ? 'bg-emerald-600' : 'bg-[#f0592a]'}`}
                                            style={{ width: `${ord.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Widget tóm tắt ký quỹ Escrow */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                            <span className="text-sm font-bold text-zinc-950">Ký quỹ bảo chứng xưởng</span>
                            <Lock className="w-4 h-4 text-[#f0592a]" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
                                <span className="text-xs text-zinc-500 block">Tổng số áo may</span>
                                <span className="text-lg font-bold text-zinc-950 block mt-0.5">255 chiếc</span>
                                <span className="text-[10px] text-zinc-400 block mt-0.5">Qua 4 lượt may</span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
                                <span className="text-xs text-zinc-500 block">Tiền ký quỹ đã khóa</span>
                                <span className="text-lg font-bold text-[#f0592a] block mt-0.5">96.000.000 ₫</span>
                                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Tự động giải ngân</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CỘT PHẢI: Mở rộng toàn bộ chiều ngang còn lại */}
                <div className="w-full xl:flex-1 space-y-5 min-w-0">

                    {/* Header lô đang may */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-100">
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                                    <Printer className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-zinc-950">
                                        Đơn hàng #TS-99420: "Vintage Sunburst Echo"
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-500 mt-0.5">
                                        <span>Khách hàng: <strong className="text-zinc-900">Elena Rostova Studio</strong></span>
                                        <span>•</span>
                                        <span>50 Áo (Heavyweight 240 GSM)</span>
                                        <span>•</span>
                                        <span>Màu: Kem ấm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mốc ký quỹ */}
                            <div className="sm:text-right shrink-0">
                                <span className="text-xs text-zinc-400 block">Ký quỹ theo mốc</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-base font-bold text-emerald-700">11.500.000 ₫</span>
                                    <span className="text-xs text-zinc-400">/ 23.000.000 ₫</span>
                                </div>
                            </div>
                        </div>

                        {/* Quy trình 6 bước may đo */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold uppercase tracking-wider text-zinc-400">Dây chuyền sản xuất</span>
                                <span className="text-[#f0592a] font-bold">Bước 3 / 6 Đang chạy</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 text-xs">
                                {/* Bước 1 */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-emerald-800">Bước 1</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                    </div>
                                    <span className="font-semibold text-zinc-900 mt-1">Đã xác nhận</span>
                                    <span className="text-[10px] text-emerald-700">14/10</span>
                                </div>

                                {/* Bước 2 */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-emerald-800">Bước 2</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                    </div>
                                    <span className="font-semibold text-zinc-900 mt-1">Giặt co rút</span>
                                    <span className="text-[10px] text-emerald-700">16/10</span>
                                </div>

                                {/* Bước 3 (Đang chạy) */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-[#faf8e4] border border-[#f0592a]/30 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[#f0592a] uppercase">Đang in</span>
                                        <span className="w-2 h-2 rounded-full bg-[#f0592a] animate-pulse"></span>
                                    </div>
                                    <span className="font-bold text-zinc-950 mt-1">In & Sấy</span>
                                    <span className="text-[10px] text-[#f0592a] font-bold">Lô 38/50</span>
                                </div>

                                {/* Bước 4 */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 opacity-60">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-zinc-500">Bước 4</span>
                                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                    </div>
                                    <span className="font-medium text-zinc-600 mt-1">Kiểm định QC</span>
                                    <span className="text-[10px] text-zinc-400">Đang chờ</span>
                                </div>

                                {/* Bước 5 */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 opacity-60">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-zinc-500">Bước 5</span>
                                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                                    </div>
                                    <span className="font-medium text-zinc-600 mt-1">Đóng gói</span>
                                    <span className="text-[10px] text-zinc-400">Mã vạch</span>
                                </div>

                                {/* Bước 6 */}
                                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 opacity-60">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-zinc-500">Bước 6</span>
                                        <Truck className="w-3.5 h-3.5 text-zinc-400" />
                                    </div>
                                    <span className="font-medium text-zinc-600 mt-1">Bàn giao</span>
                                    <span className="text-[10px] text-zinc-400">Chuyển phát</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cập nhật trạng thái máy in & Đếm số áo */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Printer className="w-5 h-5 text-[#f0592a]" />
                                <h3 className="text-base font-bold text-zinc-950">Cập nhật tiến độ & Bằng chứng công đoạn</h3>
                            </div>
                        </div>

                        {/* Bộ đếm số lượng */}
                        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-zinc-900 block">Số áo đã in & qua sấy nhiệt</span>
                                    <span className="text-[11px] text-zinc-500">Bấm tăng số lượng mỗi khi áo chạy xong qua băng chuyền sấy</span>
                                </div>

                                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-zinc-200/80 shadow-2xs">
                                    <button
                                        type="button"
                                        onClick={() => adjustCount(-1)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-1 px-3">
                                        <span className="text-lg font-bold text-zinc-950">{currentUnits}</span>
                                        <span className="text-xs text-zinc-400">/ {totalUnits}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => adjustCount(1)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Thanh tiến độ */}
                            <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Mức độ hoàn thành</span>
                                    <span className="font-bold text-zinc-900">{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-zinc-200/70 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#f0592a] h-full rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ghi chú nhật ký sản xuất */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <label htmlFor="stage-notes" className="font-bold text-zinc-900">
                                    Nhật ký sản xuất & Ghi chú kỹ thuật
                                </label>
                            </div>
                            <textarea
                                id="stage-notes"
                                rows={3}
                                value={stageNotes}
                                onChange={(e) => setStageNotes(e.target.value)}
                                placeholder="Nhập thông tin về mực in, nhiệt độ sấy, độ chồng màu hoặc lịch trình..."
                                className="w-full p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium leading-relaxed"
                            />
                        </div>

                        {/* Bằng chứng xác thực tại xưởng (WIP) */}
                        <div className="space-y-3 pt-2 border-t border-zinc-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-zinc-900 block">
                                        Bằng chứng ảnh thực tế
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                                {/* Ảnh 1 */}
                                <div className="group rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col">
                                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80"
                                            alt="Ảnh in lụa"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                                            1080p
                                        </span>
                                    </div>
                                    <div className="p-2.5 space-y-0.5">
                                        <span className="text-xs font-bold text-zinc-900 block truncate">Ảnh căn chỉnh in ngực trước</span>
                                        <span className="text-[10px] text-zinc-400 block">Tải lên 14 phút trước bởi Jin K.</span>
                                    </div>
                                </div>

                                {/* Ảnh 2 */}
                                <div className="group rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col">
                                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80"
                                            alt="Cảm biến nhiệt"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                                            Nhật ký cảm biến
                                        </span>
                                    </div>
                                    <div className="p-2.5 space-y-0.5">
                                        <span className="text-xs font-bold text-zinc-900 block truncate">Nhiệt độ hầm sấy (160°C)</span>
                                        <span className="text-[10px] text-zinc-400 block">Tải lên 35 phút trước bởi Jin K.</span>
                                    </div>
                                </div>

                                {/* Nút tải thêm ảnh */}
                                <div className="rounded-xl p-4 bg-zinc-50 hover:bg-[#faf8e4]/60 border-2 border-dashed border-zinc-200 hover:border-[#f0592a]/40 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 min-h-[140px] group sm:col-span-2 2xl:col-span-1">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#f0592a] group-hover:scale-110 shadow-2xs transition-all">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block">Tải thêm bằng chứng</span>
                                        <span className="text-[10px] text-zinc-400 block">JPEG, PNG hoặc RAW đến 25MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox thông báo */}
                        <div className="flex items-center gap-3 pt-1">
                            <input
                                id="notify-client-toggle"
                                type="checkbox"
                                checked={notifyClient}
                                onChange={(e) => setNotifyClient(e.target.checked)}
                                className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                            />
                            <label htmlFor="notify-client-toggle" className="text-xs text-zinc-800 cursor-pointer select-none">
                                Gửi thông báo ngay cho khách hàng <strong className="text-zinc-950 font-bold">Elena Rostova</strong> kèm ảnh chụp thực tế và mốc thời gian
                            </label>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isSyncing}
                                onClick={triggerSync}
                                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                                    syncSuccess ? 'bg-emerald-600' : 'bg-[#f0592a] hover:bg-[#d94a1f]'
                                }`}
                            >
                                {isSyncing ? (
                                    <>
                                        <RotateCw className="w-4 h-4 animate-spin" />
                                        <span>Đang đồng bộ với cổng khách hàng...</span>
                                    </>
                                ) : syncSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Đã cập nhật & Lưu nhật ký!</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span>Xuất bản tiến độ & Đồng bộ cho khách</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}