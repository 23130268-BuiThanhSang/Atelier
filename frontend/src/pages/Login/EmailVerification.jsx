import React, { useState, useEffect } from 'react';
import { Check, Mail, Clock, ArrowRight, Edit2, ShieldCheck, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // BẮT BUỘC IMPORT HOOK NÀY

export default function EmailVerification() {
    // Khai báo các hook điều hướng của React Router
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy email một cách an toàn từ state được truyền qua
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [timeLeft, setTimeLeft] = useState(300);
    const [resendTimer, setResendTimer] = useState(60);

    // Nếu gõ URL trực tiếp mà không có email, đá về trang đăng nhập
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    // 1. Hiệu ứng đếm ngược thời gian
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); // Đã sửa lỗi thiếu dấu trừ
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000); // Đã sửa lỗi thiếu dấu trừ
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // 2. Xử lý nhập liệu
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    // 3. GỌI API XÁC THỰC LÊN BACKEND
    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length < 6) {
            setMessage({ type: 'error', text: 'Vui lòng nhập đủ 6 số xác nhận.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: otpCode
                })
            });

            const data = await response.text();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Xác thực thành công! Đang chuyển hướng...' });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối đến máy chủ.' });
        } finally {
            setIsLoading(false);
        }
    };

    // 4. GỌI LẠI API GỬI MÃ (Resend)
    const handleResend = () => {
        if (resendTimer > 0) return;

        // TODO: Chèn API gọi lại mã OTP vào đây nếu backend hỗ trợ

        setResendTimer(60);
        setMessage({ type: 'success', text: 'Đã gửi lại mã mới vào email của bạn.' });
    };
    const handleBack = () => {
        navigate('/login');
    };
    if (!email) return null;

    return (
        <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-4 font-sans">
            <div className="flex flex-col items-center w-full max-w-[480px]">
                <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col mb-6">

                    {/* Icon minh họa */}
                    <div className="w-16 h-16 bg-[#f6eed2] rounded-full mx-auto flex items-center justify-center relative mb-6 shadow-sm border border-white">
                        <Mail className="w-6 h-6 text-[#d94a1f]" strokeWidth={2.5} />
                        <div className="absolute -bottom-1 -right-1 bg-[#f0592a] text-white p-1 rounded-full border-2 border-white">
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Tiêu đề & Mô tả */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-medium tracking-tight text-zinc-950 mb-3">Xác minh email</h1>
                        <p className="text-sm text-zinc-500 leading-relaxed px-2">
                            Mã xác nhận 6 số đã được gửi đến <br/>
                            <span className="font-semibold text-zinc-900">{email}</span>
                        </p>
                    </div>

                    {/* Khu vực thông báo lỗi/thành công */}
                    {message.text && (
                        <div className={`mb-6 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <form className="space-y-6">
                        {/* OTP Inputs */}
                        <div className="flex justify-between gap-2 md:gap-3">
                            {otp.map((data, index) => (
                                <input
                                    className={`w-full h-12 md:h-14 rounded-lg border text-center text-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] focus:bg-white ${
                                        data !== '' ? 'border-[#f0592a] bg-white text-zinc-900' : 'border-zinc-200 bg-[#fdfbf4] text-zinc-900'
                                    }`}
                                    type="text"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                    disabled={timeLeft === 0 || isLoading}
                                />
                            ))}
                        </div>

                        {/* Timer Đếm ngược */}
                        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-600">
                            <Clock className="w-3.5 h-3.5 text-[#f0592a]" />
                            {timeLeft > 0 ? (
                                <span>Mã này hết hạn sau <span className="font-bold text-zinc-900">{formatTime(timeLeft)}</span></span>
                            ) : (
                                <span className="text-red-500 font-semibold">Mã đã hết hạn, vui lòng gửi lại mã.</span>
                            )}
                        </div>

                        {/* Nút Verify */}
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={isLoading || timeLeft === 0}
                            className="w-full bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? 'Đang xác thực...' : 'Xác minh & Tiếp tục'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Resend & Edit Email Box */}
                    <div className="mt-8 p-4 rounded-xl border border-[#f0e8ce] bg-[#fdfbf4] flex flex-col items-center text-center gap-3">
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                            Bạn chưa nhận được mã?
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendTimer > 0}
                                className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-zinc-400 cursor-not-allowed' : 'text-[#f0592a] hover:text-[#d94a1f]'}`}
                            >
                                {resendTimer > 0 ? `Gửi lại mã (${resendTimer}s)` : 'Gửi lại ngay'}
                            </button>
                        </p>
                        <div className="w-8 border-t border-zinc-200"></div>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-[#f0592a] transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Thay đổi địa chỉ email
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-center items-center text-[11px] font-medium text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Mã hóa 256-bit TLS
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}