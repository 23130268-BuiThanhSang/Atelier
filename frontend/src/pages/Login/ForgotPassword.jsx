import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, Shield, AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSendLink = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email của bạn.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.text();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!' });
                setEmail(''); // Xóa trắng ô input sau khi gửi thành công
            } else {
                setMessage({ type: 'error', text: data || 'Không tìm thấy tài khoản với email này.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col mx-auto mt-10">

            <div className="w-16 h-16 bg-[#f6eed2] rounded-full mx-auto flex items-center justify-center relative mb-6 shadow-sm border border-white">
                <RefreshCw className={`w-6 h-6 text-[#d94a1f] ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                <div className="absolute -bottom-1 -right-1 bg-[#f0592a] text-white p-1 rounded-full border-2 border-white">
                    <Shield className="w-3 h-3" fill="currentColor" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-medium tracking-tight text-zinc-950 mb-3">
                    Đặt lại mật khẩu
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed px-4">
                    Nhập địa chỉ email liên kết với tài khoản atelier của bạn và chúng tôi sẽ gửi cho bạn một liên kết xác minh an toàn.
                </p>
            </div>

            {/* Vùng hiển thị thông báo lỗi/thành công */}
            {message.text && (
                <div className={`mb-6 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSendLink}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900" htmlFor="email">Địa chỉ email</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                        <p className="text-[11px] text-zinc-500">Chúng tôi sẽ gửi cho bạn một liên kết đặt lại thông tin đăng nhập dùng một lần.</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group"
                >
                    {isLoading ? 'Đang xử lý...' : 'Gửi liên kết'}
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="pt-2">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                    </Link>
                </div>
            </form>

            <div className="mt-8 p-4 rounded-xl border border-[#f0e8ce] bg-[#fdfbf4]">
                <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-4 h-4 text-[#f0592a]" fill="currentColor" />
                    <h3 className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Thông báo bảo mật</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                    Vì lý do bảo mật, liên kết đặt lại mật khẩu sẽ hết hạn sau 30 phút. Nếu bạn không nhận được email trong vòng 2 phút, hãy kiểm tra thư mục thư rác hoặc xác minh tài khoản của bạn.
                </p>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-between items-center text-[11px] font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Mã hóa 256-bit TLS
                </div>
                <a href="#" className="hover:text-zinc-900 transition-colors">Liên hệ bộ phận hỗ trợ</a>
            </div>
        </div>
    );
}