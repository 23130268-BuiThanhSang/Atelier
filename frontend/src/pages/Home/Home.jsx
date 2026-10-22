import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import CatalogProductCard from '../Catalog/CatalogProductCard'
import { productApi } from '../../api/productApi'

function ProductSection({ eyebrow, title, description, products, className = 'bg-[#fefccf]', sectionIndex = 0 }) {
  const showTopFade = sectionIndex > 0
  const showBottomFade = sectionIndex < 2

  return (
      <section className={`relative isolate overflow-hidden ${className}`}>
        {showTopFade && (
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-0 h-12 bg-gradient-to-b from-white/95 via-white/55 to-transparent sm:h-16"
            />
        )}
        {showBottomFade && (
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-12 bg-gradient-to-t from-white/95 via-white/55 to-transparent sm:h-16"
            />
        )}
        <Container className="relative z-10 py-14 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="atelier-fade-up">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0592a]">{eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
            </div>

            <Link
                to="/catalog"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f0592a] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#f0592a]/25 ring-1 ring-[#f0592a]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#d94a1f] hover:shadow-xl hover:shadow-[#f0592a]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f0592a]/30"
            >
              Xem tất cả
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="atelier-fade-up h-full"
                    style={{ animationDelay: `${sectionIndex * 70 + index * 85}ms` }}
                >
                  <CatalogProductCard product={product} variant="home" />
                </div>
            ))}
          </div>
        </Container>
      </section>
  )
}

function ProductSectionSkeleton() {
  return (
      <section className="bg-[#fefccf]">
        <Container className="py-14 lg:py-16">
          <div className="mb-8 space-y-3">
            <div className="h-3 w-24 animate-pulse rounded-full bg-zinc-200" />
            <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="overflow-hidden rounded-2xl border border-zinc-200 bg-[#fefccf] p-3 shadow-sm">
                  <div className="aspect-[4/4.6] animate-pulse rounded-xl bg-zinc-100" />
                  <div className="space-y-3 p-3">
                    <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
                    <div className="h-5 w-3/5 animate-pulse rounded bg-zinc-100" />
                    <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-100" />
                  </div>
                </div>
            ))}
          </div>
        </Container>
      </section>
  )
}

