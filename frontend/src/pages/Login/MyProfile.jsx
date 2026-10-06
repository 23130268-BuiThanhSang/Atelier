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
                    Complete your profile
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed">
                    Just a few tailored details to customize your Atelier artisan marketplace experience.
                </p>
            </div>

            <form className="space-y-8">

                {/*/!* Role Selector Box *!/*/}
                {/*<div className="space-y-3">*/}
                {/*    <label className="text-sm font-semibold text-zinc-900">Select Your Role in Atelier</label>*/}
                {/*    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
                {/*        <button*/}
                {/*            type="button"*/}
                {/*            onClick={() => setRole('designer')}*/}
                {/*            className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${*/}
                {/*                role === 'designer'*/}
                {/*                    ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'*/}
                {/*                    : 'border-zinc-200 hover:border-zinc-300 bg-white'*/}
                {/*            }`}*/}
                {/*        >*/}
                {/*            <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">*/}
                {/*                <Palette className={`w-3.5 h-3.5 ${role === 'designer' ? 'text-[#f0592a]' : 'text-zinc-400'}`} />*/}
                {/*            </div>*/}
                {/*            <h3 className={`font-semibold text-sm mb-1.5 ${role === 'designer' ? 'text-zinc-900' : 'text-zinc-700'}`}>*/}
                {/*                Customer / Designer*/}
                {/*            </h3>*/}
                {/*            <p className="text-xs text-zinc-500 leading-relaxed">Customize garments, purchase exclusive artisan drops, or hire makers.</p>*/}

                {/*            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center ${role === 'designer' ? 'border-transparent bg-[#f0592a]' : 'border-zinc-200'}`}>*/}
                {/*                {role === 'designer' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}*/}
                {/*            </div>*/}
                {/*        </button>*/}

                {/*        <button*/}
                {/*            type="button"*/}
                {/*            onClick={() => setRole('producer')}*/}
                {/*            className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${*/}
                {/*                role === 'producer'*/}
                {/*                    ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'*/}
                {/*                    : 'border-zinc-200 hover:border-zinc-300 bg-white'*/}
                {/*            }`}*/}
                {/*        >*/}
                {/*            <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">*/}
                {/*                <Factory className={`w-3.5 h-3.5 ${role === 'producer' ? 'text-[#f0592a]' : 'text-zinc-400'}`} />*/}
                {/*            </div>*/}
                {/*            <h3 className={`font-semibold text-sm mb-1.5 ${role === 'producer' ? 'text-zinc-900' : 'text-zinc-700'}`}>*/}
                {/*                Producer (Manufacturer)*/}
                {/*            </h3>*/}
                {/*            <p className="text-xs text-zinc-500 leading-relaxed">Operate print, weave, or cut & sew workshops to fulfill client batches.</p>*/}

                {/*            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center ${role === 'producer' ? 'border-transparent bg-[#f0592a]' : 'border-zinc-200'}`}>*/}
                {/*                {role === 'producer' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}*/}
                {/*            </div>*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Mobile Number */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900 flex items-center gap-1" htmlFor="phone">
                        Mobile Number <span className="text-[#f0592a]">*</span>
                    </label>
                    <div className="flex rounded-lg border border-zinc-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#f0592a]/20 focus-within:border-[#f0592a] transition-all bg-zinc-50 focus-within:bg-white">
                        <div className="flex items-center gap-2 bg-[#fdfbf4] px-4 border-r border-zinc-200 text-sm font-medium text-zinc-700">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>+1 (US/CA)</span>
                        </div>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="(415) 890-2412"
                            className="w-full px-4 py-3 focus:outline-none text-sm text-zinc-900 bg-transparent"
                        />
                    </div>
                    <p className="text-[11px] text-zinc-500 flex items-start gap-1.5 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#f0592a] shrink-0" />
                        Used strictly for artisan commission updates and parcel dispatch alerts.
                    </p>
                </div>

                {/* Address Fields */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-semibold text-zinc-900">Shipping & Studio Dispatch Address</label>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">Optional</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3 relative">
                            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Street address or P.O. Box (e.g. 742 Evergreen Terrace)"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white appearance-none cursor-pointer">
                                <option value="us">United States</option>
                                <option value="ca">Canada</option>
                                <option value="vn">Vietnam</option>
                                <option value="uk">United Kingdom</option>
                            </select>
                        </div>

                        <input
                            type="text"
                            placeholder="City"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                        <input
                            type="text"
                            placeholder="State / Region"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-zinc-50 focus:bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Postal Code"
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
                        Complete & Enter Marketplace
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button type="button" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors py-2">
                        I will complete my shipping address later &rsaquo;
                    </button>
                </div>

            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center text-[11px] font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    256-bit TLS encrypted
                </div>
                <div className="flex gap-2">
                    <span>Artisan Verified ID</span>
                    <span>•</span>
                    <span>GDPR Compliant</span>
                </div>
            </div>

        </div>
    );
}