import React, { useState, useEffect } from 'react';
import {
    List,
    Printer,
    Minus,
    Plus,
    CheckCircle2,
    ShieldCheck,
    Truck,
    Loader2,
    Check,
    Save,
    Calendar,
    Phone,
    MapPin,
    Package
} from 'lucide-react';

const STATUS_TABS = [
    { id: 'all', label: 'Tất cả đơn hoạt động' },
    { id: 'in-production', label: 'Đang sản xuất' },
    { id: 'pending-qc', label: 'Chờ duyệt kiểm định QC' },
    { id: 'completed', label: 'Đã hoàn tất / Đã gửi' },
];

export default function ProducerDashboard() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Form state điều khiển bên phải
    const [currentUnits, setCurrentUnits] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('IN_PRODUCTION');
    const [stageNotes, setStageNotes] = useState(
        'Căn chỉnh bản in 4 màu đã hiệu chuẩn trên bàn in xoay. Đã hoàn thành sấy hầm nhiệt 160°C. Mẫu thử độ bền màu đạt chuẩn kiểm tra ma sát.'
    );
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // 1. Tải danh sách đơn hàng của xưởng
    const fetchProducerOrders = async (targetIdToKeep = null) => {
        setIsLoadingList(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders?tab=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                if (data.length > 0) {
                    const keepId = targetIdToKeep || (selectedOrder ? selectedOrder.id : data[0].id);
                    const found = data.find(o => o.id === keepId) || data[0];
                    fetchDetail(found.id);
                } else {
                    setSelectedOrder(null);
                }
            }
        } catch (e) {
            console.error('Lỗi khi fetch đơn hàng:', e);
        } finally {
            setIsLoadingList(false);
        }
    };

    // 2. Tải chi tiết đơn hàng được chọn (kèm danh sách size/số lượng)
    const fetchDetail = async (id) => {
        setIsLoadingDetail(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders/${id}`);
            if (res.ok) {
                const detail = await res.json();
                setSelectedOrder(detail);
                setCurrentUnits(detail.completedUnits);
                setCurrentStatus(detail.status);
            }
        } catch (e) {
            console.error('Lỗi khi fetch chi tiết đơn:', e);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    useEffect(() => {
        fetchProducerOrders();
    }, [activeTab]);

    // Chuyển chọn đơn hàng ở hàng đợi
    const handleSelectOrder = (id) => {
        setSaveSuccess(false);
        fetchDetail(id);
    };

    // Nút tăng giảm số lượng sản phẩm hoàn thành
    const adjustCount = (delta) => {
        if (!selectedOrder) return;
        const total = selectedOrder.totalUnits || 1;
        setCurrentUnits(prev => {
            const next = prev + delta;
            if (next < 0) return 0;
            if (next > total) return total;
            return next;
        });
    };

    // Thêm tag ghi chú mẫu nhanh
    const insertTag = (tagText) => {
        setStageNotes(prev => (prev ? `${prev.trim()} | ${tagText}` : tagText));
    };

    // Lưu tiến độ và cập nhật trạng thái đơn
    const handleSaveProgress = async () => {
        if (!selectedOrder) return;
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/producer/orders/${selectedOrder.id}/progress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: currentStatus,
                    completedUnits: currentUnits,
                    notes: stageNotes
                })
            });

            if (res.ok) {
                setSaveSuccess(true);
                fetchProducerOrders(selectedOrder.id);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert('Cập nhật tiến độ thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối máy chủ backend');
        } finally {
            setIsSaving(false);
        }
    };

    const totalUnits = selectedOrder?.totalUnits || 1;
    const progressPercent = Math.min(100, Math.round((currentUnits / totalUnits) * 100));

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-4 sm:px-8 xl:px-12 space-y-6">
            {/* 1. Header & Tab điều hướng */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                        Tiến độ sản xuất và bàn giao xưởng
                    </h1>
                </div>

                {/* Thanh lọc trạng thái đơn */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
                    {STATUS_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-[#f0592a] text-white font-bold'
                                        : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/70'
                                }`}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. BỐ CỤC 2 CỘT MỞ RỘNG CÂN ĐỐI */}
            <div className="w-full flex flex-col xl:flex-row gap-6 items-start">

                {/* CỘT TRÁI: Hàng đợi xưởng trực tiếp (Cố định chiều ngang) */}
                <aside className="w-full xl:w-[380px] 2xl:w-[420px] flex-shrink-0 space-y-4">
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <List className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Hàng đợi sản xuất</h2>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                                {orders.length} Đơn
                            </span>
                        </div>

                        {/* Danh sách thẻ đơn trong hàng đợi */}
                        <div className="space-y-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                            {isLoadingList ? (
                                <div className="py-12 text-center text-zinc-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#f0592a] mb-2" />
                                    Đang nạp hàng đợi...
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="py-8 text-center text-zinc-400 text-xs">
                                    Không có đơn hàng nào trong tab này.
                                </div>
                            ) : (
                                orders.map((ord) => {
                                    const isSelected = selectedOrder?.id === ord.id;
                                    return (
                                        <div
                                            key={ord.id}
                                            onClick={() => handleSelectOrder(ord.id)}
                                            className={`rounded-xl p-4 transition-all cursor-pointer border ${
                                                isSelected
                                                    ? 'bg-[#faf8e4] border-[#f0592a] shadow-sm ring-1 ring-[#f0592a]'
                                                    : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/70'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-zinc-950 font-mono">
                                                            #{ord.orderCode}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-100 text-amber-900">
                                                            {ord.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-zinc-900 block mt-1 line-clamp-1">
                                                        {ord.title}
                                                    </span>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <span className="text-xs font-bold text-[#f0592a] block">
                                                        {ord.totalUnits} chiếc
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
                                                <span className={`text-[11px] font-semibold ${ord.isWarning ? 'text-red-600 font-bold' : 'text-zinc-700'}`}>
                                                    {ord.dueDateLabel}
                                                </span>
                                            </div>

                                            {/* Thanh tiến độ mini */}
                                            <div className="w-full bg-zinc-200/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        ord.isWarning ? 'bg-red-500' : 'bg-[#f0592a]'
                                                    }`}
                                                    style={{ width: `${ord.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </aside>

                {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN CHI TIẾT SẢN XUẤT (DÃN RỘNG TOÀN DIỆN) */}
                <main className="flex-1 w-full space-y-5">
                    {isLoadingDetail ? (
                        <div className="bg-white rounded-2xl p-16 text-center text-zinc-400 border border-zinc-200/70">
                            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#f0592a] mb-2" />
                            Đang tải chi tiết đơn hàng...
                        </div>
                    ) : selectedOrder ? (
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-zinc-200/70 space-y-6">

                            {/* 1. Header chi tiết */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl font-bold text-zinc-950 font-mono">
                                            #{selectedOrder.orderCode}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20">
                                            {currentStatus}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-zinc-900">{selectedOrder.title}</h2>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-500 mt-1.5">
                                        <span className="flex items-center gap-1 text-zinc-700 font-medium">
                                            Khách hàng: <strong className="text-zinc-900">{selectedOrder.shippingName}</strong>
                                        </span>
                                        {selectedOrder.shippingPhone && (
                                            <span className="flex items-center gap-1 font-mono">
                                                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                                {selectedOrder.shippingPhone}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                            {selectedOrder.shippingAddress}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right shrink-0 bg-zinc-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                                    <span className="text-sm font-bold text-zinc-900">{selectedOrder.spec}</span>
                                </div>
                            </div>

                            {/* 2. Chi tiết phân rã số lượng theo Size */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Kích cỡ & Sản lượng
                                </h3>
                                <div className="border border-zinc-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-zinc-50 text-[11px] font-semibold text-zinc-400 uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Kích thước</th>
                                            <th className="py-2.5 px-4">Màu phôi</th>
                                            <th className="py-2.5 px-4 text-right">Số lượng</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((it, idx) => (
                                                <tr key={idx} className="hover:bg-zinc-50/50">
                                                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                                                        Size {it.sizeLabel}
                                                    </td>
                                                    <td className="py-3 px-4 text-zinc-600">
                                                        {selectedOrder.garmentColor || 'Cotton tiêu chuẩn'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-[#f0592a]">
                                                        {it.quantity} chiếc
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-4 text-center text-zinc-400">
                                                    Không có phân rã size
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 3. Bộ điều khiển số lượng may/in & Thanh tiến độ */}
                            <div className="bg-[#fffdfa] border border-amber-200/80 rounded-2xl p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-950">
                                            Sản lượng hoàn thành trên dây chuyền
                                        </h3>
                                    </div>

                                    {/* Nút cộng trừ số lượng */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => adjustCount(-5)}
                                            className="w-10 h-10 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-700 font-bold transition-colors cursor-pointer shadow-xs"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <div className="px-5 py-2 rounded-xl bg-white border border-zinc-200 text-center min-w-[120px] shadow-xs">
                                            <span className="text-xl font-bold text-zinc-950 font-mono">{currentUnits}</span>
                                            <span className="text-xs text-zinc-400 font-normal"> / {totalUnits}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => adjustCount(5)}
                                            className="w-10 h-10 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-700 font-bold transition-colors cursor-pointer shadow-xs"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Thanh phần trăm tiến độ */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-[#f0592a] font-bold">{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200/80 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#f0592a] transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Chuyển đổi trạng thái sản xuất */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                                    Chuyển giao giai đoạn sản xuất
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { val: 'IN_PRODUCTION', label: '1. Đang sản xuất', icon: Printer },
                                        { val: 'QC_INSPECTION', label: '2. Kiểm định QC', icon: ShieldCheck },
                                        { val: 'SHIPPED', label: '3. Đang giao hàng', icon: Truck },
                                        { val: 'COMPLETED', label: '4. Đã hoàn tất', icon: CheckCircle2 },
                                    ].map((st) => {
                                        const isChecked = currentStatus === st.val;
                                        const Icon = st.icon;
                                        return (
                                            <button
                                                key={st.val}
                                                type="button"
                                                onClick={() => setCurrentStatus(st.val)}
                                                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                                                    isChecked
                                                        ? 'bg-[#f0592a] border-[#f0592a] text-white shadow-xs'
                                                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{st.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 5. Ghi chú xưởng & Nhật ký */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                        Nhật ký kỹ thuật
                                    </label>
                                </div>
                                <textarea
                                    rows={3}
                                    value={stageNotes}
                                    onChange={(e) => setStageNotes(e.target.value)}
                                    placeholder="Nhập thông số mực, áp lực in, thông số nhiệt độ hoặc báo cáo sự cố..."
                                    className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#f0592a] font-medium"
                                />
                            </div>

                            {/* 6. Nút đồng bộ */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100">
                                <span className="text-xs text-zinc-400">
                                </span>

                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={handleSaveProgress}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : saveSuccess ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{saveSuccess ? 'Đã đồng bộ thành công!' : 'Đồng bộ tiến độ & Lưu trạng thái'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-16 text-center text-zinc-400 border border-zinc-200/70">
                            Vui lòng chọn một đơn hàng từ hàng đợi bên trái để quản lý tiến độ.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}