export default function Home() {
  const sectionsQuery = useQuery({
    queryKey: ['products', 'home-sections'],
    queryFn: productApi.getAll,
    staleTime: 60 * 1000,
  })

  const products = Array.isArray(sectionsQuery.data) ? sectionsQuery.data : []
  const sections = useMemo(() => ({
    bestSelling: [...products].sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0)).slice(0, 4),
    newest: [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
    mostViewed: [...products].sort((a, b) => Number(b.viewCount || 0) - Number(a.viewCount || 0)).slice(0, 4),
  }), [products])

  return (
      <div className="overflow-hidden bg-[#fefccf]">
        {/* HERO: nền sáng cùng hệ màu vàng kem, được phân tách với Header bằng đường viền dịu. */}
        <section className="relative isolate overflow-hidden border-b border-[#eadb9b] bg-gradient-to-br from-white via-[#fffdf0] to-[#fefccf] text-zinc-950">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-28 -top-36 h-[28rem] w-[28rem] rounded-full bg-[#f0592a]/15 blur-3xl motion-safe:animate-pulse" />
            <div className="absolute -bottom-44 left-[28%] h-96 w-96 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(120,80,20,0.08)_1px,transparent_0)] bg-[size:28px_28px] opacity-50" />
          </div>

          <Container className="relative py-12 sm:py-16 lg:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14">
              <div className="atelier-fade-up relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0592a]/30 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#c94a1f] shadow-sm shadow-[#f0592a]/10 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff9d75] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f0592a]" />
                </span>
                  THIẾT KẾ VÀ SẢN XUẤT TRANG PHỤC
                </div>

                <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  Từ ý tưởng đến
                  <span className="mt-1 block bg-gradient-to-r from-[#d94a1f] via-[#f0592a] to-[#b45309] bg-clip-text text-transparent">
                  sản phẩm thực tế.
                </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                  Tự do sáng tạo trang phục, xem trước ý tưởng và khám phá sản phẩm — tất cả bắt đầu từ Atelier.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/design-studio" className="group">
                    <Button size="lg" className="w-full rounded-xl px-6 py-3.5 shadow-lg shadow-[#f0592a]/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#f0592a]/30 sm:w-auto">
                      Bắt đầu thiết kế <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                  </Link>
                  <Link to="/catalog" className="group">
                    <Button variant="outline" size="lg" className="w-full rounded-xl border-[#e3d49b] bg-white px-6 py-3.5 font-bold text-zinc-950 shadow-md shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f0592a] hover:bg-[#fff7db] hover:text-zinc-950 hover:shadow-lg sm:w-auto">
                      Khám phá sản phẩm <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
                    </Button>
                  </Link>
                </div>

                <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-[#e6d9a2] pt-6">
                  <div>
                    <p className="text-xl font-black text-zinc-950 sm:text-2xl">01</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600 sm:text-sm">Tạo ý tưởng</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-950 sm:text-2xl">02</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600 sm:text-sm">Xem trước</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-950 sm:text-2xl">03</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600 sm:text-sm">Tìm sản phẩm</p>
                  </div>
                </div>
              </div>

              <div className="atelier-fade-up relative mx-auto w-full max-w-xl" style={{ animationDelay: '120ms' }}>
                <div aria-hidden="true" className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-[#f0592a] via-amber-300 to-[#f0592a]/20 opacity-70 blur-xl transition-opacity duration-500 hover:opacity-100" />
                <div className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-zinc-900 p-2 shadow-2xl shadow-black/40 transition-transform duration-500 hover:-rotate-1">
                  <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-800">
                    <img
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85"
                        alt="Áo thun tối giản làm nền cho những ý tưởng thiết kế riêng"
                        className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[440px] lg:h-[500px]"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/5 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb297]">ATELIER STUDIO</p>
                        <p className="mt-2 text-xl font-bold text-white sm:text-2xl">Ý tưởng mang dấu ấn riêng.</p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0592a] text-xl text-white shadow-lg shadow-[#f0592a]/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true">↗</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-3 top-8 hidden rounded-2xl border border-[#eadb9b] bg-white/95 px-4 py-3 shadow-xl backdrop-blur transition-transform duration-300 hover:-translate-y-1 sm:block lg:-left-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Ý tưởng của bạn</p>
                  <p className="mt-1 text-sm font-bold text-zinc-950">Dấu ấn riêng</p>
                </div>
                <div className="absolute -bottom-4 right-5 rounded-2xl border border-white/20 bg-white px-4 py-3 text-zinc-950 shadow-xl transition-transform duration-300 hover:translate-y-1 sm:right-8">
                  <p className="text-xs font-semibold text-zinc-500">Từ ý tưởng đến thành phẩm</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-extrabold"><span className="text-[#f0592a]">✦</span> Hiện thực hóa ý tưởng</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {sectionsQuery.isLoading && <ProductSectionSkeleton />}

        {sectionsQuery.isError && (
            <section className="bg-[#fefccf]">
              <Container className="py-14">
                <div role="alert" className="rounded-2xl border border-red-200 bg-[#fefccf] p-8 text-center shadow-sm">
                  <p className="text-lg font-bold text-zinc-950">Chưa thể tải sản phẩm nổi bật</p>
                  <p className="mt-2 text-sm text-zinc-600">Kiểm tra backend và kết nối Database, sau đó thử lại.</p>
                  <Button className="mt-5" onClick={() => sectionsQuery.refetch()} disabled={sectionsQuery.isFetching}>
                    {sectionsQuery.isFetching ? 'Đang tải...' : 'Thử tải lại'}
                  </Button>
                </div>
              </Container>
            </section>
        )}

        {sectionsQuery.isSuccess && products.length === 0 && (
            <section className="bg-[#fefccf]">
              <Container className="py-16 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0592a]">Sắp có mặt</p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-950">Danh mục sản phẩm đang được chuẩn bị</h2>
                <p className="mt-2 text-sm text-zinc-600">Hiện chưa có sản phẩm đang hoạt động để giới thiệu.</p>
              </Container>
            </section>
        )}

        {sectionsQuery.isSuccess && products.length > 0 && (
            <>
              <ProductSection
                  eyebrow="Bán chạy"
                  title="Sản phẩm được mua nhiều nhất"
                  description="Những lựa chọn được quan tâm qua số lượt bán ghi nhận."
                  products={sections.bestSelling}
                  sectionIndex={0}
              />
              <ProductSection
                  eyebrow="Mới lên kệ"
                  title="Khám phá sản phẩm mới"
                  description="Cập nhật những thiết kế mới được thêm vào Atelier."
                  products={sections.newest}
                  className="bg-[#fefccf]"
                  sectionIndex={1}
              />
              <ProductSection
                  eyebrow="Được quan tâm"
                  title="Nhiều lượt khám phá nhất"
                  description="Những sản phẩm đang thu hút sự chú ý từ cộng đồng."
                  products={sections.mostViewed}
                  sectionIndex={2}
              />
            </>
        )}

        <section className="relative overflow-hidden bg-[#fefccf]">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f0592a]/10 blur-3xl" />
          <Container className="relative py-14 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="atelier-fade-up">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0592a]">Custom Studio</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Tạo thiết kế của riêng mình</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-700">
                  Bắt đầu từ một sản phẩm, thêm artwork và các thành phần mong muốn, sau đó lưu thiết kế để tiếp tục ở những bước sau.
                </p>
                <Link to="/design-studio" className="mt-7 inline-block transition-transform duration-200 hover:-translate-y-0.5">
                  <Button size="lg">Mở Custom Studio <span aria-hidden="true">→</span></Button>
                </Link>
              </div>

              <div className="atelier-fade-up rounded-[2rem] bg-zinc-950 p-8 text-white shadow-xl shadow-zinc-900/15 sm:p-10" style={{ animationDelay: '120ms' }}>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff9d75]">Workflow</p>
                <p className="mt-4 text-2xl font-black leading-snug sm:text-3xl">CREATE <span className="text-[#f0592a]">→</span> VISUALIZE <span className="text-[#f0592a]">→</span> MATCH <span className="text-[#f0592a]">→</span> TRUST</p>
                <p className="mt-4 text-sm leading-6 text-zinc-300">Một hành trình liền mạch từ ý tưởng đến kết nối sản xuất.</p>
              </div>
            </div>
          </Container>
        </section>
      </div>
  )
}
