import { Link } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/ui/ProductCard'
import Spinner from '../../components/ui/Spinner'
// import { productApi } from '../../api/productApi'
import { MOCK_PRODUCTS } from '../Catalog/mockProducts'

const values = [
  {
    number: '01',
    title: 'CREATE',
    description:
        'Trao quyền cho người dùng biến ý tưởng riêng thành thiết kế trang phục.',
  },
  {
    number: '02',
    title: 'VISUALIZE',
    description:
        'Hình dung sản phẩm trực quan trước khi quyết định mua hoặc sản xuất.',
  },
  {
    number: '03',
    title: 'MATCH',
    description:
        'Kết nối nhu cầu sản xuất với Producer phù hợp trên marketplace.',
  },
  {
    number: '04',
    title: 'TRUST',
    description:
        'Hướng tới một trải nghiệm minh bạch hơn giữa Consumer và Producer.',
  },
]

function ProductSection({
                          eyebrow,
                          title,
                          description,
                          products,
                          viewAllLabel = 'Xem tất cả',
                          className = 'bg-white',
                        }) {
  return (
      <section className={className}>
        <Container className="py-14 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0592a]">{eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                {title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                {description}
              </p>
            </div>

            <Link to="/catalog" className="shrink-0">
              <Button variant="outline">{viewAllLabel}</Button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
  )
}

export default function Home() {
  // ========================================================================
  // API THẬT - GIỮ LẠI ĐỂ MỞ SAU KHI BACKEND HOÀN THIỆN
  // ========================================================================
  /*
  const sectionsQuery = useQuery({
      queryKey: ['home-product-sections'],
      queryFn: () => productApi.getHomeSections(4),
      staleTime: 60 * 1000,
  })
  */

  // ========================================================================
  // MOCK PREVIEW - CHỈ DÙNG ĐỂ XEM GIAO DIỆN
  // XÓA KHỐI MOCK NÀY KHI CHUYỂN SANG API THẬT.
  // ========================================================================
  const sections = {
    bestSelling: [...MOCK_PRODUCTS].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
    newest: [...MOCK_PRODUCTS]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    mostViewed: [...MOCK_PRODUCTS].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4),
  }

  const sectionsQuery = {
    data: sections,
    isLoading: false,
    isError: false,
    isSuccess: true,
  }

  return (
      <div className="bg-white">
        <section className="border-b border-[#eadb9b] bg-[#fef3bd]">
          <Container className="py-12 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-[#e1c957] bg-[#fff8d7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
                  Custom Apparel Production Marketplace
                </div>

                <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  Từ ý tưởng đến sản phẩm thực tế.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
                  Atelier giúp người dùng thiết kế trang phục, xem trước sản phẩm và khám phá các lựa chọn
                  mua hàng hoặc sản xuất theo nhu cầu.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/design-studio">
                    <Button size="lg">Bắt đầu thiết kế</Button>
                  </Link>
                  <Link to="/catalog">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#e0ca74] bg-white shadow-lg">
                <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85"
                    alt="Atelier apparel"
                    className="h-[380px] w-full object-cover sm:h-[480px]"
                />
              </div>
            </div>
          </Container>
        </section>



        {sectionsQuery.isLoading && (
            <section className="bg-[#faf7ee]">
              <Container className="flex min-h-72 items-center justify-center py-16">
                <Spinner />
              </Container>
            </section>
        )}

        {sectionsQuery.isError && (
            <section className="bg-[#faf7ee]">
              <Container className="py-14">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                  Không thể tải các sản phẩm nổi bật trên trang chủ.
                </div>
              </Container>
            </section>
        )}

        {sectionsQuery.isSuccess && (
            <>
              <ProductSection
                  eyebrow="Bán chạy"
                  title="Sản phẩm được mua nhiều nhất"
                  description="Được sắp xếp từ số lượt bán thành công của sản phẩm."
                  products={sections.bestSelling}
              />

              <ProductSection
                  eyebrow="Mới nhất"
                  title="Sản phẩm mới nhất"
                  description="Được sắp xếp theo ngày lên kệ của Sản phẩm"
                  products={sections.newest}
                  className="bg-[#fef3bd]"
              />

              <ProductSection
                  eyebrow="Được quan tâm"
                  title="Sản phẩm được xem nhiều nhất"
                  description="Được sắp xếp từ số lượt khám phá chi tiết sản phẩm"
                  products={sections.mostViewed}
              />
            </>
        )}

        <section className="bg-[#fefccf]">
          <Container className="py-14 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0592a]">Custom Studio</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
                  Tạo thiết kế của riêng mình
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-700">
                  Bắt đầu từ một sản phẩm, thêm artwork và các thành phần mong muốn, sau đó lưu thiết kế để
                  tiếp tục ở những bước sau.
                </p>
                <Link to="/design-studio" className="mt-7 inline-block">
                  <Button size="lg">Mở Custom Studio</Button>
                </Link>
              </div>

              <div className="rounded-[2rem] bg-zinc-900 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff9d75]">Workflow</p>
                <p className="mt-4 text-2xl font-bold">CREATE → VISUALIZE → SPECIFY → MATCH → TRUST</p>
                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  Hành trình này mang đến trải nghiệm chân thật nhất.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
  )
}
