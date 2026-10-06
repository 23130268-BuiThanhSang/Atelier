import { Link } from 'react-router-dom'

const columns = [
    {
        title: 'Khám phá',
        links: [
            { to: '/', label: 'Trang chủ' },
            { to: '/catalog', label: 'Sản phẩm' },
            { to: '/design-studio', label: 'Design Studio' },
            { to: '/my-designs', label: 'Thiết kế của tôi' },
        ],
    },
    {
        title: 'Mua sắm & trải nghiệm',
        links: [
            { to: '/catalog', label: 'Tìm kiếm sản phẩm' },
            { to: '/cart', label: 'Giỏ hàng' },
            { to: '/checkout', label: 'Thanh toán' },
            { to: '/my-orders', label: 'Đơn hàng của tôi' },
        ],
    },
    {
        title: 'Tài khoản',
        links: [
            { to: '/login', label: 'Đăng nhập' },
            { to: '/register', label: 'Tạo tài khoản' },
            { to: '/my-orders', label: 'Lịch sử đơn hàng' },
        ],
    },
]

const journey = ['CREATE', 'VISUALIZE', 'SPECIFY', 'MATCH', 'TRUST']

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#e8cf8b] bg-[#f3d77f] text-zinc-950">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <section className="border-b border-[#dfc67f] py-10 lg:py-12">
                    <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-end">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0592a] text-lg font-black text-white">
                                    A
                                </span>
                                <div>
                                    <div className="text-2xl font-black tracking-tight">Atelier</div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                                        Custom Apparel Marketplace
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-700">
                                Atelier là nền tảng kết nối Consumer và Producer, rút ngắn khoảng cách giữa một ý tưởng
                                thời trang và một sản phẩm có thể sản xuất.
                            </p>

                            <div className="mt-5 inline-flex max-w-2xl rounded-2xl border border-[#dfc67f] bg-[#fff3c4] px-4 py-3 text-sm font-medium leading-6 text-zinc-900 shadow-sm">
                                “Rút ngắn khoảng cách giữa một ý tưởng thời trang và một sản phẩm có thể sản xuất.”
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#dfc67f] bg-[#fff3c4] p-5 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c94a1f]">
                                Hành trình Atelier
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {journey.map((step) => (
                                    <span
                                        key={step}
                                        className="rounded-full border border-[#d9bb69] bg-white/50 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-zinc-800"
                                    >
                                        {step}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-xs leading-6 text-zinc-700">
                                Từ tạo thiết kế và xem trước 2D/3D đến đặc tả sản xuất, matching với Producer và xây dựng
                                niềm tin trong giao dịch.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-8 border-b border-[#dfc67f] py-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h2 className="text-sm font-bold text-zinc-950">Giá trị cốt lõi</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
                            <li>Trao quyền sáng tạo cho người dùng.</li>
                            <li>Xem trước trực quan bằng 2D và 3D.</li>
                            <li>Kết nối người dùng với nhiều Producer.</li>
                            <li>Hướng tới một marketplace minh bạch và đáng tin cậy.</li>
                        </ul>
                    </div>

                    {columns.map((column) => (
                        <div key={column.title}>
                            <h2 className="text-sm font-bold text-zinc-950">{column.title}</h2>
                            <ul className="mt-4 space-y-3">
                                {column.links.map((link) => (
                                    <li key={`${column.title}-${link.label}`}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-zinc-700 transition-colors hover:text-[#c94a1f]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                <section className="grid gap-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                        <p className="text-sm font-bold text-zinc-950">Kết nối cùng Atelier</p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-700">
                            Theo dõi các hoạt động, thiết kế cộng đồng và nội dung giới thiệu trải nghiệm Designer trên
                            Facebook, Instagram và TikTok.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {['Facebook', 'Instagram', 'TikTok'].map((network) => (
                                <span
                                    key={network}
                                    className="rounded-full border border-[#d9bb69] bg-white/50 px-3 py-1.5 text-xs font-semibold text-zinc-800"
                                >
                                    {network}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#dfc67f] bg-[#fff3c4] p-5 shadow-sm">
                        <p className="text-sm font-bold text-zinc-950">Tầm nhìn trải nghiệm</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-700">
                            Không chỉ mua một chiếc áo, mà đi từ ý tưởng → thiết kế → hình dung sản phẩm → nhu cầu sản
                            xuất → Producer → sản phẩm thực tế.
                        </p>
                    </div>
                </section>
            </div>

            <div className="border-t border-[#dfc67f] bg-[#e9c76d]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-zinc-700 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <span>© {new Date().getFullYear()} Atelier. Nền tảng thiết kế và production marketplace.</span>
                    <span>Designed around CREATE · VISUALIZE · SPECIFY · MATCH · TRUST.</span>
                </div>
            </div>
        </footer>
    )
}
