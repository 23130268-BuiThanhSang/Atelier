import React, { useState } from 'react';
import { ArrowRight, Lock, Check, ShieldCheck, MapPin, Phone, Palette, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyProfile() {
    const [role, setRole] = useState('designer');

    return (
        <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-zinc-100 flex flex-col my-6">

            {/* Tiêu đề */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-950 mb-3">
                    Hoàn tất hồ sơ của bạn
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed">
                    Chỉ vài thông tin nhỏ giúp tối ưu hóa trải nghiệm của bạn tại Atelier.
                </p>
            </div>

            <form className="space-y-8">
                {/* Mobile Number */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900 flex items-center gap-1" htmlFor="phone">
                        Số điện thoại <span className="text-[#f0592a]">*</span>
                    </label>
                    <div className="flex rounded-lg border border-zinc-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#f0592a]/20 focus-within:border-[#f0592a] transition-all bg-zinc-50 focus-within:bg-white">
                        <div className="flex items-center gap-2 bg-[#fdfbf4] px-4 border-r border-zinc-200 text-sm font-medium text-zinc-700">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>+84 (VN)</span>
                        </div>
                        <input
                            id="phone"
                            type="tel"
                            className="w-full px-4 py-3 focus:outline-none text-sm text-zinc-900 bg-transparent"
                        />
                    </div>
                    <p className="text-[11px] text-zinc-500 flex items-start gap-1.5 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#f0592a] shrink-0" />
                        Chỉ sử dụng để cập nhật tiến độ gia công và thông báo giao hàng.
                    </p>
                </div>

                {/* Address Fields */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-semibold text-zinc-900">Địa chỉ giao hàng</label>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">Không bắt buộc</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3 relative">
                            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white appearance-none cursor-pointer">
                                <option value="us">Việt Nam</option>
                                <option value="ca">Canada</option>
                                <option value="vn">Mỹ</option>
                                <option value="uk">Anh</option>
                            </select>
                        </div>

                        <input
                            type="text"
                            placeholder="Tỉnh/Thành phố"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Phường/Xã"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Tổ/Khu phố"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Action Area */}
                <div className="pt-4 flex flex-col gap-4">
                    <button
                        type="button"
                        className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group"
                    >
                        Hoàn tất và tham gia Atelier
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button type="button" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors py-2">
                        Tôi sẽ hoàn thiện địa chỉ giao hàng sau &rsaquo;
                    </button>
                </div>

            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center text-[11px] font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Mã hóa 256-bit TLS
                </div>
                <div className="flex gap-2">
                    <span>ID đã được xác minh</span>
                    <span>•</span>
                    <span>Tuân thủ GDPR</span>
                </div>
            </div>

        </div>
    );
}