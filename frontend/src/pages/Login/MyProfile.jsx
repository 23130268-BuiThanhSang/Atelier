import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut, Camera, AlertCircle, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: 14,
        fullName: 'Thanh An',
        email: '23130002@st.hcmuaf.edu.vn',
        phone: '',
        avatarUrl: null,
        status: 'ACTIVE',
        emailVerified: false,
        createdAt: '2026-10-13 14:10:42'
    });

    // Hàm xử lý Đăng xuất
    const handleLogout = () => {

        localStorage.removeItem('userName');

        navigate('/login');
    };

    // Format ngày tháng hiển thị
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(date);
    };

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#fdfbf4] py-10 px-4 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    {/* Băng màu cam trang trí */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0592a] to-[#d94a1f]"></div>

                    {/* Avatar */}
                    <div className="relative mt-10 md:mt-8 z-10 group cursor-pointer">
                        <div className="w-28 h-28 rounded-full border-4 border-white bg-[#f6eed2] shadow-md flex items-center justify-center overflow-hidden">
                            {userData.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-[#d94a1f]">
                                    {userData.fullName.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Thông tin chính */}
                    <div className="flex-1 text-center md:text-left mt-2 md:mt-14 z-10">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                            {userData.fullName}
                            {userData.status === 'ACTIVE' && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold tracking-wider uppercase border border-green-200">
                                    Active
                                </span>
                            )}
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">Thành viên Atelier Design Studio</p>
                    </div>

                    {/* Nút hành động */}
                    <div className="z-10 mt-4 md:mt-14 flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:border-[#f0592a] hover:text-[#f0592a] px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
                            <Edit3 className="w-4 h-4" /> Chỉnh sửa
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Grid Chi tiết */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Cột thông tin chi tiết */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#f0592a]" /> Thông tin cá nhân
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Họ và tên</label>
                                    <div className="font-medium text-zinc-900">{userData.fullName}</div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Số điện thoại</label>
                                    <div className="flex items-center gap-2 font-medium text-zinc-900">
                                        <Phone className="w-4 h-4 text-zinc-400" />
                                        {userData.phone || <span className="text-zinc-400 italic font-normal">Chưa cập nhật</span>}
                                    </div>
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Địa chỉ Email</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 font-medium text-zinc-900">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                            {userData.email}
                                        </div>
                                        {userData.emailVerified ? (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs px-2 py-1 rounded-md font-medium border border-green-100">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Đã xác minh
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-md font-medium border border-amber-100">
                                                <AlertCircle className="w-3.5 h-3.5" /> Chưa xác minh
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột bảo mật & Hoạt động */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 p-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#f0592a]" /> Tài khoản
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                                    <Calendar className="w-8 h-8 p-1.5 bg-white text-zinc-500 rounded-lg shadow-sm" />
                                    <div>
                                        <p className="text-[11px] font-semibold text-zinc-500 uppercase">Ngày tham gia</p>
                                        <p className="text-sm font-medium text-zinc-900">{formatDate(userData.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button className="w-full text-left p-3 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 group-hover:text-[#f0592a] transition-colors">Đổi mật khẩu</p>
                                            <p className="text-xs text-zinc-500">Cập nhật mật khẩu bảo mật</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center group-hover:border-[#f0592a]/30">
                                            <span className="text-zinc-400 group-hover:text-[#f0592a]">→</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}