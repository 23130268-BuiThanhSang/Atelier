import React, { useState, useEffect } from 'react';
import {
    Shirt,
    Users,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    Save,
    ShieldAlert
} from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [metrics, setMetrics] = useState({
        producerCount: 0,
        customerCount: 0
    });

    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Modal state
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState('');
    const [isSavingStatus, setIsSavingStatus] = useState(false);

    // 1. Tải chỉ số Metric (Xưởng sản xuất & Khách hàng)
    const fetchMetrics = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/users/metrics');
            if (res.ok) {
                const data = await res.json();
                setMetrics(data);
            }
        } catch (e) {
            console.error('Lỗi khi fetch metrics user:', e);
        }
    };

    // 2. Tải danh sách người dùng
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('size', 7);

            if (roleFilter && roleFilter !== 'ALL') {
                params.append('role', roleFilter);
            }
            if (statusFilter && statusFilter !== 'ALL') {
                params.append('status', statusFilter);
            }
            if (searchKeyword && searchKeyword.trim()) {
                params.append('keyword', searchKeyword.trim());
            }

            const res = await fetch(`http://localhost:8080/api/v1/admin/users?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            }
        } catch (e) {
            console.error('Lỗi khi fetch users:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, roleFilter, statusFilter]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0);
            fetchUsers();
        }
    };

    // Mở modal xem thông tin user
    const handleViewDetail = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/admin/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedUser(data);
                setUpdatingStatus(data.status);
                setIsModalOpen(true);
            }
        } catch (e) {
            console.error('Lỗi fetch chi tiết người dùng:', e);
        }
    };

    // Cập nhật trạng thái tài khoản
    const handleUpdateStatus = async () => {
        if (!selectedUser) return;
        setIsSavingStatus(true);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/admin/users/${selectedUser.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: updatingStatus })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchUsers();
                fetchMetrics();
            } else {
                alert('Cập nhật thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối máy chủ');
        } finally {
            setIsSavingStatus(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('vi-VN');
    };

    const renderRoleBadge = (role) => {
        const r = (role || '').toUpperCase();
        if (r === 'PRODUCER') {
            return (
                <span className="px-2.5 py-1 rounded-full bg-[#fefccf] text-[#f0592a] text-[11px] font-semibold border border-[#f0592a]/20">
                    Xưởng sản xuất
                </span>
            );
        }
        if (r === 'ADMIN') {
            return (
                <span className="px-2.5 py-1 rounded-full bg-[#f0592a] text-white text-[11px] font-bold">
                    Quản trị viên
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                Khách hàng
            </span>
        );
    };

    const renderStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'ACTIVE') {
            return (
                <span className="px-2.5 py-1 rounded-full bg-[#fefccf] text-[#f0592a] text-[11px] font-semibold border border-[#f0592a]/20">
                    Hoạt động
                </span>
            );
        }
        if (s === 'SUSPENDED') {
            return (
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-medium border border-red-200">
                    Đình chỉ
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                Chờ xác minh
            </span>
        );
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header */}
            <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                    <span>Quản trị tài khoản</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Người dùng</h1>
            </div>

            {/* 2. Dải 2 Card chỉ số KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                            Xưởng sản xuất
                        </span>
                        <Shirt className="w-5 h-5 text-[#f0592a]" />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xl font-bold text-zinc-950 tracking-tight">
                            {metrics.producerCount}
                        </span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                            Khách hàng
                        </span>
                        <Users className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xl font-bold text-zinc-950 tracking-tight">
                            {metrics.customerCount}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Toolbar & Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Tìm kiếm theo tên, email, SĐT... (Nhấn Enter)"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Lọc theo Role */}
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option value="ALL">Tất cả vai trò</option>
                                <option value="DESIGNER">Khách hàng</option>
                                <option value="PRODUCER">Xưởng sản xuất</option>
                                <option value="ADMIN">Quản trị viên</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>

                        {/* Lọc theo Status */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="h-11 pl-3.5 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 appearance-none cursor-pointer focus:outline-none focus:border-[#f0592a]"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="SUSPENDED">Đình chỉ</option>
                                <option value="PENDING">Chờ xác minh</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Bảng danh sách User */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px] border-collapse">
                        <thead>
                        <tr className="bg-[#faf8e4]/40 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-y border-zinc-100">
                            <th className="py-3 px-6">Ảnh & Họ tên</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Vai trò</th>
                            <th className="py-3 px-4">Ngày tham gia</th>
                            <th className="py-3 px-4">Trạng thái</th>
                            <th className="py-3 px-6 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-zinc-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#f0592a] mb-2" />
                                    Đang tải dữ liệu người dùng...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-zinc-400 font-medium">
                                    Không tìm thấy người dùng phù hợp.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => {
                                const initial = (u.fullName || 'U').charAt(0).toUpperCase();
                                const isProducer = u.role?.toUpperCase() === 'PRODUCER';

                                return (
                                    <tr key={u.id} className="hover:bg-zinc-50/70 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {u.avatarUrl ? (
                                                    <img
                                                        src={u.avatarUrl}
                                                        alt={u.fullName}
                                                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200"
                                                    />
                                                ) : u.role?.toUpperCase() === 'ADMIN' ? (
                                                    <div className="w-10 h-10 rounded-full bg-[#f0592a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                        <ShieldAlert className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] flex items-center justify-center font-bold text-xs shrink-0 border border-[#f0592a]/20">
                                                        {initial}
                                                    </div>
                                                )}
                                                <span className="font-semibold text-zinc-900 truncate">{u.fullName}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-zinc-500 font-medium">{u.email}</td>

                                        <td className="py-4 px-4">{renderRoleBadge(u.role)}</td>

                                        <td className="py-4 px-4 text-zinc-400 text-[11px]">{formatDate(u.createdAt)}</td>

                                        <td className="py-4 px-4">{renderStatusBadge(u.status)}</td>

                                        {/* Nút Xem mở modal */}
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => handleViewDetail(u.id)}
                                                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-[#f0592a] hover:text-white text-zinc-700 text-[11px] font-semibold transition-colors cursor-pointer"
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="p-4 md:p-6 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div>
                        Hiển thị <strong>{users.length}</strong> trong <strong>{totalElements}</strong> người dùng
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 bg-[#f0592a] text-white rounded-lg">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MODAL CHI TIẾT NGƯỜI DÙNG & CHỈNH SỬA TRẠNG THÁI */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-base font-bold text-zinc-950">
                                Hồ sơ người dùng: <span className="text-[#f0592a]">#{selectedUser.id}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thông tin hồ sơ */}
                        <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl space-y-2 text-xs">
                            <p><strong className="text-zinc-700">Họ và tên:</strong> <span className="text-zinc-900 font-semibold">{selectedUser.fullName || '—'}</span></p>
                            <p><strong className="text-zinc-700">Email:</strong> <span className="text-zinc-900">{selectedUser.email}</span></p>
                            <p><strong className="text-zinc-700">Số điện thoại:</strong> <span className="text-zinc-900">{selectedUser.phone || 'Chưa cập nhật'}</span></p>
                            <p><strong className="text-zinc-700">Địa chỉ:</strong> <span className="text-zinc-900">{selectedUser.address || 'Chưa cập nhật'}</span></p>
                            <p><strong className="text-zinc-700">Vai trò:</strong> <span className="ml-1">{renderRoleBadge(selectedUser.role)}</span></p>
                            <p><strong className="text-zinc-700">Ngày tham gia:</strong> <span className="text-zinc-500">{formatDate(selectedUser.createdAt)}</span></p>
                        </div>

                        {/* Cập nhật trạng thái tài khoản */}
                        <div className="space-y-2 pt-1">
                            <label className="text-xs font-bold text-zinc-800">Cập nhật trạng thái tài khoản:</label>
                            <div className="relative">
                                <select
                                    value={updatingStatus}
                                    onChange={(e) => setUpdatingStatus(e.target.value)}
                                    className="w-full h-11 pl-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 appearance-none focus:outline-none focus:border-[#f0592a]"
                                >
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="SUSPENDED">Đình chỉ</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                disabled={isSavingStatus}
                                onClick={handleUpdateStatus}
                                className="px-5 py-2.5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                            >
                                {isSavingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Lưu trạng thái</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}