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
                    </div>

                    {/* Khối Lịch sử sản xuất & Hợp đồng may đo */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950">Lịch sử gia công & Bàn giao lô sản xuất</h2>
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
                        </div>
                        <div className="p-4 space-y-1">
                            <span className="text-xs font-bold text-zinc-950 block">{user.facility.name}</span>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">{user.facility.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}