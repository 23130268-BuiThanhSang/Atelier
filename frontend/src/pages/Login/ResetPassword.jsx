import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Key, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    // Các state cơ bản
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [isCheckingToken, setIsCheckingToken] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get('token');

        if (urlToken) {
            setToken(urlToken);
            fetch(`http://localhost:8080/api/auth/check-reset-token?token=${urlToken}`)
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        setIsTokenValid(true);
                    } else {
                        setIsTokenValid(false);
                        setMessage({ type: 'error', text: data.message || 'Liên kết không hợp lệ, đã sử dụng hoặc hết hạn.' });
                    }
                })
                .catch(err => {
                    console.error("Lỗi kiểm tra token:", err);
                    setIsTokenValid(false);
                    setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ để xác thực liên kết.' });
                })
                .finally(() => {
                    setIsCheckingToken(false);
                });
        } else {
            setIsTokenValid(false);
            setIsCheckingToken(false);
            setMessage({ type: 'error', text: 'Liên kết không hợp lệ hoặc bị thiếu mã xác thực.' });
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 8 ký tự.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.text();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Mật khẩu đã được đổi thành công! Đang chuyển hướng...' });
                setTimeout(() => { navigate('/login'); }, 2000);
            } else {
                setMessage({ type: 'error', text: data || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingToken) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f0592a]" />
                    <p className="text-sm font-medium">Đang xác thực liên kết...</p>
                </div>
            </div>
        );
    }
    if (!isTokenValid) {
        return (
            <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Liên kết không khả dụng</h2>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                        {message.text || 'Liên kết đặt lại mật khẩu này đã hết hạn hoặc đã được sử dụng trước đó. Vì lý do bảo mật, mỗi liên kết chỉ có tác dụng một lần.'}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm"
                    >
                        Quay lại Đăng nhập
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col">

                {/* Icon minh họa */}
                <div className="w-16 h-16 bg-[#f6eed2] rounded-full mx-auto flex items-center justify-center relative mb-6 shadow-sm border border-white">
                    <Key className="w-6 h-6 text-[#d94a1f]" strokeWidth={2.5} />
                    <div className="absolute -bottom-1 -right-1 bg-[#f0592a] text-white p-1 rounded-full border-2 border-white">
                        <ShieldCheck className="w-3 h-3" fill="currentColor" />
                    </div>
                </div>

                {/* Tiêu đề */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium tracking-tight text-zinc-950 mb-3">
                        Tạo mật khẩu mới
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed px-4">
                        Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước đó.
                    </p>
                </div>

                {/* Khu vực thông báo */}
                {message.text && (
                    <div className={`mb-6 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Input Mật khẩu mới */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-900 block">Mật khẩu mới</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự"
                                disabled={isLoading || !token}
                                className="w-full pl-10 pr-10 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Input Xác nhận mật khẩu */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-900 block">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                disabled={isLoading || !token}
                                className="w-full pl-10 pr-10 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Nút Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group mt-2"
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

            </div>
        </div>
    );
}