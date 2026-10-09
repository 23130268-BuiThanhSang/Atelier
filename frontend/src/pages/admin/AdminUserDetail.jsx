import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Calendar,
    ShieldCheck,
    UserCheck,
    Send,
    Ban,
    ChevronDown,
    Check,
    BadgeCheck,
    Factory,
    Phone,
    MapPin,
    TrendingUp,
    FileText,
    Leaf,
    Images,
    Eye,
    Download,
    ClipboardCheck,
    X,
    Shield,
    CheckCircle2,
    History,
    ArrowRight
} from 'lucide-react';

export default function AdminUserDetail() {
    const { id } = useParams(); // Lấy ID người dùng từ URL (/admin/users/:id)

    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Xưởng sản xuất (Hoạt động)');
    const [decisionStatus, setDecisionStatus] = useState(null); // 'approved' | 'rejected' | null
    const [decisionNote, setDecisionNote] = useState('');

    // 1. DỮ LIỆU MẪU: Thông tin chi tiết nhà sản xuất (Studio Nord)
    const user = {
        id: id || '#USR-8492',
        name: 'Studio Nord Artisan Wear',
        status: 'Chờ xác minh',
        tier: 'Nghệ nhân Cấp II',
        email: 'contact@studionord-apparel.com',
        phone: '+1 (555) 382-9014',
        location: 'Portland, Oregon, Hoa Kỳ',
        joined: '12/11/2023',
        classification: 'Xưởng may (Nhà sản xuất)',
        avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=240&auto=format&fit=crop&q=80',
        bio: 'Chuyên gia công vải cotton hữu cơ chải kỹ định lượng 280gsm, in lụa thủ công cao cấp và xử lý wash acid vintage. Xưởng may tại Portland trang bị đầy đủ máy in trực tiếp kỹ thuật số và bàn in lụa tay chuẩn công nghiệp.',
        trustScore: 94,
        batchesCount: 38,
        metrics: {
            onTimeDispatch: '98%',
            disputeRate: '0.4%',
            qualityScore: '4.9',
            tierLevel: 'Cấp 2',
        },
        facility: {
            name: 'Cơ sở: Kho xưởng Phân khu Đông Nam',
            desc: 'Không gian 390m² phục vụ in lụa, buồng sấy nhiệt và trạm kiểm định chất lượng xuất xưởng.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
        },
        documents: [
            {
                id: 1,
                title: 'Giấy phép đăng ký kinh doanh & Mã số thuế (EIN-9482103).pdf',
                type: 'pdf',
                icon: FileText,
                iconColor: 'text-[#f0592a]',
            },
            {
                id: 2,
                title: 'Chứng nhận vải hữu cơ GOTS 2026.pdf',
                type: 'gots',
                icon: Leaf,
                iconColor: 'text-emerald-600',
            },
            {
                id: 3,
                title: 'Hình ảnh thực tế xưởng may & Máy in lụa (4 tệp).zip',
                type: 'gallery',
                icon: Images,
                iconColor: 'text-[#f0592a]',
            },
        ],
        orders: [
            { id: '#ORD-9824', brand: 'Pacific Drift Co.', spec: 'Áo thun Vintage 280gsm', qty: '450 chiếc', amount: '83.250.000 ₫', status: 'In Production' },
            { id: '#ORD-9740', brand: 'Komorebi Apparel', spec: 'Áo nỉ cổ tròn Acid-wash dáng hộp', qty: '600 chiếc', amount: '114.000.000 ₫', status: 'Delivered' },
            { id: '#ORD-9612', brand: 'Sylvan Club Works', spec: 'Phôi áo thun Organic Heavyweight', qty: '1.200 chiếc', amount: '198.000.000 ₫', status: 'Delivered' },
            { id: '#ORD-9533', brand: 'Vapour Archive', spec: 'Áo nỉ Cotton in xốp Puff Print', qty: '300 chiếc', amount: '57.500.000 ₫', status: 'Delivered' },
        ],
        auditLogs: [
            { title: 'Tải lên gia hạn mã số thuế (EIN-9482103)', meta: '14/11/2026 • 14:22 • IP 67.183.91.12', isDotOrange: true },
            { title: 'Đăng nhập thành công bằng khóa bảo mật vật lý 2FA', meta: '14/11/2026 • 13:58 • IP 67.183.91.12' },
            { title: 'Cập nhật thông tin tài khoản nhận thanh toán ngân hàng', meta: '02/11/2026 • 09:15 • Quản trị viên Marcus' },
            { title: 'Đăng ký tài khoản & xác minh địa chỉ email', meta: '12/11/2026 • 11:04 • Hệ thống tự động' },
        ],
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Breadcrumbs & Nút quay lại */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 flex-wrap">
                    <Link to="/admin/users" className="hover:text-[#f0592a] transition-colors">Người dùng</Link>
                    <span>/</span>
                    <span className="font-semibold text-zinc-900">{user.name} (Mã: {user.id})</span>
                </div>
                <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#f0592a] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại danh sách người dùng</span>
                </Link>
            </div>

            {/* 2. Thẻ hồ sơ đầu trang */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5 flex-col sm:flex-row">
                    <div className="relative w-20 h-20 rounded-2xl bg-zinc-100 overflow-hidden shadow-xs shrink-0 border border-zinc-200/70">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f0592a] ring-2 ring-white"></span>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">{user.name}</h1>
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200 tracking-wider">
                                {user.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600">
                                {user.tier}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                {user.email}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                Tham gia {user.joined}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                                Mã ID: {user.id}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nút hành động phía trên bên phải */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Menu đổi vai trò */}
                    <div className="relative">
                        <button
                            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                            type="button"
                            className="h-10 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors"
                        >
                            <UserCheck className="w-4 h-4 text-zinc-600" />
                            <span>Đổi vai trò</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        </button>
                        {roleMenuOpen && (
                            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-lg border border-zinc-200 py-1.5 z-30 text-xs font-medium">
                                {[
                                    'Xưởng sản xuất (Hoạt động)',
                                    'Nhà sáng tạo / Thương nhân',
                                    'Đối tác dệt may'
                                ].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => { setSelectedRole(r); setRoleMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center justify-between text-zinc-700"
                                    >
                                        <span>{r}</span>
                                        {selectedRole === r && <Check className="w-4 h-4 text-[#f0592a]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Send className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Gửi tin nhắn</span>
                    </button>

                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Đình chỉ tài khoản</span>
                    </button>
                </div>
            </div>

            {/* 3. Lưới nội dung 12 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Khối Hồ sơ xưởng & Chỉ số tín nhiệm */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Hồ sơ nhà sản xuất & Năng lực may thủ công</h2>
                            </div>
                            <span className="text-[11px] font-semibold uppercase bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                                Xưởng chuyên môn cao
                            </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed italic">
                            "{user.bio}"
                        </p>

                        {/* Lưới phân loại thông tin */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Phân loại tài khoản</span>
                                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                                    <Factory className="w-4 h-4 text-[#f0592a]" />
                                    {user.classification}
                                </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Điện thoại liên hệ</span>
                                <span className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                    {user.phone}
                                </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Địa điểm xưởng</span>
                                <span className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                    {user.location}
                                </span>
                            </div>
                        </div>

                        {/* Thẻ Trust Index tròn */}
                        <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5 w-full md:w-auto">
                                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xs shrink-0 border border-zinc-200/60">
                                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-zinc-200"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3.2"
                                        />
                                        <path
                                            className="text-[#f0592a]"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="94, 100"
                                            strokeLinecap="round"
                                            strokeWidth="3.2"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-lg font-bold text-zinc-950 leading-none">{user.trustScore}</span>
                                        <span className="text-[9px] font-semibold text-zinc-400">/ 100</span>
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <span className="text-sm font-bold text-zinc-950">Chỉ số tín nhiệm thủ công</span>
                                    <p className="text-xs text-zinc-500">Được tính dựa trên {user.batchesCount} lô sản xuất hoàn thành đạt chuẩn</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto flex-1">
                                {[
                                    { label: 'Giao đúng hạn', val: user.metrics.onTimeDispatch, valColor: 'text-[#f0592a]' },
                                    { label: 'Tỷ lệ tranh chấp', val: user.metrics.disputeRate, valColor: 'text-zinc-900' },
                                    { label: 'Chất lượng (5.0)', val: user.metrics.qualityScore, valColor: 'text-emerald-700' },
                                    { label: 'Hạng xưởng', val: user.metrics.tierLevel, valColor: 'text-zinc-900' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col bg-white p-2.5 rounded-xl text-center border border-zinc-200/50 shadow-2xs">
                                        <span className={`text-sm font-bold ${item.valColor}`}>{item.val}</span>
                                        <span className="text-[10px] font-medium text-zinc-400 mt-0.5">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Khối Hồ sơ chứng nhận năng lực xưởng may */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-[#f0592a]" />
                                <div>
                                    <h2 className="text-base font-bold text-zinc-950">Hồ sơ thẩm định nhà sản xuất & Năng lực xưởng may</h2>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-center">
                                Đang chờ xác minh
                            </span>
                        </div>

                        {/* Danh sách tệp hồ sơ */}
                        <div className="space-y-2.5">
                            {user.documents.map((doc) => {
                                const Icon = doc.icon;
                                return (
                                    <div
                                        key={doc.id}
                                        className="p-3.5 rounded-xl bg-zinc-50 hover:bg-[#faf8e4]/70 border border-zinc-200/60 transition-colors flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                                                <Icon className={`w-5 h-5 ${doc.iconColor}`} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-semibold text-zinc-900 truncate">{doc.title}</span>
                                                <span className="text-[11px] text-zinc-400">{doc.meta}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-auto shrink-0">
                                            <button
                                                type="button"
                                                className="h-8 px-3 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:text-[#f0592a] hover:border-[#f0592a] transition-all flex items-center gap-1.5 shadow-2xs"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{doc.type === 'gallery' ? 'Xem bộ ảnh' : 'Xem trước'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="h-8 px-3 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:text-[#f0592a] hover:border-[#f0592a] transition-all flex items-center gap-1.5 shadow-2xs"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Tải xuống</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Khối quyết định phê duyệt (Verification Decision) */}
                        <div className="p-5 rounded-xl bg-[#faf8e4] border border-[#f0592a]/20 space-y-3">
                            <div className="flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-[#f0592a]" />
                                <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Quyết định thẩm định</span>
                            </div>
                            <p className="text-xs text-zinc-600">
                                Việc phê duyệt sẽ cấp quyền Xưởng may Cấp 2, kích hoạt hợp đồng ký quỹ thanh toán an toàn và cho phép nhận các hợp đồng đặt hàng số lượng lớn.
                            </p>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-zinc-500">Ghi chú quyết định hoặc Lý do từ chối (Không bắt buộc)</label>
                                <input
                                    type="text"
                                    value={decisionNote}
                                    onChange={(e) => setDecisionNote(e.target.value)}
                                    placeholder="Ví dụ: Vui lòng bổ sung phụ lục B chứng chỉ GOTS..."
                                    className="w-full h-10 px-3.5 bg-white rounded-xl border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all shadow-2xs"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-1 flex-wrap">
                                <button
                                    type="button"
                                    disabled={decisionStatus !== null}
                                    onClick={() => setDecisionStatus('approved')}
                                    className={`h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-2 shadow-xs ${
                                        decisionStatus !== null ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Phê duyệt chứng nhận</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={decisionStatus !== null}
                                    onClick={() => setDecisionStatus('rejected')}
                                    className={`h-10 px-5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs ${
                                        decisionStatus !== null ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <X className="w-4 h-4" />
                                    <span>Từ chối hồ sơ</span>
                                </button>

                                {decisionStatus === 'approved' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Đã phê duyệt thẩm định
                                    </span>
                                )}
                                {decisionStatus === 'rejected' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                                        Đã từ chối hồ sơ
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Khối Lịch sử sản xuất & Hợp đồng may đo */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950">Lịch sử gia công & Bàn giao lô sản xuất</h2>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full">38 Đã hoàn tất</span>
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">4 Đang chạy</span>
                                <span className="bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 px-2.5 py-0.5 rounded-full">1,35 tỷ ₫ Tổng giá trị</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                <tr className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-semibold border-y border-zinc-100">
                                    <th className="py-2.5 px-3">Mã đơn</th>
                                    <th className="py-2.5 px-3">Thương hiệu đặt hàng</th>
                                    <th className="py-2.5 px-3">Quy cách sản phẩm</th>
                                    <th className="py-2.5 px-3">Số lượng</th>
                                    <th className="py-2.5 px-3">Tổng giá trị</th>
                                    <th className="py-2.5 px-3">Trạng thái lô</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                {user.orders.map((ord, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                                        <td className="py-3 px-3 font-semibold text-zinc-900">{ord.id}</td>
                                        <td className="py-3 px-3 text-zinc-700">{ord.brand}</td>
                                        <td className="py-3 px-3 text-zinc-500">{ord.spec}</td>
                                        <td className="py-3 px-3 text-zinc-800">{ord.qty}</td>
                                        <td className="py-3 px-3 font-bold text-[#f0592a]">{ord.amount}</td>
                                        <td className="py-3 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    ord.status === 'In Production'
                                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                    {ord.status === 'In Production' ? 'Đang sản xuất' : 'Đã giao hàng'}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* CỘT PHẢI (4 Cột) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Hình ảnh Xưởng may (Facility Showcase) */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-zinc-200/70">
                        <div className="relative h-44 w-full bg-zinc-100">
                            <img src={user.facility.image} alt="Cơ sở xưởng may" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-zinc-800 shadow-xs">
                                Đã xác thực địa điểm
                            </span>
                        </div>
                        <div className="p-4 space-y-1">
                            <span className="text-xs font-bold text-zinc-950 block">{user.facility.name}</span>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">{user.facility.desc}</p>
                        </div>
                    </div>

                    {/* Khiếu nại & Tranh chấp (Disputes & Complaints) */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <h2 className="text-sm font-bold text-zinc-950">Khiếu nại & Tranh chấp</h2>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                Hồ sơ uy tín tốt
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between text-center">
                            <div className="flex-1">
                                <span className="text-sm font-bold text-zinc-950 block">0 Vụ việc</span>
                                <span className="text-[10px] text-zinc-400">Tranh chấp đang mở</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200"></div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-zinc-950 block">1 Vụ việc</span>
                                <span className="text-[10px] text-zinc-400">Đã giải quyết êm đẹp</span>
                            </div>
                        </div>

                        {/* Chi tiết 1 vụ đã giải quyết */}
                        <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-zinc-900">Giao mẫu vải chậm trễ</span>
                                <span className="text-[10px] text-zinc-400">28/09/2026</span>
                            </div>
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                Đơn hàng #ORD-7721: Đơn vị vận chuyển giao trễ mẫu vải nhuộm chuẩn màu pantone. Đã thỏa thuận bồi thường thỏa đáng với khách hàng bằng phương án gửi hàng hỏa tốc đường hàng không.
                            </p>
                            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Không áp dụng chế tài xử phạt hành chính</span>
                            </div>
                        </div>

                        {/* Đường xu hướng điểm tín nhiệm */}
                        <div className="pt-1 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 text-[11px]">Xu hướng điểm tín nhiệm (6 tháng)</span>
                                <span className="font-bold text-zinc-900">+4 điểm</span>
                            </div>
                            <svg className="w-full h-8 text-[#f0592a]" fill="none" viewBox="0 0 100 24">
                                <path d="M0 18 Q 20 16, 35 15 T 60 12 T 80 8 T 100 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                <circle cx="100" cy="4" r="3" fill="#f0592a" />
                            </svg>
                        </div>
                    </div>

                    {/* Nhật ký kiểm toán tài khoản */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-sm font-bold text-zinc-950">Nhật ký kiểm toán & Hoạt động</h2>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Thời gian thực</span>
                        </div>

                        <div className="space-y-3">
                            {user.auditLogs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.isDotOrange ? 'bg-[#f0592a]' : 'bg-zinc-300'}`}></span>
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="text-xs font-semibold text-zinc-900 block truncate">{log.title}</span>
                                        <span className="text-[10px] text-zinc-400 block">{log.meta}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="w-full h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <span>Xem toàn bộ lịch sử kiểm toán</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}