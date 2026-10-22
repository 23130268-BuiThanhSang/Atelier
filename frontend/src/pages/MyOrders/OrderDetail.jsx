import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Package, Truck, CheckCircle,
    Clock, AlertCircle, MapPin, Phone, User,
    Receipt, CreditCard, ExternalLink
} from 'lucide-react';

export default function OrderDetail() {
    const { id } = useParams(); // Lấy mã đơn hàng từ URL, vd: /orders/ORD-261020-001
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // GỌI API THẬT LẤY CHI TIẾT
        fetch(`http://localhost:8080/api/orders/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
                return res.json();
            })
            .then(data => {
                setOrder(data); // Đưa Object JSON thật vào State
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy chi tiết đơn hàng:", err);
                setIsLoading(false);
            });
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(new Date(dateString));
    };

    // Hàm render Tiến trình (Stepper) dựa vào Status
    const renderStepper = (currentStatus) => {
        const steps = [
            { id: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
            { id: 'IN_PROGRESS', label: 'Đang sản xuất', icon: Package },
            { id: 'DELIVERING', label: 'Đang giao hàng', icon: Truck },
            { id: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle }
        ];

        let activeIndex = steps.findIndex(s => s.id === currentStatus);
        if (currentStatus === 'CANCELLED') activeIndex = -1; // Hủy thì tắt hết tiến trình

        return (
            <div className="relative flex justify-between w-full mt-8 mb-4">
                {/* Đường chỉ chạy ngầm (Thanh progress bar) */}
                <div className="absolute top-5 left-0 w-full h-1 bg-zinc-200 rounded-full z-0"></div>
                <div
                    className="absolute top-5 left-0 h-1 bg-[#f0592a] rounded-full z-0 transition-all duration-500"
                    style={{ width: activeIndex >= 0 ? `${(activeIndex / (steps.length - 1)) * 100}%` : '0%' }}
                ></div>

                {/* Các điểm (Nút tiến trình) */}
                {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                                isCompleted ? 'bg-[#f0592a] text-white' : 'bg-zinc-200 text-zinc-400'
                            } ${isCurrent ? 'ring-4 ring-[#f0592a]/20' : ''}`}>
                                <StepIcon className="w-4 h-4" />
                            </div>
                            <span className={`text-xs font-bold ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (isLoading || !order) return <div className="p-10 text-center text-zinc-500">Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfbf4] py-8 px-4 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* --- HEADER BACK & TITLE --- */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:text-[#f0592a] hover:border-[#f0592a] transition-colors shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                            Chi tiết Đơn hàng #{order.orderCode}
                            {order.status === 'CANCELLED' && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-md font-bold">ĐÃ HỦY</span>}
                        </h1>
                        <p className="text-sm text-zinc-500">Ngày đặt: {formatDate(order.createdAt)}</p>
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* CỘT TRÁI (LỚN): TIẾN TRÌNH & SẢN PHẨM */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Box 1: Tiến trình đơn hàng */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-2">Trạng thái đơn hàng</h2>
                            {order.status === 'CANCELLED' ? (
                                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-red-700">Đơn hàng đã bị hủy</h3>
                                        <p className="text-sm text-red-600 mt-1">Lý do: Khách hàng yêu cầu hủy đơn do thay đổi kế hoạch sản xuất.</p>
                                    </div>
                                </div>
                            ) : (
                                renderStepper(order.status)
                            )}
                        </div>

                        {/* Box 2: Danh sách Sản phẩm */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#f0592a]" /> Sản phẩm / Dịch vụ
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border border-zinc-100 rounded-xl bg-zinc-50/50">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-zinc-200" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-zinc-900">{item.name}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">Đơn giá: {formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-zinc-900">x {item.quantity}</p>
                                            <p className="font-bold text-[#f0592a] mt-1">{formatCurrency(item.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* CỘT PHẢI (NHỎ): THÔNG TIN KHÁCH HÀNG & THANH TOÁN */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Box 3: Thông tin giao hàng */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6">
                            <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#f0592a]" /> Địa chỉ nhận hàng
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-zinc-700">
                                    <User className="w-4 h-4 text-zinc-400" />
                                    <span className="font-bold">{order.shippingName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-700">
                                    <Phone className="w-4 h-4 text-zinc-400" />
                                    <span>{order.shippingPhone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-zinc-700">
                                    <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">{order.shippingAddress}</span>
                                </div>
                            </div>
                            <div className="mt-5 pt-5 border-t border-zinc-100">
                                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Đối tác sản xuất</p>
                                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                    <span className="font-bold text-zinc-900 text-sm">{order.partnerName}</span>
                                    <ExternalLink className="w-4 h-4 text-[#f0592a] cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {/* Box 4: Tóm tắt thanh toán */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6">
                            <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#f0592a]" /> Chi tiết thanh toán
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Tổng tiền hàng ({order.items.length} sp)</span>
                                    <span className="font-medium text-zinc-900">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-600">
                                    <span>Phí vận chuyển dự kiến</span>
                                    <span className="font-medium text-zinc-900">{formatCurrency(order.shippingFee)}</span>
                                </div>
                                <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between items-center">
                                    <span className="font-bold text-zinc-900">Tổng thanh toán</span>
                                    <span className="text-xl font-bold text-[#f0592a]">{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>

                            {/* Nút Hành động */}
                            <div className="mt-6 space-y-3">
                                {order.status === 'PENDING' && (
                                    <button className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-xl transition-colors">
                                        Hủy đơn hàng
                                    </button>
                                )}
                                <button className="w-full flex justify-center items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 font-bold py-3 rounded-xl transition-colors">
                                    <CreditCard className="w-4 h-4" /> Thanh toán / Đặt cọc
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}