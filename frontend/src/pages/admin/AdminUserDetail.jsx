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
    const [selectedRole, setSelectedRole] = useState('Producer (Active)');
    const [decisionStatus, setDecisionStatus] = useState(null); // 'approved' | 'rejected' | null
    const [decisionNote, setDecisionNote] = useState('');

    // 1. MOCK DATA: Thông tin chi tiết nhà sản xuất (Studio Nord)
    const user = {
        id: id || '#USR-8492',
        name: 'Studio Nord Artisan Wear',
        status: 'Verification Pending',
        tier: 'Tier II Artisan',
        email: 'contact@studionord-apparel.com',
        phone: '+1 (555) 382-9014',
        location: 'Portland, Oregon, USA',
        joined: 'Nov 12, 2023',
        classification: 'Producer (Manufacturer)',
        avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=240&auto=format&fit=crop&q=80',
        bio: 'Specialized in 280gsm heavyweight combed organic cotton, bespoke screen printing and vintage acid washing. Direct-to-garment and manual screen press equipment installed in Portland workshop.',
        trustScore: 94,
        batchesCount: 38,
        metrics: {
            onTimeDispatch: '98%',
            disputeRate: '0.4%',
            qualityScore: '4.9',
            tierLevel: 'Lvl 2',
        },
        facility: {
            name: 'Facility: SE Division Warehouse',
            desc: '4,200 sq.ft screen printing, curing tunnel & quality inspection station.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
        },
        documents: [
            {
                id: 1,
                title: 'Business License & Tax ID (EIN-9482103).pdf',
                meta: 'State of Oregon Registered Entity • 2.4 MB',
                type: 'pdf',
                icon: FileText,
                iconColor: 'text-[#f0592a]',
            },
            {
                id: 2,
                title: 'Organic Cotton GOTS Certificate 2026.pdf',
                meta: 'Global Organic Textile Standard Scope • 4.1 MB',
                type: 'gots',
                icon: Leaf,
                iconColor: 'text-emerald-600',
            },
            {
                id: 3,
                title: 'Workshop Facility & Screen-print Equipment Photos (4 files)',
                meta: 'High-res inspection photography • 18.2 MB archive',
                type: 'gallery',
                icon: Images,
                iconColor: 'text-[#f0592a]',
            },
        ],
        orders: [
            { id: '#ORD-9824', brand: 'Pacific Drift Co.', spec: '280gsm Vintage Tee', qty: '450 units', amount: '$8,325', status: 'In Production' },
            { id: '#ORD-9740', brand: 'Komorebi Apparel', spec: 'Acid-wash Boxy Crew', qty: '600 units', amount: '$11,400', status: 'Delivered' },
            { id: '#ORD-9612', brand: 'Sylvan Club Works', spec: 'Organic Heavyweight Blank', qty: '1,200 units', amount: '$19,800', status: 'Delivered' },
            { id: '#ORD-9533', brand: 'Vapour Archive', spec: 'Puff Print Heavy Jersey', qty: '300 units', amount: '$5,750', status: 'Delivered' },
        ],
        auditLogs: [
            { title: 'Uploaded tax renewal (EIN-9482103)', meta: 'Nov 14, 2026 • 14:22 EST • IP 67.183.91.12', isDotOrange: true },
            { title: 'Logged in via 2FA Hardware Key', meta: 'Nov 14, 2026 • 13:58 EST • IP 67.183.91.12' },
            { title: 'Updated bank payout ACH credentials', meta: 'Nov 02, 2026 • 09:15 EST • Admin Marcus' },
            { title: 'Account created & email confirmed', meta: 'Nov 12, 2026 • 11:04 EST • System Automated' },
        ],
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Breadcrumbs & Nút quay lại */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 flex-wrap">
                    <Link to="/admin/users" className="hover:text-[#f0592a] transition-colors">Users</Link>
                    <span>/</span>
                    <span>Producers</span>
                    <span>/</span>
                    <span className="font-semibold text-zinc-900">{user.name} (ID: {user.id})</span>
                </div>
                <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#f0592a] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Users list</span>
                </Link>
            </div>

            {/* 2. Header Profile Card */}
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
                Joined {user.joined}
              </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                ID: {user.id}
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
                            <span>Change role</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        </button>
                        {roleMenuOpen && (
                            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-zinc-200 py-1.5 z-30 text-xs font-medium">
                                {['Producer (Active)', 'Creator / Merchant', 'Fabric Mill Partner'].map((r) => (
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
                        <span>Send message</span>
                    </button>

                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend account</span>
                    </button>
                </div>
            </div>

            {/* 3. Lưới nội dung 12 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Khối Profile & Trust Score */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Producer Profile & Craft Capabilities</h2>
                            </div>
                            <span className="text-[11px] font-semibold uppercase bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                Specialist Studio
              </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed italic">
                            "{user.bio}"
                        </p>

                        {/* Lưới phân loại thông tin */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Account Classification</span>
                                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Factory className="w-4 h-4 text-[#f0592a]" />
                                    {user.classification}
                </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Primary Phone</span>
                                <span className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                    {user.phone}
                </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Location</span>
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
                                    <span className="text-sm font-bold text-zinc-950">Artisan Trust Index</span>
                                    <p className="text-xs text-zinc-500">Computed over {user.batchesCount} successful production batches</p>
                                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>Top 5% among textile printers</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto flex-1">
                                {[
                                    { label: 'On-time Dispatch', val: user.metrics.onTimeDispatch, valColor: 'text-[#f0592a]' },
                                    { label: 'Dispute Rate', val: user.metrics.disputeRate, valColor: 'text-zinc-900' },
                                    { label: 'Quality (5.0)', val: user.metrics.qualityScore, valColor: 'text-emerald-700' },
                                    { label: 'Tier Status', val: user.metrics.tierLevel, valColor: 'text-zinc-900' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col bg-white p-2.5 rounded-xl text-center border border-zinc-200/50 shadow-2xs">
                                        <span className={`text-sm font-bold ${item.valColor}`}>{item.val}</span>
                                        <span className="text-[10px] font-medium text-zinc-400 mt-0.5">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Khối Producer Verification Documents */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-[#f0592a]" />
                                <div>
                                    <h2 className="text-base font-bold text-zinc-950">Producer Verification & Workshop Credentials</h2>
                                    <p className="text-xs text-zinc-500">Review official compliance records submitted on Nov 14, 2026</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-center">
                Pending Verification
              </span>
                        </div>

                        {/* Danh sách file hồ sơ */}
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
                                                <span>{doc.type === 'gallery' ? 'View Gallery' : 'Preview'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="h-8 px-3 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:text-[#f0592a] hover:border-[#f0592a] transition-all flex items-center gap-1.5 shadow-2xs"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Download</span>
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
                                <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Verification Decision</span>
                            </div>
                            <p className="text-xs text-zinc-600">
                                Approving grants Level 2 Producer status, enabling checkout escrows and direct client volume contracts.
                            </p>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-zinc-500">Decision Notes or Rejection Reason (Optional)</label>
                                <input
                                    type="text"
                                    value={decisionNote}
                                    onChange={(e) => setDecisionNote(e.target.value)}
                                    placeholder="e.g., Please provide GOTS Appendix B annex document..."
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
                                    <span>Approve verification</span>
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
                                    <span>Reject credentials</span>
                                </button>

                                {decisionStatus === 'approved' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verification Approved
                  </span>
                                )}
                                {decisionStatus === 'rejected' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                    Credentials Rejected
                  </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Khối Lịch sử sản xuất & Hợp đồng (Orders History) */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950">Production & Batch Fulfillment History</h2>
                                <p className="text-xs text-zinc-500">Overview of manufacturing contracts produced by {user.name}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full">38 Completed</span>
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">4 Active</span>
                                <span className="bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 px-2.5 py-0.5 rounded-full">$54,200 Total Vol</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                <tr className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-semibold border-y border-zinc-100">
                                    <th className="py-2.5 px-3">Order ID</th>
                                    <th className="py-2.5 px-3">Client Brand</th>
                                    <th className="py-2.5 px-3">Garment Spec</th>
                                    <th className="py-2.5 px-3">Quantity</th>
                                    <th className="py-2.5 px-3">Total Amount</th>
                                    <th className="py-2.5 px-3">Batch Status</th>
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
                          {ord.status}
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

                    {/* Hình ảnh Xưởng sản xuất (Facility Showcase) */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-zinc-200/70">
                        <div className="relative h-44 w-full bg-zinc-100">
                            <img src={user.facility.image} alt="Workshop Facility" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-zinc-800 shadow-xs">
                Facility Tour Verified
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
                                <h2 className="text-sm font-bold text-zinc-950">Disputes & Complaints</h2>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Clean Standing
              </span>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between text-center">
                            <div className="flex-1">
                                <span className="text-sm font-bold text-zinc-950 block">0 Active</span>
                                <span className="text-[10px] text-zinc-400">Open client disputes</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200"></div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-zinc-950 block">1 Resolved</span>
                                <span className="text-[10px] text-zinc-400">Historical inquiry</span>
                            </div>
                        </div>

                        {/* Chi tiết 1 vụ đã giải quyết */}
                        <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-zinc-200/50 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-zinc-900">Delayed Swatch Dispatch</span>
                                <span className="text-[10px] text-zinc-400">Sep 28, 2026</span>
                            </div>
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                Order #ORD-7721: Courier delay on custom pantone dyed swatches. Resolved amicably with client via replacement air shipment.
                            </p>
                            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>No administrative penalty applied</span>
                            </div>
                        </div>

                        {/* Sparkline xu hướng điểm tin cậy */}
                        <div className="pt-1 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 text-[11px]">Trust Score Trajectory (6 Mos)</span>
                                <span className="font-bold text-zinc-900">+4 pts</span>
                            </div>
                            <svg className="w-full h-8 text-[#f0592a]" fill="none" viewBox="0 0 100 24">
                                <path d="M0 18 Q 20 16, 35 15 T 60 12 T 80 8 T 100 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                <circle cx="100" cy="4" r="3" fill="#f0592a" />
                            </svg>
                        </div>
                    </div>

                    {/* Nhật ký kiểm toán tài khoản (Audit & Activity Log) */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-sm font-bold text-zinc-950">Audit & Activity Log</h2>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Realtime</span>
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
                            <span>View complete audit trail</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}