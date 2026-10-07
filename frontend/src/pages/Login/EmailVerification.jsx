import React, { useState } from 'react';
import { Check, Mail, Clock, ArrowRight, Edit2, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmailVerification() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[480px]">

            {/* Main Card */}
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
                    <h1 className="text-2xl font-medium tracking-tight text-zinc-950 mb-3">
                        Xác minh email của bạn
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed px-2">
                        Chúng tôi đã gửi mã xác nhận gồm 6 chữ số đến địa chỉ <span className="font-semibold text-zinc-900">elias@studio.com</span>. Vui lòng nhập mã này bên dưới để xác nhận tài khoản của bạn.
                    </p>
                </div>

                {/* Form nhập liệu */}
                <form className="space-y-6">

                    {/* OTP Inputs */}
                    <div className="flex justify-between gap-2 md:gap-3">
                        {otp.map((data, index) => (
                            <input
                                className={`w-full h-12 md:h-14 rounded-lg border text-center text-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] focus:bg-white ${
                                    data !== ''
                                        ? 'border-[#f0592a] bg-white text-zinc-900'
                                        : 'border-zinc-200 bg-[#fdfbf4] text-zinc-900'
                                }`}
                                type="text"
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-600">
                        <Clock className="w-3.5 h-3.5 text-[#f0592a]" />
                        <span>Mã này hết hạn sau <span className="font-bold text-zinc-900">04:59</span></span>
                    </div>

                    {/* Nút Verify */}
                    <button
                        type="button"
                        className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group"
                    >
                        Xác minh & Tiếp tục
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                </form>

                {/* Resend & Edit Email Box */}
                <div className="mt-8 p-4 rounded-xl border border-[#f0e8ce] bg-[#fdfbf4] flex flex-col items-center text-center gap-3">
                    <p className="text-xs text-zinc-600">
                        Bạn chưa nhận được mã? <button className="text-zinc-400 font-medium cursor-not-allowed">Gửi lại mã (54s)</button>
                    </p>
                    <div className="w-8 border-t border-zinc-200"></div>
                    <Link to="/register" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-[#f0592a] transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                        Thay đổi địa chỉ email
                    </Link>
                </div>

                {/* Footer nhỏ của riêng Card */}
                <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-center items-center text-[11px] font-medium text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Mã hóa 256-bit TLS
                    </div>
                </div>

            </div>

        </div>
    );
}