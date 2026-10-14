import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Calendar, ShieldCheck, LogOut, Camera,
    AlertCircle, Edit3, X, Save, Building2, MapPin, Package,
    Clock, Banknote, ToggleLeft, ToggleRight, Info, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Gom toàn bộ dữ liệu User và Producer vào chung 1 object
    const [profile, setProfile] = useState({});
    const [editForm, setEditForm] = useState({});

    // 1. GỌI API LẤY DỮ LIỆU KHI TẢI TRANG
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');

        if (!userEmail) {
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/api/profile?email=${userEmail}`)
            .then(res => {
                if (!res.ok) throw new Error("Lỗi tải dữ liệu");
                return res.json();
            })
            .then(data => {
                setProfile(data);
                setEditForm(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy hồ sơ:", err);
                setIsLoading(false);
            });
    }, [navigate]);

    // Xử lý khi gõ input
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditClick = () => {
        setEditForm(profile); // Đảm bảo form lấy data mới nhất
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    // 2. GỌI API LƯU DỮ LIỆU
    const handleSave = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch(`http://localhost:8080/api/profile?email=${userEmail}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                setProfile(editForm); // Cập nhật lại UI lập tức
                setIsEditing(false);

                // Cập nhật lại tên trên trình duyệt để Header tự đổi tên
                localStorage.setItem('userName', editForm.fullName);
                window.dispatchEvent(new Event("storage"));
            } else {
                alert("Đã xảy ra lỗi khi lưu hồ sơ.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối tới máy chủ.");
        }
    };

    // 3. ĐĂNG XUẤT
    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(new Date(dateString));
    };

    // Hiển thị vòng xoay nếu đang load API
    if (isLoading) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfbf4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f0592a]" />
                    <p className="text-sm font-medium">Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfbf4] py-10 px-4 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ================= HEADER SECTION ================= */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0592a] to-[#d94a1f]"></div>

                    <div className="relative mt-10 md:mt-8 z-10 group cursor-pointer">
                        <div className="w-28 h-28 rounded-full border-4 border-white bg-[#f6eed2] shadow-md flex items-center justify-center overflow-hidden">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-[#d94a1f]">{profile.fullName?.charAt(0)}</span>
                            )}
                        </div>
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left mt-2 md:mt-14 z-10">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                            {profile.fullName}
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${profile.role === 'PRODUCER' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                {profile.role}
                            </span>
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">{profile.role === 'PRODUCER' ? profile.businessName : 'Thành viên Atelier'}</p>
                    </div>

                    <div className="z-10 mt-4 md:mt-14 flex gap-3 w-full md:w-auto">
                        {!isEditing ? (
                            <>
                                <button onClick={handleEditClick} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:border-[#f0592a] hover:text-[#f0592a] px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
                                    <Edit3 className="w-4 h-4" /> Chỉnh sửa
                                </button>
                                <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
                                    <LogOut className="w-4 h-4" /> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleCancel} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-5 py-2.5 rounded-xl font-medium text-sm transition-all">
                                    <X className="w-4 h-4" /> Hủy
                                </button>
                                <button onClick={handleSave} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#f0592a] text-white hover:bg-[#d94a1f] px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
                                    <Save className="w-4 h-4" /> Lưu thay đổi
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* ================= CỘT TRÁI (Thông tin cá nhân & Tài khoản) ================= */}
                    <div className="xl:col-span-1 space-y-6">

                        {/* THÔNG TIN CÁ NHÂN */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#f0592a]" /> Thông tin liên hệ
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Họ và tên</label>
                                    {isEditing ? (
                                        <input type="text" name="fullName" value={editForm.fullName || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900 bg-white" />
                                    ) : (
                                        <div className="font-medium text-zinc-900">{profile.fullName}</div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Số điện thoại</label>
                                    {isEditing ? (
                                        <input type="text" name="phone" value={editForm.phone || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900 bg-white" />
                                    ) : (
                                        <div className="flex items-center gap-2 font-medium text-zinc-900">
                                            <Phone className="w-4 h-4 text-zinc-400" /> {profile.phone || <span className="text-zinc-400 italic font-normal">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email (Không thể đổi)</label>
                                    <div className="flex items-center gap-2 font-medium text-zinc-500 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100">
                                        <Mail className="w-4 h-4 text-zinc-400" /> {profile.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TÀI KHOẢN (Hiển thị ngày tham gia) */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#f0592a]" /> Tài khoản
                            </h2>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                <Calendar className="w-8 h-8 p-1.5 bg-white text-zinc-500 rounded-lg shadow-sm" />
                                <div>
                                    <p className="text-[11px] font-semibold text-zinc-500 uppercase">Ngày tham gia</p>
                                    <p className="text-sm font-medium text-zinc-900">{formatDate(profile.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI (Thông tin doanh nghiệp dành riêng cho Producer) ================= */}
                    <div className="xl:col-span-2 space-y-6">
                        {profile.role === 'PRODUCER' && (
                            <>
                                {/* HỒ SƠ DOANH NGHIỆP */}
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-[#f0592a]" /> Hồ sơ Nhà sản xuất
                                        </h2>
                                        {/* Nút Toggle Trạng thái nhận đơn */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-zinc-500">Nhận đơn hàng:</span>
                                            {isEditing ? (
                                                <button type="button" onClick={() => setEditForm(prev => ({ ...prev, isAcceptingOrders: !prev.isAcceptingOrders }))}>
                                                    {editForm.isAcceptingOrders ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-zinc-400" />}
                                                </button>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${profile.isAcceptingOrders ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                                                    {profile.isAcceptingOrders ? 'ĐANG MỞ' : 'TẠM DỪNG'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tên Xưởng / Doanh nghiệp</label>
                                            {isEditing ? (
                                                <input type="text" name="businessName" value={editForm.businessName || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900 font-bold" />
                                            ) : (
                                                <div className="font-bold text-lg text-zinc-900">{profile.businessName || 'Chưa cập nhật'}</div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Giới thiệu (Description)</label>
                                            {isEditing ? (
                                                <textarea name="description" value={editForm.description || ''} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900 resize-none" />
                                            ) : (
                                                <div className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">{profile.description || 'Chưa có thông tin giới thiệu'}</div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tỉnh / Thành phố</label>
                                            {isEditing ? (
                                                <input type="text" name="province" value={editForm.province || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900" />
                                            ) : (
                                                <div className="flex items-center gap-2 font-medium text-zinc-900">
                                                    <MapPin className="w-4 h-4 text-zinc-400" /> {profile.province || 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Địa chỉ chi tiết</label>
                                            {isEditing ? (
                                                <input type="text" name="address" value={editForm.address || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] text-sm text-zinc-900" />
                                            ) : (
                                                <div className="font-medium text-zinc-900 truncate">{profile.address || 'Chưa cập nhật'}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* NĂNG LỰC SẢN XUẤT */}
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-6 md:p-8">
                                    <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-[#f0592a]" /> Năng lực & Báo giá
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> MOQ (Tối thiểu)</label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input type="number" name="moq" value={editForm.moq || 0} onChange={handleInputChange} className="w-24 px-2 py-1 rounded border border-zinc-300 text-sm font-bold text-[#f0592a]" />
                                                    <span className="text-xs text-zinc-500">sp/mẫu</span>
                                                </div>
                                            ) : (
                                                <div className="font-bold text-lg text-[#f0592a]">{profile.moq || 0} <span className="text-sm font-medium text-zinc-500">sản phẩm</span></div>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Công suất / Tháng</label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input type="number" name="monthlyCapacity" value={editForm.monthlyCapacity || 0} onChange={handleInputChange} className="w-32 px-2 py-1 rounded border border-zinc-300 text-sm font-bold text-zinc-900" />
                                                </div>
                                            ) : (
                                                <div className="font-bold text-lg text-zinc-900">{new Intl.NumberFormat('vi-VN').format(profile.monthlyCapacity || 0)} <span className="text-sm font-medium text-zinc-500">sp</span></div>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Thời gian gia công</label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input type="number" name="leadTimeDays" value={editForm.leadTimeDays || 0} onChange={handleInputChange} className="w-20 px-2 py-1 rounded border border-zinc-300 text-sm font-bold text-zinc-900" />
                                                    <span className="text-xs text-zinc-500">ngày</span>
                                                </div>
                                            ) : (
                                                <div className="font-bold text-lg text-zinc-900">{profile.leadTimeDays || 0} <span className="text-sm font-medium text-zinc-500">ngày</span></div>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> Khoảng giá (Ước tính)</label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <input type="number" name="priceMin" value={editForm.priceMin || 0} onChange={handleInputChange} className="w-24 px-2 py-1 rounded border border-zinc-300 text-sm font-bold text-zinc-900" />
                                                    -
                                                    <input type="number" name="priceMax" value={editForm.priceMax || 0} onChange={handleInputChange} className="w-28 px-2 py-1 rounded border border-zinc-300 text-sm font-bold text-zinc-900" />
                                                </div>
                                            ) : (
                                                <div className="font-bold text-lg text-zinc-900">
                                                    {new Intl.NumberFormat('vi-VN').format(profile.priceMin || 0)}đ - {new Intl.NumberFormat('vi-VN').format(profile.priceMax || 0)}đ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Nếu là DESIGNER */}
                        {profile.role === 'DESIGNER' && (
                            <div className="bg-white rounded-2xl border border-zinc-200/60 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                    <Camera className="w-6 h-6 text-zinc-300" />
                                </div>
                                <h3 className="text-zinc-900 font-medium mb-1">Chưa có Portfolio</h3>
                                <p className="text-zinc-500 text-sm">Tính năng tạo hồ sơ năng lực dành cho Designer sẽ sớm ra mắt.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}