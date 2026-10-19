import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from "../../assets/logo.png";

const baseNavItems = [
    { to: '/', label: 'Trang chủ', end: true },
    { to: '/catalog', label: 'Sản phẩm' },
    { to: '/community-designs', label: 'Cộng đồng' },
    { to: '/my-orders', label: 'Đơn hàng' },
]

function navClass({ isActive }) {
    return [
        'relative rounded-lg px-3 py-2 text-sm font-medium transition-all',
        isActive
            ? 'bg-white/70 text-[#f0592a] shadow-sm'
            : 'text-zinc-700 hover:bg-white/60 hover:text-zinc-950',
    ].join(' ')
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <circle cx="11" cy="11" r="6.5" />
            <path strokeLinecap="round" d="m16 16 4 4" />
        </svg>
    )
}

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h2l1.2 10.1a2 2 0 0 0 2 1.9h6.9a2 2 0 0 0 2-1.7L19 8H7" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="17" cy="20" r="1" />
        </svg>
    )
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <circle cx="12" cy="8" r="3.2" />
            <path strokeLinecap="round" d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
    )
}

function SparkIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
            <path strokeLinecap="round" d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
        </svg>
    )
}

export default function Header({ cartCount = 0 }) {
    const [isOpen, setIsOpen] = useState(false)
    const [userName, setUserName] = useState('')
    const [userRole, setUserRole] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isSearchPinned, setIsSearchPinned] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const searchClusterRef = useRef(null)
    const searchInputRef = useRef(null)
    const navigate = useNavigate()

    // Đóng vùng tìm kiếm khi click ra ngoài cụm nút hoặc nhấn Escape.
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (searchClusterRef.current && !searchClusterRef.current.contains(event.target)) {
                setIsSearchOpen(false)
                setIsSearchPinned(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false)
                setIsSearchPinned(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const closeSearch = () => {
        setIsSearchOpen(false)
        setIsSearchPinned(false)
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        const keyword = searchTerm.trim()

        if (!keyword) {
            searchInputRef.current?.focus()
            return
        }

        navigate(`/catalog?search=${encodeURIComponent(keyword)}`)
        closeSearch()
    }

    const handleSearchButtonClick = () => {
        if (!isSearchOpen || !isSearchPinned) {
            setIsSearchOpen(true)
            setIsSearchPinned(true)
            searchInputRef.current?.focus()
            return
        }

        if (searchTerm.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`)
            closeSearch()
            return
        }

        searchInputRef.current?.focus()
    }

    // Tự động kiểm tra xem người dùng đã đăng nhập chưa khi load trang và kiểm tra vai trò người dùng
    useEffect(() => {
        const storedName = localStorage.getItem('userName')
        if (storedName) {
            setUserName(storedName)
        }

        // Lấy role từ localStorage (kiểm tra key userRole hoặc role, hoặc trong object user)
        let role = localStorage.getItem('userRole') || localStorage.getItem('role') || ''
        if (!role) {
            try {
                const storedUser = localStorage.getItem('user')
                if (storedUser) {
                    const parsed = JSON.parse(storedUser)
                    role = parsed.role || (parsed.roles && parsed.roles[0]) || ''
                }
            } catch (e) {
                console.error(e)
            }
        }
        setUserRole(role.toUpperCase())
    }, [])

    const closeMenu = () => setIsOpen(false)

    // Nếu role là PRODUCER thì chèn thêm mục "Bảng điều khiển" vào bên phải mục "Đơn hàng"
    const isProducer = userRole.includes('PRODUCER')
    const isDesigner = userRole.includes('DESIGNER')
    const dynamicItem = isProducer
        ? { to: '/producer_dashboard', label: 'Bảng điều khiển' }
        : { to: '/my-designs', label: 'Thiết kế của tôi' }

    const navItems = [...baseNavItems, dynamicItem]

    // Cấu hình linh hoạt: Đã đăng nhập thì hiện tên và link tới /profile, chưa thì hiện 'Đăng nhập' và link /login
    const accountLabel = userName || 'Đăng nhập'
    const accountLink = userName ? '/my_profile' : '/login'

    return (
        <header className="sticky top-0 z-40 border-b border-[#dfc67f] bg-[#fff1bf]/95 shadow-[0_8px_24px_rgba(146,93,24,0.10)] backdrop-blur">
            <div className="border-t-2 border-[#f0592a] bg-[#fff1bf] shadow-[inset_0_-1px_0_rgba(240,89,42,0.10)]">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="group flex shrink-0 items-center gap-3"
                        aria-label="Atelier - Trang chủ"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fefccf] to-[#f0592a] shadow-[0_4px_12px_rgba(240,89,42,0.15)] ring-1 ring-[#f0592a]/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                            <img
                                src={logo}
                                alt="Atelier Logo Icon"
                                className="h-7 w-7 object-contain"
                            />
                        </span>
                        <span className="hidden sm:block">
                            <span className="block text-xl font-black tracking-tight text-zinc-950">Atelier</span>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Custom Apparel Marketplace
                            </span>
                        </span>
                    </Link>

                    <nav className="ml-2 hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Điều hướng chính">
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div
                        ref={searchClusterRef}
                        onMouseLeave={() => {
                            if (!isSearchPinned) setIsSearchOpen(false)
                        }}
                        className="ml-auto hidden items-center gap-2 rounded-2xl bg-white/35 p-1.5 backdrop-blur-sm md:flex"
                    >
                        {/* Giữ nguyên cụm tìm kiếm mở rộng trong luồng flex; chỉ dùng nút kính lúp gốc ở bên phải. */}
                        <form
                            role="search"
                            onSubmit={handleSearchSubmit}
                            aria-hidden={!isSearchOpen}
                            className={[
                                'flex h-10 min-w-0 items-center overflow-hidden rounded-xl border bg-white/90 transition-all duration-300 ease-out',
                                isSearchOpen
                                    ? 'w-[260px] border-[#e8cf8b] px-1 opacity-100'
                                    : 'pointer-events-none w-0 border-transparent px-0 opacity-0',
                            ].join(' ')}
                        >
                            <button
                                type="button"
                                onClick={closeSearch}
                                tabIndex={isSearchOpen ? 0 : -1}
                                aria-label="Đóng tìm kiếm"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-[#fefccf] hover:text-[#f0592a]"
                            >
                                <CloseIcon />
                            </button>

                            <input
                                ref={searchInputRef}
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                onFocus={() => {
                                    setIsSearchOpen(true)
                                    setIsSearchPinned(true)
                                }}
                                tabIndex={isSearchOpen ? 0 : -1}
                                placeholder="Tìm sản phẩm..."
                                aria-label="Nhập từ khóa tìm sản phẩm"
                                className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                            />

                        </form>

                        <button
                            type="button"
                            aria-label="Tìm kiếm"
                            aria-expanded={isSearchOpen}
                            onMouseEnter={() => setIsSearchOpen(true)}
                            onClick={handleSearchButtonClick}
                            className="rounded-xl border border-[#e8cf8b] bg-white/80 p-2.5 text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a]"
                        >
                            <SearchIcon />
                        </button>

                        <Link
                            to="/design-studio"
                            onClick={closeSearch}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#f0592a] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(240,89,42,0.20)] transition-all hover:bg-[#d94a1f] hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            <SparkIcon />
                            Thiết kế ngay
                        </Link>

                        <Link
                            to="/cart"
                            aria-label="Giỏ hàng"
                            onClick={closeSearch}
                            className="relative rounded-xl border border-[#e8cf8b] bg-white/80 p-2.5 text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a]"
                        >
                            <CartIcon />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#f0592a] px-1 text-center text-[9px] font-bold leading-4 text-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            to={accountLink}
                            aria-label={accountLabel}
                            onClick={closeSearch}
                            className="group flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-zinc-700 transition-all hover:bg-white/70 hover:text-[#f0592a]"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition-all group-hover:border-[#f0592a]">
                                <UserIcon />
                            </span>
                            <span className="max-w-[92px] truncate text-[10px] font-semibold leading-3">
                                {accountLabel}
                            </span>
                        </Link>
                    </div>

                    <button
                        type="button"
                        aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen((value) => !value)}
                        className="ml-auto rounded-xl border border-[#e8cf8b] bg-white/70 p-2.5 text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a] md:hidden"
                    >
                        {isOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-[#e8cf8b] bg-[#fff7d6] md:hidden">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={closeMenu}
                                className={navClass}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-zinc-200 pt-3">
                            <Link
                                to="/cart"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 rounded-xl border border-[#e8cf8b] bg-white/70 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a]"
                            >
                                <CartIcon />
                                Giỏ hàng
                            </Link>
                            <Link
                                to={accountLink}
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#f0592a] px-4 py-2.5 text-center text-sm font-bold text-white transition-all hover:bg-[#d94a1f] active:scale-[0.98]"
                            >
                                <UserIcon />
                                {accountLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}