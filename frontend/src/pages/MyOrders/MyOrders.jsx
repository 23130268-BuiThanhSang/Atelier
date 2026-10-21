import React, { useState, useEffect } from 'react';
import {
    ShoppingBag, Search, Filter,
    Clock, Package, Truck, CheckCircle, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyOrder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState('');


    // Quản lý Tab đang chọn (Mặc định là xem 'ALL' - Tất cả)
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Lấy Role từ LocalStorage để biết là Designer hay Producer
        const role = localStorage.getItem('userRole') || 'DESIGNER';
        setUserRole(role);

        // GỌI API LẤY DANH SÁCH ĐƠN HÀNG (Thay thế URL bằng API thật của bạn)
        // fetch(`http://localhost:8080/api/orders/user/${localStorage.getItem('userEmail')}`)

        // MOCK DATA MẪU
        setTimeout(() => {
            setOrders([
                { id: 'ORD-261020-001', orderCode: 'ATL-88392-XC', date: '2026-10-20T10:30:00', status: 'COMPLETED', total: 15500000, partnerName: 'Xưởng May Vina', itemsCount: 2 },
                { id: 'ORD-260915-002', orderCode: 'ATL-55110-AB', date: '2026-09-15T09:15:00', status: 'IN_PROGRESS', total: 45000000, partnerName: 'In Lụa Cao Cấp', itemsCount: 1 },
                { id: 'ORD-260905-003', orderCode: 'ATL-99221-ZZ', date: '2026-09-05T14:45:00', status: 'PENDING', total: 8500000, partnerName: 'Công ty TNHH Vải Đẹp', itemsCount: 3 },
                { id: 'ORD-260801-004', orderCode: 'ATL-11002-MM', date: '2026-08-01T16:20:00', status: 'CANCELLED', total: 12000000, partnerName: 'Xưởng Phụ Liệu Kim', itemsCount: 5 }
            ]);
            setIsLoading(false);
        }, 600);
    }, []);

    // Format tiền tệ và ngày tháng
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (dateString) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));

    // UI render Status
    const renderOrderStatus = (status) => {
        switch (status) {
            case 'COMPLETED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle className="w-3.5 h-3.5" /> Hoàn thành</span>;
            case 'IN_PROGRESS': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><Package className="w-3.5 h-3.5" /> Đang sản xuất</span>;
            case 'DELIVERING': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"><Truck className="w-3.5 h-3.5" /> Đang giao hàng</span>;
            case 'CANCELLED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
            default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200"><Clock className="w-3.5 h-3.5" /> Chờ xác nhận</span>;
        }
    };

    // Bộ lọc đơn hàng (Theo Tab và Text tìm kiếm)
    const filteredOrders = orders.filter(order => {
        const matchTab = activeTab === 'ALL' || order.status === activeTab;
        const matchSearch = order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchTab && matchSearch;
    });

    const TABS = [
        { id: 'ALL', label: 'Tất cả' },
        { id: 'PENDING', label: 'Chờ xác nhận' },
        { id: 'IN_PROGRESS', label: 'Đang xử lý' },
        { id: 'COMPLETED', label: 'Hoàn thành' },
        { id: 'CANCELLED', label: 'Đã hủy' }
    ];

    if (isLoading) return <div className="p-10 text-center text-zinc-500 font-medium mt-20">Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfbf4] py-10 px-4 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* --- TITLE & SEARCH BAR --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-3 tracking-tight">
                            <ShoppingBag className="w-6 h-6 text-[#f0592a]" /> Đơn hàng của tôi
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            {userRole === 'PRODUCER' ? 'Danh sách các đơn đặt hàng gia công từ Designer.' : 'Danh sách các đơn đặt hàng gia công của bạn.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn hoặc tên đối tác..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm w-full md:w-64 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-600 px-4 py-2 rounded-xl text-sm font-medium hover:text-[#f0592a] hover:border-[#f0592a] transition-colors shadow-sm">
                            <Filter className="w-4 h-4" /> Bộ lọc
                        </button>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden">
                    <div className="flex overflow-x-auto hide-scrollbar border-b border-zinc-100">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all relative ${
                                    activeTab === tab.id ? 'text-[#f0592a]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f0592a] rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* --- LIST ORDERS --- */}
                    <div className="p-4 md:p-6">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 text-zinc-300 mb-3" />
                                <h3 className="font-bold text-zinc-900 text-lg">Không tìm thấy đơn hàng</h3>
                                <p className="text-zinc-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => navigate(`/order_detail/`)} // ${order.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-zinc-200 bg-white hover:border-[#f0592a] hover:shadow-md transition-all cursor-pointer group"
                                    >

                                        {/* Trái: Thông tin Đơn */}
                                        <div className="mb-4 md:mb-0 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md text-sm border border-zinc-200 tracking-wide">
                                                    #{order.orderCode}
                                                </span>
                                                <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" /> {formatDate(order.date)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-zinc-700 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-xs uppercase font-bold text-zinc-400">ĐỐI TÁC:</span> 
                                                    <span className="font-semibold">{order.partnerName}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-xs uppercase font-bold text-zinc-400">SỐ LƯỢNG SP:</span> 
                                                    <span className="font-semibold">{order.itemsCount}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Phải: Trạng thái & Tiền */}
                                        <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                                            <div className="flex flex-col items-start md:items-end gap-1.5">
                                                {renderOrderStatus(order.status)}
                                                <div className="font-bold text-lg text-zinc-900 mt-1">
                                                    {formatCurrency(order.total)}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-[#f0592a] group-hover:border-[#f0592a] group-hover:text-white transition-all shadow-sm">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}