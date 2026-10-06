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
        'Atelier administration reviewed DHL transit logs and verified that the custom enzyme dye vat was completed on Oct 24. While a 48-hour delay took place, custom acid wash calibration was required to match client pantone. Proposing a 10% settlement discount to proceed with screen printing immediately.'
    );
    const [adminNote, setAdminNote] = useState('');
    const [chatMessage, setChatMessage] = useState('');

    // 1. MOCK DATA: Chi tiết đơn hàng
    const order = {
        id: orderId,
        batchId: '#ATC-280-99A',
        escrowDate: 'Oct 20, 2026',
        title: 'Custom Bespoke Batch (Acid Wash Distressed Crew)',
        productName: 'Vintage Washed Oversized Heavy Tee',
        sku: 'ATEL-280-ACID',
        batchSize: '200 Total Garments',
        baselinePrice: '$4,500.00',
        unitRate: '$22.50 / unit baseline',
        specText: 'Custom bespoke formulation • Pigment discharge wash with pumice stone enzyme soak.',
        sizeRatio: [
            { size: 'S', label: 'Small', qty: '40 pcs' },
            { size: 'M', label: 'Medium', qty: '70 pcs' },
            { size: 'L', label: 'Large', qty: '60 pcs' },
            { size: 'XL', label: 'X-Large', qty: '30 pcs' },
        ],
        badges: [
            { label: '280 GSM 100% Organic Combed Cotton', icon: Leaf, iconColor: 'text-[#f0592a]' },
            { label: '3-Color Screen Print (Chest Plastisol Soft Feel)', icon: Palette, iconColor: 'text-zinc-600' },
            { label: 'Woven Atelier Damask Nape Label', icon: Tag, iconColor: 'text-zinc-500' },
        ],
        mockups: [
            {
                title: 'Front Graphic Proof',
                sub: 'Chest Art 28x32cm',
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
            },
            {
                title: 'Nape Label & Collar',
                sub: 'Woven Spec 40x55mm',
                img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
            },
            {
                title: 'Enzyme Vat Proof',
                sub: 'Uploaded Oct 24, 09:15',
                badge: 'Producer Upload',
                img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
            },
        ],
        customer: {
            name: 'Julian Lowe',
            company: 'Outer Loop Creative LLC',
            tier: 'Silver Patron',
            initials: 'JL',
            email: 'j.lowe@outerloop.net',
            phone: '+1 (555) 234-8901',
            address: '428 Artisan Way, Suite 300\nPortland, OR 97201',
            stats: { completed: 4, openDispute: 1, volume: '$11.2k' },
        },
        producer: {
            name: 'Studio Nord Artisan Wear',
            lead: 'Lead: Kenzo Mori / Marcus',
            tier: 'Verified Tier II',
            initials: 'SN',
            email: 'contact@studionord-apparel.com',
            address: 'SE Division Warehouse Facility\nIndustrial District, Portland OR',
            trustScore: 94,
        },
        accounting: {
            garmentRun: '$4,500.00',
            setupFee: '$350.00',
            freight: '$180.00',
            discount: '-$242.50',
            totalOrder: '$4,787.50',
            depositPaid: '-$2,393.75',
            remainingDue: '$2,393.75',
        },
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto">
            {/* 1. Breadcrumb & Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1 font-semibold text-zinc-600 hover:text-[#f0592a] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Orders list</span>
                    </Link>
                    <span className="text-zinc-300">/</span>
                    <span>Orders</span>
                    <span className="text-zinc-300">/</span>
                    <span>Production Orders</span>
                    <span className="text-zinc-300">/</span>
                    <span className="font-semibold text-zinc-950">Order {order.id}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            Escrow Locked: {order.escrowDate}
          </span>
                    <span>•</span>
                    <span className="font-semibold text-zinc-800">Batch ID: {order.batchId}</span>
                </div>
            </div>

            {/* 2. Tiêu đề chính, Badges & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              Needs Admin Review
            </span>
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Lock className="w-3 h-3 text-[#f0592a]" />
              Disputed / Escrow Paused
            </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700">
              B2B Studio Run
            </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                        Order {order.id}{' '}
                        <span className="text-sm md:text-base font-normal text-zinc-500">— {order.title}</span>
                    </h1>
                </div>

                {/* Nút hành động phía trên bên phải */}
                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                        <Printer className="w-4 h-4 text-zinc-500" />
                        <span>Print Slip</span>
                    </button>
                    <button
                        type="button"
                        className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <span>Contact Parties</span>
                    </button>

                    {/* Dropdown Update Status */}
                    <div className="relative">
                        <button
                            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                            type="button"
                            className="h-10 px-3.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                            <span>Update Status</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                        {statusMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-zinc-200 py-1.5 z-30 text-xs font-medium space-y-0.5">
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                                    <span>Keep In Production (Audit)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                    <span>Force Freeze Escrow</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusMenuOpen(false)}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-zinc-800 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                                    <span>Mark Priority Expedited</span>
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
                        <span>Resolve Dispute</span>
                    </button>
                </div>
            </div>

            {/* 3. Alert Banner: Dispute Flagged */}
            <div className="p-4 md:p-5 rounded-2xl bg-red-50/70 border border-red-200/80 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <Flag className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xs font-bold text-red-700">Dispute Flagged: Buyer Cancellation Request</h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white text-red-600 border border-red-200">
                  TICKET #DISP-409
                </span>
                            </div>
                            <p className="text-xs text-zinc-700 leading-relaxed max-w-4xl">
                                Buyer requested cancellation due to a 3-day milestone dispatch delay; Producer Studio Nord uploaded DHL proof of raw cotton batch receipt and automated enzyme vat washing log. Smart escrow is currently frozen at <strong className="text-zinc-950 font-bold">$2,425.00</strong>.
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
                            Review Evidence
                        </button>
                        <button
                            type="button"
                            className="h-8 px-3 rounded-lg text-zinc-500 hover:text-zinc-800 text-xs font-semibold transition-colors"
                        >
                            Dismiss Alert
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Grid 12 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Stepper: Batch Progress & Escrow Checkpoints */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Production Pipeline</span>
                                <h2 className="text-base font-bold text-zinc-950">Batch Progress & Escrow Checkpoints</h2>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                Stage 3 Blocked
              </span>
                        </div>

                        <div className="relative pt-3 pb-2">
                            {/* Thanh tiến độ nền */}
                            <div className="hidden sm:block absolute top-8 left-8 right-8 h-1 bg-zinc-100"></div>
                            <div className="hidden sm:block absolute top-8 left-8 w-[45%] h-1 bg-[#f0592a]"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                                {/* Step 1 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center shrink-0 z-10 border border-[#f0592a]/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block">Order Placed</span>
                                        <span className="text-[11px] text-zinc-500 block">50% Escrow Paid</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Oct 20, 2026</span>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center shrink-0 z-10 border border-[#f0592a]/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block">Proof Approved</span>
                                        <span className="text-[11px] text-zinc-500 block">Pantone Match OK</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Oct 22, 2026</span>
                                    </div>
                                </div>

                                {/* Step 3 (Blocked) */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 z-10 ring-4 ring-red-50">
                                        <PauseCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-red-600 block">Dyeing & Acid Wash</span>
                                        <span className="text-[11px] text-red-500 font-medium block">Halted on Dispute</span>
                                        <span className="text-[10px] text-red-400 block mt-0.5">Oct 24 (Overdue)</span>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 z-10">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-700 block">Quality Check</span>
                                        <span className="text-[11px] text-zinc-400 block">Remaining 50%</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Est. Oct 29</span>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 z-10">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-zinc-700 block">Final Delivery</span>
                                        <span className="text-[11px] text-zinc-400 block">Portland Courier</span>
                                        <span className="text-[10px] text-zinc-400 block mt-0.5">Est. Nov 02</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Item Specifications & Unit Breakdown */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Garment Architecture</span>
                                <h2 className="text-base font-bold text-zinc-950">Item Specifications & Unit Breakdown</h2>
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
                      SKU: {order.sku}
                    </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{order.specText}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-xl font-bold text-[#f0592a] block">{order.baselinePrice}</span>
                                    <span className="text-[11px] text-zinc-400">{order.unitRate}</span>
                                </div>
                            </div>

                            {/* Tỉ lệ size */}
                            <div className="pt-2">
                                <span className="text-xs font-bold text-zinc-700 block mb-2">Production Ratio Breakdown:</span>
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

                            {/* Badges thông số vải */}
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

                        {/* Approved Mockups & Evidence Photos */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-900">Approved Mockups & Dye Batch Evidence</span>
                                <span className="text-xs text-zinc-400">3 files attached</span>
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

                    {/* Manufacturing & Activity Log (Audit Trail) */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Audit Trail</span>
                                <h2 className="text-base font-bold text-zinc-950">Manufacturing & Activity Log</h2>
                            </div>
                            <button type="button" className="text-xs font-semibold text-[#f0592a] hover:underline flex items-center gap-1">
                                <span>Filter events</span>
                            </button>
                        </div>

                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                            {/* Event 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center ring-4 ring-white shadow-2xs">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200/60 space-y-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-red-700">Dispute Opened by Customer</span>
                                            <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-white text-red-600 border border-red-200">
                        Buyer Action
                      </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400">Oct 25, 2026 at 14:30</span>
                                    </div>
                                    <p className="text-xs text-zinc-800 leading-relaxed">
                                        “Production milestone missed by 72 hours without status update or dispatch tracking. We have a promotional pop-up scheduled and cannot accept prolonged batch postponements without compensation.”
                                    </p>
                                    <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-2">
                                        <span>Author: Julian Lowe</span>
                                        <span>•</span>
                                        <span>Smart escrow flag automatically raised</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event 2 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center ring-4 ring-white shadow-2xs border border-[#f0592a]/20">
                                    <Factory className="w-3.5 h-3.5" />
                                </div>
                                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-950">Studio Nord Uploaded Batch Milestone Evidence</span>
                                            <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-zinc-200 text-zinc-700">
                        Producer Action
                      </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400">Oct 24, 2026 at 09:15</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 leading-relaxed">
                                        “Custom pigment enzyme vat batch complete, drying process underway. Pumice acid wash stones took 1 extra day to calibrate tone uniformity. Raw combed cotton received from DHL on Oct 21 (Airway Bill #DHL-992-1088). Batch will enter screen print stage tomorrow morning.”
                                    </p>
                                    <div className="flex items-center gap-3 pt-1 text-xs text-[#f0592a] font-semibold">
                    <span className="hover:underline cursor-pointer flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> dhl_airway_bill_9921088.pdf
                    </span>
                                        <span className="text-zinc-300">•</span>
                                        <span className="hover:underline cursor-pointer flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> vat_drying_chamber.jpg
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Event 3 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center ring-4 ring-white">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <span className="text-xs font-bold text-zinc-900">Digital Proof Approved by Customer</span>
                                        <span className="text-[10px] text-zinc-400">Oct 22, 2026 at 11:00</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Customer approved 3-color plastisol positioning with 15% saturation drop on charcoal base.
                                    </p>
                                </div>
                            </div>

                            {/* Event 4 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center ring-4 ring-white">
                                    <Lock className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                        <span className="text-xs font-bold text-zinc-900">50% Escrow Deposit Locked</span>
                                        <span className="text-[10px] text-zinc-400">Oct 20, 2026 at 16:45</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        $2,425.00 successfully transferred from Julian Lowe to Atelier Vault Escrow contract #0x82...e9B1.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Note nội bộ của Admin */}
                        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2 pt-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5" htmlFor="admin-note">
                                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                                    Private Internal Admin Note (Only visible to Atelier Team)
                                </label>
                                <span className="text-[10px] text-zinc-400">Markdown supported</span>
                            </div>
                            <textarea
                                id="admin-note"
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Add confidential assessment, manufacturer check notes, or mediator instructions..."
                                className="w-full p-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all resize-none font-medium"
                            />
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] text-zinc-400">Logged as Super Admin: Marcus Vance</span>
                                <button
                                    type="button"
                                    className="h-8 px-4 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs"
                                >
                                    Post Note
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 4. Escrow & Dispute Resolution Card */}
                    <section id="resolution-card" className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#f0592a]/30 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-[#f0592a] tracking-wider block">Arbitration Panel</span>
                                <h2 className="text-base font-bold text-zinc-950">Escrow & Milestone Dispute Resolution</h2>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                Action Required
              </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed">
                            Select an executive determination. Once submitted, smart contract escrow funds will automatically disburse or refund accordingly.
                        </p>

                        {/* Radio Options */}
                        <div className="space-y-2.5">
                            {/* Option A */}
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
                                        <span className="text-xs font-bold text-zinc-950">A. Release Escrow to Producer (Proof Validated)</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-semibold bg-zinc-200 text-zinc-700">
                      Producer Favored
                    </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        The producer provided verifiable proof of raw materials receipt & machine runtime. Production continues with an official 48-hour extension granted to Studio Nord.
                                    </p>
                                </div>
                            </label>

                            {/* Option B */}
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
                                        <span className="text-xs font-bold text-zinc-950">B. Refund 100% to Customer (Cancel Order)</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-semibold bg-red-100 text-red-700">
                      Full Void
                    </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Milestone breach recognized. Return $2,425.00 deposit immediately to Julian Lowe and cancel active fabrication batch. Producer keeps raw fabric salvage.
                                    </p>
                                </div>
                            </label>

                            {/* Option C */}
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
                                        <span className="text-xs font-bold text-zinc-950">C. Propose Partial Settlement / 10% Batch Discount</span>
                                        <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20">
                      Recommended Mediation
                    </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Deduct $450.00 from final balance payable to producer as a late penalty, and credit buyer with a $450 instant refund + priority freight upgrade at producer expense.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Memo quyết định */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-xs font-bold text-zinc-800 block" htmlFor="decision-memo">
                                Official Decision Memo (Included in mediation email to both parties):
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
                                <span>Requires dual confirmation step upon submission</span>
                            </div>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto h-10 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
                                >
                                    Save Draft Determination
                                </button>
                                <button
                                    type="button"
                                    className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all"
                                >
                                    Execute Mediation
                                </button>
                            </div>
                        </div>
                    </section>

                </div>

                {/* CỘT PHẢI (4 Cột) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 1. Customer Information Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Customer Details</h2>
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
                                <span className="text-zinc-400">Phone:</span>
                                <span className="text-zinc-900 font-medium">{order.customer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-zinc-400 shrink-0 mt-0.5">Ship to:</span>
                                <span className="text-zinc-700 leading-relaxed whitespace-pre-line">{order.customer.address}</span>
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-around text-center">
                            <div>
                                <span className="text-sm font-bold text-zinc-950 block">{order.customer.stats.completed}</span>
                                <span className="text-[10px] text-zinc-400">Completed</span>
                            </div>
                            <div className="w-px h-6 bg-zinc-200"></div>
                            <div>
                                <span className="text-sm font-bold text-red-600 block">{order.customer.stats.openDispute}</span>
                                <span className="text-[10px] text-red-500 font-medium">Open Dispute</span>
                            </div>
                            <div className="w-px h-6 bg-zinc-200"></div>
                            <div>
                                <span className="text-sm font-bold text-zinc-950 block">{order.customer.stats.volume}</span>
                                <span className="text-[10px] text-zinc-400">Lifetime Vol</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Message Julian</span>
                        </button>
                    </div>

                    {/* 2. Assigned Producer Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Assigned Producer</h2>
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
                                <span className="text-zinc-400 shrink-0 mt-0.5">Facility:</span>
                                <span className="text-zinc-700 leading-relaxed whitespace-pre-line">{order.producer.address}</span>
                            </div>
                        </div>

                        {/* Trust Score Bar */}
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Producer Trust Score</span>
                                <span className="font-bold text-zinc-950">{order.producer.trustScore} / 100</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                                <div className="h-full bg-[#f0592a] rounded-full" style={{ width: `${order.producer.trustScore}%` }} />
                            </div>
                            <span className="text-[10px] text-zinc-400 block">Clean Standing: 48 successful production batches in 2026.</span>
                        </div>

                        <button
                            type="button"
                            className="w-full h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Direct Line to Studio Nord</span>
                        </button>
                    </div>

                    {/* 3. Escrow & Accounting Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Escrow & Accounting</h2>
                            </div>
                            <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                USD ($)
              </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Garment Run (200 @ $22.50)</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.garmentRun}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Custom Dye & Screen Setup Fee</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.setupFee}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Regional Courier Freight (Portland)</span>
                                <span className="font-semibold text-zinc-900">{order.accounting.freight}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#f0592a]">
                                <span>Promotional Discount (-5% First Batch)</span>
                                <span className="font-bold">{order.accounting.discount}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1">
                  Escrow Protocol Fee <Info className="w-3 h-3 text-zinc-400" />
                </span>
                                <span className="italic">Covered by Atelier</span>
                            </div>

                            <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-950">Total Order Value</span>
                                <span className="text-sm font-bold text-zinc-950">{order.accounting.totalOrder}</span>
                            </div>

                            {/* Escrow Box */}
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-[#f0592a]/20 space-y-2 mt-2">
                                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#f0592a]"></span>
                    Deposit Paid (50% Escrow)
                  </span>
                                    <span className="font-bold text-zinc-900">{order.accounting.depositPaid}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-zinc-500 pl-3.5">
                                    <span>Smart Contract Vault</span>
                                    <span className="text-red-600 font-bold uppercase">Hold Paused</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-200/70 flex justify-between items-center text-xs">
                                    <span className="font-bold text-zinc-950">Remaining Due on Inspection:</span>
                                    <span className="font-bold text-[#f0592a] text-sm">{order.accounting.remainingDue}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full h-10 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                        >
                            <Download className="w-4 h-4 text-zinc-500" />
                            <span>Download Ledger Audit (PDF)</span>
                        </button>
                    </div>

                    {/* 4. Mediation Quick Chat */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">Mediation Quick Chat</span>
                            <span className="w-2 h-2 rounded-full bg-[#f0592a] animate-pulse"></span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Broadcast a synchronized notice to both Julian Lowe (Customer) and Studio Nord simultaneously.
                        </p>
                        <div className="relative">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Type prompt message to both parties..."
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