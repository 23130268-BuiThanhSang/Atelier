import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('designer');

    return (
        /* Card được đưa ra giữa, rộng hơn trang Login một chút (640px) để chứa form 2 cột */
        <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden p-8 md:p-10 flex flex-col my-8">

            <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2 text-zinc-950">Tạo tài khoản của bạn</h1>
            <p className="text-zinc-500 mb-8 text-sm">Tham gia thị trường thiết kế trang phục sáng tạo cùng chúng tôi.</p>

            <form className="space-y-6">

                {/* Khu vực Chọn Role */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-900">Vui lòng chọn vai trò chính của bạn</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Designer */}
                        <button
                            type="button"
                            onClick={() => setRole('designer')}
                            className={`text-left p-4 rounded-xl border transition-all relative ${
                                role === 'designer'
                                    ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'
                                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}
                        >
                            <h3 className={`font-semibold text-sm mb-1 ${role === 'designer' ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                Tôi muốn mua sắm và thiết kế
                            </h3>
                            <p className="text-xs text-zinc-500">Thiết kế áo thun theo yêu cầu và đặt hàng theo lô riêng.</p>
                            {role === 'designer' && (
                                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[#f0592a] flex items-center justify-center shadow-sm">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>

                        {/* Option 2: Producer */}
                        <button
                            type="button"
                            onClick={() => setRole('producer')}
                            className={`text-left p-4 rounded-xl border transition-all relative ${
                                role === 'producer'
                                    ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'
                                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}
                        >
                            <h3 className={`font-semibold text-sm mb-1 ${role === 'producer' ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                Tôi là nhà sản xuất
                            </h3>
                            <p className="text-xs text-zinc-500">Hoàn thành đơn đặt hàng và mở rộng xưởng của bạn.</p>
                            {role === 'producer' && (
                                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[#f0592a] flex items-center justify-center shadow-sm">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Hàng chia 2 cột: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-900 block" htmlFor="fullName">Họ và tên</label>
                        <div className="relative">
                            <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-900 block" htmlFor="email">Địa chỉ email</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="E-mail"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-zinc-900 block" htmlFor="password">Mật khẩu</label>
                    </div>
                    <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="w-full pl-10 pr-10 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 pt-1">Bao gồm tối đa 8 ký tự, một số và một ký tự đặc biệt.</p>
                </div>

                {/* Checkbox Điều khoản */}
                <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-zinc-300 text-[#f0592a] focus:ring-[#f0592a] accent-[#f0592a]"
                        />
                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors leading-relaxed">
                            Tôi đồng ý với <a href="#" className="text-[#f0592a] hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#f0592a] hover:underline">Chính sách bảo mật</a> (bao gồm quy định về ký quỹ tiền gửi và giải quyết tranh chấp).
                        </span>
                    </label>
                </div>

                {/* Nút Tạo tài khoản */}
                <button
                    type="button"
                    className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm mt-4"
                >
                    Tạo tài khoản
                </button>

                {/* Divider OR */}
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                        <span className="bg-white px-4 text-zinc-400">HOẶC</span>
                    </div>
                </div>

                {/* Nút Google */}
                <button
                    type="button"
                    className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm text-sm"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Tiếp tục với Google
                </button>

                {/* Link Đăng nhập */}
                <p className="text-center text-sm text-zinc-500 pt-2">
                    Bạn đã có tài khoản?{' '}
                    <Link to="/login" className="text-[#f0592a] font-medium hover:text-[#d94a1f] transition-colors">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}