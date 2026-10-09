import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    MessageSquare,
    SlidersHorizontal,
    Gavel,
    AlertTriangle,
    Lock,
    CheckCircle2,
    PauseCircle,
    Package,
    Truck,
    Leaf,
    Palette,
    Tag,
    ZoomIn,
    Calendar,
    Flag,
    Factory,
    FileText,
    Image as ImageIcon,
    Send,
    ShieldCheck,
    User,
    Store,
    Receipt,
    Info,
    Download,
    ChevronDown
} from 'lucide-react';

export default function AdminOrderDetail() {
    const { id } = useParams();
    const orderId = id || '#ORD-9838';

    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [resolutionOption, setResolutionOption] = useState('settlement'); // 'release' | 'refund' | 'settlement'
    const [decisionMemo, setDecisionMemo] = useState(
        'Ban quản trị Atelier đã kiểm tra nhật ký vận chuyển DHL và xác minh bồn nhuộm enzyme tùy chỉnh đã hoàn thành vào ngày 24/10. Dù có phát sinh chậm trễ 48 giờ, việc hiệu chuẩn giặt tẩy acid wash là cần thiết để chuẩn tông màu Pantone theo yêu cầu của khách. Đề xuất phương án hòa giải giảm trừ 10% để chuyển sang giai đoạn in lụa ngay lập tức.'
    );
    const [adminNote, setAdminNote] = useState('');
    const [chatMessage, setChatMessage] = useState('');

    // 1. DỮ LIỆU MẪU: Chi tiết đơn hàng
    const order = {
        id: orderId,
        batchId: '#ATC-280-99A',
        escrowDate: '20/10/2026',
        title: 'Lô may đo thủ công tùy chỉnh (Áo nỉ chui đầu Acid Wash cào rách)',
        productName: 'Áo thun Vintage Washed Oversized Heavy Tee',
        sku: 'ATEL-280-ACID',
        batchSize: 'Tổng 200 sản phẩm',
        baselinePrice: '4.500.000 ₫',
        unitRate: '22.500 ₫ / sản phẩm cơ bản',
        specText: 'Công thức đặt may độc quyền • Xử lý giặt xả màu pigment kết hợp ngâm enzyme đá bọt pumice.',
        sizeRatio: [
            { size: 'S', label: 'Nhỏ (S)', qty: '40 chiếc' },
            { size: 'M', label: 'Vừa (M)', qty: '70 chiếc' },
            { size: 'L', label: 'Lớn (L)', qty: '60 chiếc' },
            { size: 'XL', label: 'Rất lớn (XL)', qty: '30 chiếc' },
        ],
        badges: [
            { label: '100% Cotton hữu cơ chải kỹ định lượng 280 GSM', icon: Leaf, iconColor: 'text-[#f0592a]' },
            { label: 'In lụa 3 màu (Mực Plastisol ngực áo mềm mịn)', icon: Palette, iconColor: 'text-zinc-600' },
            { label: 'Nhãn dệt gáy áo Atelier Damask cao cấp', icon: Tag, iconColor: 'text-zinc-500' },
        ],
        mockups: [
            {
                title: 'Bản in mẫu ngực trước',
                sub: 'Kích thước họa tiết 28x32cm',
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
            },
            {
                title: 'Nhãn dệt & Chi tiết cổ áo',
                sub: 'Quy cách nhãn 40x55mm',
                img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
            },
            {
                title: 'Hình ảnh bồn nhuộm enzyme',
                sub: 'Tải lên lúc 09:15, 24/10',
                badge: 'Xưởng tải lên',
                img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
            },
        ],
        customer: {
            name: 'Julian Lowe',
            company: 'Công ty Sáng tạo Outer Loop LLC',
            tier: 'Khách hàng thân thiết Bạc',
            initials: 'JL',
            email: 'j.lowe@outerloop.net',
            phone: '+1 (555) 234-8901',
            address: '428 Đường Artisan, Phòng 300\nPortland, OR 97201',
            stats: { completed: 4, openDispute: 1, volume: '112.000.000 ₫' },
        },
        producer: {
            name: 'Studio Nord Artisan Wear',
            lead: 'Chủ nhiệm: Kenzo Mori / Marcus',
            tier: 'Xưởng kiểm định Cấp II',
            initials: 'SN',
            email: 'contact@studionord-apparel.com',
            address: 'Cơ sở kho xưởng phân khu Đông Nam\nKhu công nghiệp, Portland OR',
            trustScore: 94,
        },
        accounting: {
            garmentRun: '4.500.000 ₫',
            setupFee: '350.000 ₫',
            freight: '180.000 ₫',
            discount: '-242.500 ₫',
            totalOrder: '4.787.500 ₫',
            depositPaid: '-2.393.750 ₫',
            remainingDue: '2.393.750 ₫',
        },
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto">
            {/* 1. Breadcrumb & Thanh thông tin */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1 font-semibold text-zinc-600 hover:text-[#f0592a] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Quay lại</span>
                    </Link>
                    <span className="text-zinc-300">/</span>
                    <span>Đơn hàng</span>
                    <span className="text-zinc-300">/</span>
                    <span className="font-semibold text-zinc-950">Đơn {order.id}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Khóa ký quỹ: {order.escrowDate}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-zinc-800">Mã lô: {order.batchId}</span>
                </div>
            </div>

            {/* 2. Tiêu đề chính, Huy hiệu & Thao tác */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Cần quản trị viên xử lý
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Lock className="w-3 h-3 text-[#f0592a]" />
                            Có tranh chấp / Tạm dừng ký quỹ
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700">
                            Đơn hàng xưởng B2B
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                        Đơn hàng {order.id}{' '}
                        <span className="text-sm md:text-base font-normal text-zinc-500">— {order.title}</span>
                    </h1>
                </div>

                {/* Các nút hành động phía trên bên phải */}
                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                        <Printer className="w-4 h-4 text-zinc-500" />
                        <span>In phiếu xuất</span>
                    </button>
                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <span>Liên hệ các bên</span>
                    </button>

                    {/* Menu đổi trạng thái */}
                    <div className="relative">
                        <button
                            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                            type="button"
                            className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                            <span>Đổi trạng thái</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                        {statusMenuOpen && (
                            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-lg border border-zinc-200 py-1.5 z-30 text-xs font-medium space-y-0.5">
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                                    <span>Tiếp tục sản xuất (Đang kiểm định)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                    <span>Buộc đóng băng tiền ký quỹ</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                                    <span>Đánh dấu ưu tiên hỏa tốc</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('resolution-card');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Gavel className="w-4 h-4" />
                        <span>Giải quyết tranh chấp</span>
                    </button>
                </div>
            </div>

            {/* 3. Banner cảnh báo: Khiếu nại tranh chấp */}
            <div className="p-4 md:p-5 rounded-2xl bg-red-50/70 border border-red-200/80 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <Flag className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xs font-bold text-red-700">Tranh chấp được ghi nhận: Khách hàng yêu cầu hủy đơn</h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white text-red-600 border border-red-200">
                                    PHIẾU #DISP-409
                                </span>
                            </div>
                            <p className="text-xs text-zinc-700 leading-relaxed max-w-4xl">
                                Người mua yêu cầu hủy đơn vì tiến độ bàn giao bị chậm 3 ngày; Xưởng sản xuất Studio Nord đã tải lên vận đơn DHL xác nhận ngày nhận vải cotton mộc và nhật ký vận hành bồn giặt enzyme tự động. Khoản ký quỹ thông minh hiện đang bị đóng băng ở mức <strong className="text-zinc-950 font-bold">2.425.000 ₫</strong>.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('resolution-card');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="h-8 px-3.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold shadow-2xs transition-colors"
                        >
                            Xem bằng chứng
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg text-zinc-500 hover:text-zinc-800 text-xs font-semibold transition-colors"
                        >
                            Bỏ qua thông báo
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Lưới 12 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Tiến trình sản xuất & Các mốc ký quỹ */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Quy trình sản xuất</span>
                                <h2 className="text-base font-bold text-zinc-950">Tiến độ lô hàng & Các mốc giải ngân ký quỹ</h2>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                Giai đoạn 3: Bị tạm dừng
                            </span>
                        </div>

                        <div className="relative pt-3 pb-2">
                            {/* Thanh tiến độ nền */}
                            <div className="hidden sm:block absolute top-8 left-8 right-8 h-1 bg-zinc-100"></div>
                            <div className="hidden sm:block absolute top-8 left-8 w-[45%] h-1 bg-[#f0592a]"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                                {/* Bước 1 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center shrink-0 z-10 border border-[#f0592a]/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block">Đã tạo đơn</span>
                                        <span className="text-[11px] text-zinc-500 block">Đã cọc 50% ký quỹ</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">20/10/2026</span>
                                    </div>
                                </div>

                                {/* Bước 2 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center shrink-0 z-10 border border-[#f0592a]/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block">Duyệt mẫu in</span>
                                        <span className="text-[11px] text-zinc-500 block">Khớp màu Pantone</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">22/10/2026</span>
                                    </div>
                                </div>

                                {/* Bước 3 (Bị chặn) */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 z-10 ring-4 ring-red-50">
                                        <PauseCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-red-600 block">Nhuộm & Giặt acid</span>
                                        <span className="text-[11px] text-red-500 font-medium block">Tạm hoãn do khiếu nại</span>
                                        <span className="text-[10px] text-red-400 block mt-0.5">24/10 (Quá hạn)</span>
                                    </div>
                                </div>

                                {/* Bước 4 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 z-10">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-700 block">Kiểm định chất lượng</span>
                                        <span className="text-[11px] text-zinc-400 block">Thanh toán 50% còn lại</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Dự kiến 29/10</span>
                                    </div>
                                </div>

                                {/* Bước 5 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 z-10">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-700 block">Giao hàng hoàn tất</span>
                                        <span className="text-[11px] text-zinc-400 block">Đơn vị vận chuyển</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Dự kiến 02/11</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quy cách trang phục & Phân bổ số lượng */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Thông số kỹ thuật</span>
                                <h2 className="text-base font-bold text-zinc-950">Quy cách chi tiết & Phân bổ số lượng</h2>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#faf8e4] text-[#f0592a] border border-[#f0592a]/20">
                                {order.batchSize}
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-zinc-950">{order.productName}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200/70 text-zinc-700">
                                            MÃ SKU: {order.sku}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{order.specText}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-xl font-bold text-[#f0592a] block">{order.baselinePrice}</span>
                                    <span className="text-[11px] text-zinc-400">{order.unitRate}</span>
                                </div>
                            </div>

                            {/* Tỉ lệ kích cỡ */}
                            <div className="pt-2">
                                <span className="text-xs font-bold text-zinc-700 block mb-2">Tỉ lệ phân bổ kích cỡ sản xuất:</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {order.sizeRatio.map((s, idx) => (
                                        <div key={idx} className="p-2.5 rounded-lg bg-white border border-zinc-200/60 shadow-2xs flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center">
                                                    {s.size}
                                                </span>
                                                <span className="text-xs text-zinc-500">{s.label}</span>
                                            </div>
                                            <span className="text-xs font-bold text-zinc-950">{s.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thẻ quy chuẩn chất liệu */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {order.badges.map((b, idx) => {
                                    const Icon = b.icon;
                                    return (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200/80 text-zinc-800 shadow-2xs">
                                            <Icon className={`w-3.5 h-3.5 ${b.iconColor}`} />
                                            {b.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Hình ảnh duyệt mẫu & Bằng chứng lô nhuộm */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-900">Bản duyệt mẫu & Bằng chứng thực tế từ xưởng</span>
                                <span className="text-xs text-zinc-400">3 tệp đính kèm</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {order.mockups.map((m, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
                                        <div className="aspect-square w-full overflow-hidden bg-zinc-100 relative">
                                            <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            {m.badge && (
                                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#f0592a] text-white shadow-xs">
                                                    {m.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white flex items-center justify-between border-t border-zinc-100">
                                            <div>
                                                <span className="text-xs font-bold text-zinc-900 block">{m.title}</span>
                                                <span className="text-[10px] text-zinc-400 block">{m.sub}</span>
                                            </div>
                                            <ZoomIn className="w-4 h-4 text-zinc-400 group-hover:text-[#f0592a] transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Nhật ký sản xuất & Hoạt động kiểm toán */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Dấu vết kiểm toán</span>
                                <h2 className="text-base font-bold text-zinc-950">Nhật ký sản xuất & Hoạt động hệ thống</h2>
                            </div>
                            <button type="button" className="text-xs font-semibold text-[#f0592a] hover:underline flex items-center gap-1">
                                <span>Lọc sự kiện</span>
                            </button>
                        </div>

                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                            {/* Sự kiện 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center ring-4 ring-white shadow-2xs">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200/60 space-y-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-red-700">Khách hàng mở phiếu khiếu nại tranh chấp</span>
                                            <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-white text-red-600 border border-red-200">
                                                Hành động từ người mua
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400">25/10/2026 lúc 14:30</span>
                                    </div>
                                    <p className="text-xs text-zinc-800 leading-relaxed">
                                        “Mốc sản xuất đã trễ 72 giờ mà không hề có thông báo cập nhật hay mã vận đơn. Chúng tôi có sự kiện pop-up thời trang đã lên lịch và không thể chấp nhận việc hoãn giao kéo dài mà không có phương án bồi thường.”
                                    </p>
                                    <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-2">
                                        <span>Người gửi: Julian Lowe</span>
                                        <span>•</span>
                                        <span>Hệ thống tự động kích hoạt cờ tạm giữ ký quỹ thông minh</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sự kiện 2 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center ring-4 ring-white shadow-2xs border border-[#f0592a]/20">
                                    <Factory className="w-3.5 h-3.5" />
                                </div>
                                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-950">Studio Nord đã tải lên bằng chứng tiến độ lô hàng</span>
                                            <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-zinc-200 text-zinc-700">
                                                Hành động từ xưởng
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400">24/10/2026 lúc 09:15</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 leading-relaxed">
                                        “Lô giặt bồn enzyme màu sắc tố đặt may riêng đã xong, hiện đang trong quá trình sấy khô. Xử lý đá bọt pumice acid wash cần thêm 1 ngày để đảm bảo độ đồng màu chuẩn nhất. Lô vải cotton hữu cơ chải kỹ nhận từ DHL vào ngày 21/10 (Vận đơn #DHL-992-1088). Lô hàng sẽ chuyển sang công đoạn in lụa vào sáng mai.”
                                    </p>
                                    <div className="flex items-center gap-3 pt-1 text-xs text-[#f0592a] font-semibold">
                                        <span className="hover:underline cursor-pointer flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" /> van_don_dhl_9921088.pdf
                                        </span>
                                        <span className="text-zinc-300">•</span>
                                        <span className="hover:underline cursor-pointer flex items-center gap-1">
                                            <ImageIcon className="w-3.5 h-3.5" /> hinh_anh_bon_say_nhuom.jpg
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sự kiện 3 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center ring-4 ring-white">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <span className="text-xs font-bold text-zinc-900">Khách hàng đã phê duyệt mẫu thiết kế số</span>
                                        <span className="text-[10px] text-zinc-400">22/10/2026 lúc 11:00</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Khách hàng đã đồng ý vị trí in lụa 3 màu plastisol với độ giảm bão hòa màu 15% trên nền áo màu than chì.
                                    </p>
                                </div>
                            </div>

                            {/* Sự kiện 4 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center ring-4 ring-white">
                                    <Lock className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <span className="text-xs font-bold text-zinc-900">Đã khóa khoản đặt cọc ký quỹ 50%</span>
                                        <span className="text-[10px] text-zinc-400">20/10/2026 lúc 16:45</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Chuyển tiền 2.425.000 ₫ thành công từ Julian Lowe vào hợp đồng ký quỹ Két bảo chứng Atelier #0x82...e9B1.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ghi chú nội bộ dành cho Quản trị viên */}
                        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2 pt-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5" htmlFor="admin-note">
                                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                                    Ghi chú nội bộ bảo mật (Chỉ hiển thị cho đội ngũ Atelier)
                                </label>
                                <span className="text-[10px] text-zinc-400">Hỗ trợ Markdown</span>
                            </div>
                            <textarea
                                id="admin-note"
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Nhập đánh giá bảo mật, lưu ý kiểm tra xưởng sản xuất hoặc chỉ dẫn hòa giải..."
                                className="w-full p-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all resize-none font-medium"
                            />
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] text-zinc-400">Người ghi chú: Quản trị viên cấp cao Marcus Vance</span>
                                <button
                                    type="button"
                                    className="h-8 px-4 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs"
                                >
                                    Đăng ghi chú
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 4. Khung phân xử tranh chấp & Ký quỹ */}
                    <section id="resolution-card" className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#f0592a]/30 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-[#f0592a] tracking-wider block">Hội đồng trọng tài</span>
                                <h2 className="text-base font-bold text-zinc-950">Giải quyết tranh chấp mốc sản xuất & Ký quỹ</h2>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                                Yêu cầu quyết định
                            </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed">
                            Chọn phương án phân xử chính thức. Sau khi xác nhận gửi, hợp đồng ký quỹ thông minh sẽ tự động giải ngân hoặc hoàn trả theo phương án đã chọn.
                        </p>

                        {/* Các lựa chọn phân xử */}
                        <div className="space-y-2.5">
                            {/* Phương án A */}
                            <label
                                onClick={() => setResolutionOption('release')}
                                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    resolutionOption === 'release'
                                        ? 'bg-[#fefccf]/40 border-[#f0592a]'
                                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/70'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="dispute_res"
                                    value="release"
                                    checked={resolutionOption === 'release'}
                                    onChange={() => setResolutionOption('release')}
                                    className="mt-1 w-4 h-4 text-[#f0592a] accent-[#f0592a]"
                                />
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-950">A. Giải phóng ký quỹ cho Xưởng sản xuất (Bằng chứng hợp lệ)</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-semibold bg-zinc-200 text-zinc-700">
                                            Ưu tiên xưởng
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Xưởng sản xuất đã cung cấp bằng chứng xác thực về việc nhận nguyên phụ liệu và thời gian máy chạy. Tiến trình sản xuất được tiếp tục và Studio Nord được gia hạn chính thức thêm 48 giờ.
                                    </p>
                                </div>
                            </label>

                            {/* Phương án B */}
                            <label
                                onClick={() => setResolutionOption('refund')}
                                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    resolutionOption === 'refund'
                                        ? 'bg-[#fefccf]/40 border-[#f0592a]'
                                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/70'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="dispute_res"
                                    value="refund"
                                    checked={resolutionOption === 'refund'}
                                    onChange={() => setResolutionOption('refund')}
                                    className="mt-1 w-4 h-4 text-[#f0592a] accent-[#f0592a]"
                                />
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-950">B. Hoàn trả 100% cho Khách hàng (Hủy đơn hàng)</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-semibold bg-red-100 text-red-700">
                                            Hủy toàn phần
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Xác nhận vi phạm mốc cam kết bàn giao. Hoàn trả ngay khoản cọc 2.425.000 ₫ cho Julian Lowe và hủy lô hàng đang may. Xưởng may được giữ lại số vải mộc chưa in.
                                    </p>
                                </div>
                            </label>

                            {/* Phương án C */}
                            <label
                                onClick={() => setResolutionOption('settlement')}
                                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    resolutionOption === 'settlement'
                                        ? 'bg-[#fefccf]/40 border-[#f0592a]'
                                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/70'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="dispute_res"
                                    value="settlement"
                                    checked={resolutionOption === 'settlement'}
                                    onChange={() => setResolutionOption('settlement')}
                                    className="mt-1 w-4 h-4 text-[#f0592a] accent-[#f0592a]"
                                />
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-950">C. Đề xuất phương án hòa giải / Giảm trừ 10% giá trị lô</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20">
                                            Khuyến nghị hòa giải
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Khấu trừ 450.000 ₫ vào khoản thanh toán cuối cho xưởng như khoản phạt trễ hạn, đồng thời hoàn tiền ngay 450.000 ₫ cho khách hàng kèm nâng cấp gói giao hỏa tốc do xưởng chịu chi phí.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Văn bản quyết định chính thức */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-xs font-bold text-zinc-800 block" htmlFor="decision-memo">
                                Biên bản phân xử chính thức (Sẽ gửi qua email hòa giải đến cả hai bên):
                            </label>
                            <textarea
                                id="decision-memo"
                                rows={3}
                                value={decisionMemo}
                                onChange={(e) => setDecisionMemo(e.target.value)}
                                className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all resize-none leading-relaxed font-medium"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <ShieldCheck className="w-4 h-4 text-[#f0592a]" />
                                <span>Cần xác thực 2 lớp khi gửi biểu mẫu quyết định</span>
                            </div>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto h-10 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
                                >
                                    Lưu bản nháp quyết định
                                </button>
                                <button
                                    type="button"
                                    className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all"
                                >
                                    Thực thi hòa giải
                                </button>
                            </div>
                        </div>
                    </section>

                </div>

                {/* CỘT PHẢI (4 Cột) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 1. Thẻ thông tin khách hàng */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Thông tin khách hàng</h2>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                                {order.customer.tier}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center font-bold text-sm shrink-0">
                                {order.customer.initials}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-zinc-950 block truncate">{order.customer.name}</span>
                                <span className="text-[11px] text-zinc-400 block truncate">{order.customer.company}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs text-zinc-600">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400">Email:</span>
                                <a href={`mailto:${order.customer.email}`} className="text-zinc-900 font-medium hover:text-[#f0592a] transition-colors truncate">
                                    {order.customer.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400">Điện thoại:</span>
                                <span className="text-zinc-900 font-medium">{order.customer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-zinc-400 shrink-0 mt-0.5">Địa chỉ nhận:</span>
                                <span className="text-zinc-700 leading-relaxed whitespace-pre-line">{order.customer.address}</span>
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-around text-center">
                            <div>
                                <span className="text-sm font-bold text-zinc-950 block">{order.customer.stats.completed}</span>
                                <span className="text-[10px] text-zinc-400">Đã giao</span>
                            </div>
                            <div className="w-px h-6 bg-zinc-200"></div>
                            <div>
                                <span className="text-sm font-bold text-red-600 block">{order.customer.stats.openDispute}</span>
                                <span className="text-[10px] text-red-500 font-medium">Tranh chấp</span>
                            </div>
                            <div className="w-px h-6 bg-zinc-200"></div>
                            <div>
                                <span className="text-sm font-bold text-zinc-950 block">{order.customer.stats.volume}</span>
                                <span className="text-[10px] text-zinc-400">Tổng chi tiêu</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Gửi tin nhắn cho Julian</span>
                        </button>
                    </div>

                    {/* 2. Thẻ xưởng sản xuất chịu trách nhiệm */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Xưởng sản xuất chỉ định</h2>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf8e4] text-[#f0592a] border border-[#f0592a]/20">
                                {order.producer.tier}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {order.producer.initials}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-zinc-950 block truncate">{order.producer.name}</span>
                                <span className="text-[11px] text-zinc-400 block truncate">{order.producer.lead}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs text-zinc-600">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400">Email:</span>
                                <a href={`mailto:${order.producer.email}`} className="text-zinc-900 font-medium hover:text-[#f0592a] transition-colors truncate">
                                    {order.producer.email}
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-zinc-400 shrink-0 mt-0.5">Xưởng may:</span>
                                <span className="text-zinc-700 leading-relaxed whitespace-pre-line">{order.producer.address}</span>
                            </div>
                        </div>

                        {/* Điểm uy tín xưởng */}
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Điểm uy tín nhà sản xuất</span>
                                <span className="font-bold text-zinc-950">{order.producer.trustScore} / 100</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                                <div className="h-full bg-[#f0592a] rounded-full" style={{ width: `${order.producer.trustScore}%` }} />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Kênh liên lạc trực tiếp Studio Nord</span>
                        </button>
                    </div>

                    {/* 3. Thẻ hạch toán & Ký quỹ */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Ký quỹ & Hạch toán</h2>
                            </div>
                            <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                                VND (₫)
                            </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Chi phí may đo (200 chiếc @ 22.500 ₫)</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.garmentRun}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Phí tạo mẫu nhuộm & Chế bản in lụa</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.setupFee}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Phí vận chuyển nội địa (Portland)</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.freight}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#f0592a]">
                                <span>Ưu đãi khuyến mãi (-5% Lô đầu tiên)</span>
                                <span className="font-bold">{order.accounting.discount}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                                <span className="flex items-center gap-1">
                                    Phí giao thức ký quỹ <Info className="w-3 h-3 text-zinc-400" />
                                </span>
                                <span className="italic">Atelier</span>
                            </div>

                            <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-950">Tổng giá trị đơn hàng</span>
                                <span className="text-sm font-bold text-zinc-950">{order.accounting.totalOrder}</span>
                            </div>

                            {/* Khối ký quỹ */}
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-[#f0592a]/20 space-y-2 mt-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                                        Đã đặt cọc (50% Ký quỹ)
                                    </span>
                                    <span className="font-bold text-zinc-900">{order.accounting.depositPaid}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-zinc-500 pl-3.5">
                                    <span>Két hợp đồng thông minh</span>
                                    <span className="text-red-600 font-bold uppercase">Đang tạm dừng giải ngân</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-200/70 flex justify-between items-center text-xs">
                                    <span className="font-bold text-zinc-950">Còn lại khi kiểm hàng đạt chuẩn:</span>
                                    <span className="font-bold text-[#f0592a] text-sm">{order.accounting.remainingDue}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full h-10 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                        >
                            <Download className="w-4 h-4 text-zinc-500" />
                            <span>Tải xuống sổ cái kiểm toán (PDF)</span>
                        </button>
                    </div>

                    {/* 4. Khung chat hòa giải nhanh */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">Tin nhắn hòa giải nhanh</span>
                            <span className="w-2 h-2 rounded-full bg-[#f0592a] animate-pulse"></span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Gửi thông báo đồng bộ cùng lúc tới cả khách hàng và xưởng.
                        </p>
                        <div className="relative">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Nhập tin nhắn gửi đến cả hai bên..."
                                className="w-full h-10 pl-3 pr-10 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a]"
                            />
                            <button
                                type="button"
                                className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-[#f0592a] hover:bg-[#d94a1f] text-white flex items-center justify-center transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}