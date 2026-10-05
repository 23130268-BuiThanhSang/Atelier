import React from 'react';
import { Mail, Lock, Eye, CheckCircle2 } from 'lucide-react';
export default function Login() {
    return (
        <div className="min-h-[100dvh] bg-[#fefccf] flex flex-col font-sans text-zinc-950">

            {/* Header */}
            <header className="flex justify-between items-center p-6 md:px-12 w-full">
                <div className="font-semibold tracking-tight text-lg flex items-center gap-4">
                    <span>ATELIER</span>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium items-center text-zinc-500">
                    <a href="#" className="hover:text-zinc-900 transition-colors">Back to Shop</a>
                    <a href="#" className="hover:text-zinc-900 transition-colors">Help & Support</a>
                    <span className="uppercase text-zinc-900">EN</span>
                    <div
                        className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-300 cursor-pointer transition-colors">
                        {/* Placeholder cho Avatar */}
                        <span className="text-xs font-bold">U</span>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6">
                <div
                    className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden">

                    {/* Left Branding Panel */}
                    <div className="bg-stone-100 p-8 md:p-14 flex flex-col justify-between hidden md:flex">
                        <div>
                            {/* dùng 1 Eyebrow duy nhất cho cả trang theo luật rationing */}
                            <div className="text-[11px] font-semibold tracking-widest uppercase mb-10 text-zinc-500">
                                Artisan Network
                            </div>
                            <div
                                className="w-24 h-24 bg-white rounded-full mb-10 shadow-sm border border-zinc-100"></div>
                            <div className="mb-6">
                                {/* link ảnh placeholder thực tế theo chuẩn SKILL.md */}
                                <img
                                    src="https://picsum.photos/seed/atelier-craft/600/400"
                                    alt="Artisan crafting apparel"
                                    className="rounded-xl w-full max-w-[280px] object-cover aspect-[4/3] shadow-sm"
                                />
                                <p className="text-xs text-zinc-500 mt-3 font-medium">
                                    Studio batch #084 - Organic twill
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-lg italic text-zinc-700 leading-relaxed max-w-sm mb-10">
                                "Crafting thoughtful apparel, connecting independent designers with verified garment
                                producers."
                            </p>
                            <div className="flex justify-between items-center text-xs font-medium text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-zinc-400"/>
                                    1,400+ Verified Guilds
                                </div>
                                <span className="tracking-widest uppercase">EST. 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center">
                        <h1 className="text-3xl font-medium tracking-tight mb-2 text-zinc-950">Welcome back</h1>
                        <p className="text-zinc-500 mb-10 text-sm">Enter your credentials to access your Atelier
                            account.</p>

                        <form className="space-y-6">
                            {/* Group Email */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-zinc-900" htmlFor="email">Email
                                        address</label>
                                    {/* Test error preview từ hình mẫu */}
                                    <span className="text-xs text-red-500 opacity-0 transition-opacity">Test error preview</span>
                                </div>
                                <div className="relative">
                                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input
                                        id="email"
                                        type="email"
                                        defaultValue="clara.vance@atelierdesign.co"
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-zinc-900 bg-zinc-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Group Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900 block"
                                       htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input
                                        id="password"
                                        type="password"
                                        defaultValue="artisan-craft-2024"
                                        className="w-full pl-11 pr-11 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-zinc-900 bg-zinc-50 focus:bg-white"
                                    />
                                    <button type="button"
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                                        <Eye className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot Password */}
                            <div className="flex items-center justify-between pt-2">
                                <label
                                    className="flex items-center gap-2.5 text-sm font-medium text-zinc-600 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 rounded border-zinc-300 text-[#f0592a] focus:ring-[#f0592a] accent-[#f0592a]"
                                    />
                                    <span className="group-hover:text-zinc-900 transition-colors">Remember me</span>
                                </label>
                                <a href="#"
                                   className="text-sm font-medium text-[#f0592a] hover:text-[#d94a1f] transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Primary CTA */}
                            <button
                                type="button"
                                className="w-full bg-[#f0592a] hover:bg-[#d94a1f] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm mt-2"
                            >
                                Log in
                            </button>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-100"></div>
                                </div>
                                <div
                                    className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
                                    <span className="bg-white px-4 text-zinc-400">OR</span>
                                </div>
                            </div>

                            {/* Social Login */}
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

                            <p className="text-center text-sm text-zinc-500 pt-2">
                                Don't have an account? <a href="#"
                                                          className="text-[#f0592a] font-medium hover:text-[#d94a1f] transition-colors">Sign
                                up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer
                className="p-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-400">
                <div>© 2024 Atelier Studio & Apparel Co. Artisan marketplace. All rights reserved.</div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-zinc-700 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-700 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-zinc-700 transition-colors">Security & Compliance</a>
                </div>
            </footer>
        </div>
    );
}
