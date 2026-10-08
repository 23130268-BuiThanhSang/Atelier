import React from 'react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, Shield, AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    return (
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col">

            {/* Icon minh họa */}
            <div className="w-16 h-16 bg-[#f6eed2] rounded-full mx-auto flex items-center justify-center relative mb-6 shadow-sm border border-white">
                <RefreshCw className="w-6 h-6 text-[#d94a1f]" strokeWidth={2.5} />
                <div className="absolute -bottom-1 -right-1 bg-[#f0592a] text-white p-1 rounded-full border-2 border-white">
                    <Shield className="w-3 h-3" fill="currentColor" />
                </div>
            </div>

            {/* Tiêu đề & Mô tả */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-medium tracking-tight text-zinc-950 mb-3">
                    Đặt lại mật khẩu
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed px-4">
                    Nhập địa chỉ email liên kết với tài khoản atelier của bạn và chúng tôi sẽ gửi cho bạn một liên kết xác minh an toàn.
                </p>
            </div>

            {/* Form nhập liệu */}
            <form className="space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900" htmlFor="email">Địa chỉ email</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            id="email"
                            type="email"
                            placeholder="E-mail"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                        <p className="text-[11px] text-zinc-500">Chúng tôi sẽ gửi cho bạn một liên kết đặt lại thông tin đăng nhập dùng một lần.</p>
                    </div>
                </div>

                {/* Nút gửi */}
                <button
                    type="button"
                    className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group"
                >
                    Gửi liên kết
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Link quay lại đăng nhập */}
                <div className="pt-2">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại đăng nhập
                    </Link>
                </div>

            </form>

            {/* Hộp thông báo bảo mật (Security Notice) */}
            <div className="mt-8 p-4 rounded-xl border border-[#f0e8ce] bg-[#fdfbf4]">
                <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-4 h-4 text-[#f0592a]" fill="currentColor" />
                    <h3 className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Thông báo bảo mật</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                    Vì lý do bảo mật, liên kết đặt lại mật khẩu sẽ hết hạn sau 30 phút. Nếu bạn không nhận được email trong vòng 2 phút, hãy kiểm tra thư mục thư rác hoặc xác minh tài khoản của bạn.
                </p>
            </div>

            {/* Footer nhỏ của riêng Card */}
            <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-between items-center text-[11px] font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Mã hóa 256-bit TLS
                </div>
                <a href="#" className="hover:text-zinc-900 transition-colors">
                    Liên hệ bộ phận hỗ trợ
                </a>
            </div>

        </div>
    );
}