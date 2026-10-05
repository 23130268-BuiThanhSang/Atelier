import React, { useState } from 'react';
import { Mail, Lock, Eye, User, Check, Globe, ShieldCheck, Factory, PenTool } from 'lucide-react';
export default function Register() {
    const [role, setRole] = useState('designer'); // 'designer' or 'producer'
    return (
    /* Main Content */
    <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Left Panel */}
        <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#f8f6df] to-[#f0ead0] p-8 md:p-12 border-r border-zinc-200/50 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="font-bold text-zinc-900 text-xs">AT</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-zinc-900 tracking-tight">ATELIER</h2>
                        <p className="text-[10px] uppercase tracking-widest text-[#d94a1f] font-semibold">Studio & Apparel</p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-zinc-200/50 text-xs font-semibold tracking-wide text-zinc-800 mb-6 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-[#d94a1f]" />
                    JOIN THE GUILD
                </div>

                <h1 className="text-3xl font-medium tracking-tight leading-[1.15] mb-4 text-zinc-900">
                    Where craft meets conscious production.
                </h1>
                <p className="text-sm text-zinc-600 leading-relaxed mb-10">
                    Step into a collaborative network bridging visionary independent designers with verified garment artisans and ethical workshops.
                </p>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-[#f0e8ce] flex items-center justify-center flex-shrink-0">
                            <PenTool className="w-4 h-4 text-zinc-700" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Empowering independent creators</h3>
                            <p className="text-xs text-zinc-600 leading-relaxed">Design, launch pre-orders, and manage full bespoke collections with zero deadstock risk.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-[#f0e8ce] flex items-center justify-center flex-shrink-0">
                            <Factory className="w-4 h-4 text-zinc-700" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Vetted sustainable producers</h3>
                            <p className="text-xs text-zinc-600 leading-relaxed">Certified mills, organic cottons, low-impact dyes, and direct line-item batch costing.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-[#f0e8ce] flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-4 h-4 text-zinc-700" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-1">Secure escrow deposits</h3>
                            <p className="text-xs text-zinc-600 leading-relaxed">Production funds are protected in smart milestone escrow until physical inspection is approved.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div>
                    <p className="text-xs text-zinc-500 font-medium">Verified Partners</p>
                    <p className="text-xl font-semibold text-zinc-900">1,400+</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-500 font-medium">Platform</p>
                    <p className="text-sm font-semibold text-zinc-900">Free artisan tier</p>
                </div>
            </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center p-8 md:p-14 lg:p-20 bg-white">
            <div className="max-w-[480px] w-full mx-auto">

                <div className="mb-10">
                    <h2 className="text-3xl font-medium tracking-tight mb-2 text-zinc-950">Create your account</h2>
                    <p className="text-zinc-500 text-sm">Join our collaborative custom apparel marketplace.</p>
                </div>

                <form className="space-y-6">

                    {/* Role Selection Toggle */}
                    <div className="space-y-3 mb-8">
                        <label className="text-sm font-medium text-zinc-900 block">Select your primary workspace role</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('designer')}
                                className={`text-left p-4 rounded-xl border transition-all ${
                                    role === 'designer'
                                        ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'
                                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-medium text-sm ${role === 'designer' ? 'text-[#f0592a]' : 'text-zinc-900'}`}>I want to shop & design</span>
                                    {role === 'designer' && <Check className="w-4 h-4 text-[#f0592a]" />}
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">Design custom tees and order bespoke batches.</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole('producer')}
                                className={`text-left p-4 rounded-xl border transition-all ${
                                    role === 'producer'
                                        ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20'
                                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-medium text-sm ${role === 'producer' ? 'text-[#f0592a]' : 'text-zinc-900'}`}>I'm a Producer</span>
                                    {role === 'producer' && <Check className="w-4 h-4 text-[#f0592a]" />}
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">Fulfill orders and expand your workshop.</p>
                            </button>
                        </div>
                    </div>

                    {/* Full Name & Email Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900" htmlFor="fullName">Full Name</label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Elias Thorne"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900" htmlFor="email">Email address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="elias@studio.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 flex justify-between" htmlFor="password">
                            <span>Password</span>
                            <span className="text-[#f0592a] text-xs font-bold tracking-wide">STRONG</span>
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                id="password"
                                type="password"
                                placeholder="AtelierCraft2024!"
                                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900"
                            />
                            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        <div className="flex gap-1.5 pt-1">
                            <div className="h-1 w-full bg-[#f0592a] rounded-full"></div>
                            <div className="h-1 w-full bg-[#f0592a] rounded-full"></div>
                            <div className="h-1 w-full bg-[#f0592a] rounded-full"></div>
                            <div className="h-1 w-full bg-[#f0592a] rounded-full"></div>
                        </div>
                        <p className="text-[11px] text-zinc-500">Include 8+ characters, one number, and a special artisan symbol.</p>
                    </div>

                    {/* Checkbox Terms */}
                    <div className="pt-2">
                        <label className="flex items-start gap-3 text-sm text-zinc-600 cursor-pointer group">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-[#f0592a] focus:ring-[#f0592a] accent-[#f0592a]"
                            />
                            <span className="leading-relaxed">
                      I agree to the <a href="#" className="text-[#f0592a] font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-[#f0592a] font-medium hover:underline">Privacy Policy</a> (which cover deposit escrow and dispute rules).
                    </span>
                        </label>
                    </div>

                    {/* Primary CTA */}
                    <button
                        type="button"
                        className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm mt-4"
                    >
                        Create account
                    </button>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
                            <span className="bg-white px-4 text-zinc-400">OR</span>
                        </div>
                    </div>

                    {/* Google Signup */}
                    <button
                        type="button"
                        className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"/>
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"/>
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"/>
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-zinc-500 pt-2">
                        Already have an account? <a href="/login" className="text-[#f0592a] font-bold hover:text-[#d94a1f] transition-colors">Log in</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
    );
}
