import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MessageSquare,
    SlidersHorizontal,
    AlertTriangle,
    Lock,
    CheckCircle2,
    Package,
    Truck,
    Leaf,
    Palette,
    Tag,
    ZoomIn,
    Calendar,
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
    ChevronDown, Play
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
        sizeRatio: [
            { size: 'S', label: 'Nhỏ (S)', qty: '40 chiếc' },
            { size: 'M', label: 'Vừa (M)', qty: '70 chiếc' },
            { size: 'L', label: 'Lớn (L)', qty: '60 chiếc' },
            { size: 'XL', label: 'Rất lớn (XL)', qty: '30 chiếc' },
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
                img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
            },
        ],
        customer: {
            name: 'Julian Lowe',
            initials: 'JL',
            email: 'j.lowe@outerloop.net',
            phone: '+1 (555) 234-8901',
            address: '428 Đường Artisan, Phòng 300\nPortland, OR 97201',
            stats: { completed: 4, openDispute: 1, volume: '112.000.000 ₫' },
        },
        producer: {
            name: 'Studio Nord Artisan Wear',
            lead: 'Chủ nhiệm: Kenzo Mori / Marcus',
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
                </div>
            </div>

            {/* 2. Tiêu đề chính, Huy hiệu & Thao tác */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
                <div className="space-y-1.5">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                        Đơn hàng {order.id}{' '}
                    </h1>
                </div>

                {/* Các nút hành động phía trên bên phải */}
                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
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
                </div>
            </div>

            {/* 4. Lưới 12 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Quy cách trang phục & Phân bổ số lượng */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Thông số kỹ thuật</span>
                                <h2 className="text-base font-bold text-zinc-950">Chi tiết & Số lượng</h2>
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
                        </div>

                        {/* Hình ảnh duyệt mẫu & Bằng chứng lô nhuộm */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-900">Bản duyệt mẫu</span>
                                <span className="text-xs text-zinc-400">3 tệp đính kèm</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {order.mockups.map((m, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden bg-white border border-zinc-200/80 shadow-2xs flex flex-col">
                                        <div className="aspect-square w-full overflow-hidden bg-zinc-100 relative">
                                            <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                    {/* Thẻ hạch toán & Ký quỹ */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
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
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center font-bold text-sm shrink-0">
                                {order.customer.initials}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-zinc-950 block truncate">{order.customer.name}</span>
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
                </div>
            </div>
        </div>
    );
}