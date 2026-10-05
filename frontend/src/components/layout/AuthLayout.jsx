import { Outlet } from 'react-router-dom';
import { Globe, User } from 'lucide-react';
import React from "react";

export default function AuthLayout() {
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

            {/*Form (Login/Register/...) */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 pb-12">
                <Outlet />
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