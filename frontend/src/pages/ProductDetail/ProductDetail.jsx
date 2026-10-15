import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/ui/ProductCard'
import { productApi } from '../../api/productApi'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function DetailRating({ averageRating, reviewCount }) {
  const rating = Number(averageRating) || 0
  const count = Number(reviewCount) || 0
  const hasReviews = count > 0

  return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label={hasReviews ? `Đánh giá trung bình ${rating.toFixed(1)} trên 5` : 'Chưa có đánh giá'}>
        <div className="flex items-center gap-0.5 text-2xl leading-none" role="img" aria-label={hasReviews ? `${rating.toFixed(1)} trên 5 sao` : 'Chưa có đánh giá'}>
          {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} aria-hidden="true" className={hasReviews && star <= Math.round(rating) ? 'text-amber-500' : 'text-zinc-300'}>★</span>
          ))}
        </div>
        {hasReviews ? (
            <span className="text-sm text-zinc-600">
          <strong className="font-bold text-zinc-950">{rating.toFixed(1)}</strong>
          <span className="mx-1 text-zinc-300">·</span>
              {count.toLocaleString('vi-VN')} đánh giá
        </span>
        ) : (
            <span className="text-sm font-medium text-zinc-500">Chưa có đánh giá</span>
        )}
      </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })
  const product = productQuery.data

  useEffect(() => {
    setSelectedColor('')
    setSelectedSize('')
    setQuantity(1)
    setSelectedImage(0)
  }, [id])

  const selectedVariant = useMemo(() => {
    if (!product) return null

    return (product.variants || []).find((variant) => {
      const matchesColor = selectedColor ? variant.color === selectedColor : true
      const matchesSize = selectedSize ? variant.size === selectedSize : true
      return matchesColor && matchesSize
    }) || null
  }, [product, selectedColor, selectedSize])

  const handleSelectColor = (color) => {
    setSelectedColor(color)

    if (product && selectedSize) {
      const exists = (product.variants || []).some(
          (variant) => variant.color === color && variant.size === selectedSize,
      )

      if (!exists) {
        setSelectedSize('')
      }
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      window.alert('Vui lòng chọn màu sắc và kích thước.')
      return
    }

    console.log('Add to cart:', {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    })
  }

  if (productQuery.isLoading) {
    return (
        <div className="min-h-screen bg-[#fefccf]">
          <Container className="flex min-h-[60vh] items-center justify-center py-10">
            <Spinner />
          </Container>
        </div>
    )
  }

  if (productQuery.isError || !product) {
    return (
        <div className="min-h-screen bg-[#fefccf]">
          <Container className="py-16">
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <h1 className="text-2xl font-bold text-zinc-950">Không tìm thấy sản phẩm</h1>
              <p className="mt-2 text-zinc-600">Sản phẩm có thể đã bị xóa hoặc không còn hoạt động.</p>
              <Link to="/catalog" className="mt-6 inline-block">
                <Button>Xem danh sách sản phẩm</Button>
              </Link>
            </div>
          </Container>
        </div>
    )
  }

  const availableSizes = (product.sizes || []).filter((size) => {
    return (product.variants || []).some(
        (variant) => variant.size === size && (!selectedColor || variant.color === selectedColor),
    )
  })

  const maxQuantity = selectedVariant?.stockQuantity || 0
  const currentPrice = selectedVariant?.price || product.price
  const imageUrls = Array.isArray(product.imageUrls) && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl ? [product.imageUrl] : []
  const currentImage = imageUrls[selectedImage] || imageUrls[0]
  const reviewCount = Number(product.reviewCount) || 0

  return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-8 sm:py-10">
          <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#f0592a]">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/catalog" className="hover:text-[#f0592a]">Sản phẩm</Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12">
            <section>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                <div className="aspect-square overflow-hidden">
                  {currentImage ? (
                      <img
                          src={currentImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition-opacity duration-300"
                      />
                  ) : (
                      <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f6eed2] to-zinc-100 text-center text-sm text-zinc-500">
                        <span aria-hidden="true" className="text-4xl">◇</span>
                        <span>Chưa có hình ảnh sản phẩm</span>
                      </div>
                  )}
                </div>
              </div>

              {imageUrls.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {imageUrls.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            className={[
                              'overflow-hidden rounded-xl border bg-zinc-100 transition-all',
                              selectedImage === index
                                  ? 'border-[#f0592a] ring-2 ring-[#f0592a]/15'
                                  : 'border-zinc-200 hover:border-zinc-400',
                            ].join(' ')}
                        >
                          <img
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              className="aspect-square w-full object-cover"
                          />
                        </button>
                    ))}
                  </div>
              )}
            </section>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f0592a]">
                {product.categoryName}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3">
                <DetailRating averageRating={product.averageRating} reviewCount={reviewCount} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-bold text-[#f0592a]">
                  {formatPrice(currentPrice)}
                </p>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            {product.soldCount} đã bán
                        </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            {product.viewCount} lượt xem
                        </span>
              </div>

              <p className="mt-6 leading-7 text-zinc-600">
                {product.description}
              </p>

              <div className="mt-8 space-y-6 border-y border-zinc-200 py-6">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold text-zinc-900">Màu sắc</h2>
                    <span className="text-xs text-zinc-500">{selectedColor || 'Chưa chọn'}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(product.colors || []).map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleSelectColor(color)}
                            className={[
                              'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                              selectedColor === color
                                  ? 'border-[#f0592a] bg-[#fff1ea] text-[#c94a1f]'
                                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-[#f0592a] hover:text-[#f0592a]',
                            ].join(' ')}
                        >
                          {color}
                        </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold text-zinc-900">Kích thước</h2>
                    <span className="text-xs text-zinc-500">{selectedSize || 'Chưa chọn'}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={[
                              'flex h-10 min-w-12 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-all',
                              selectedSize === size
                                  ? 'border-[#f0592a] bg-[#f0592a] text-white'
                                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-[#f0592a] hover:text-[#f0592a]',
                            ].join(' ')}
                        >
                          {size}
                        </button>
                    ))}
                  </div>
                </div>

                {selectedVariant && (
                    <div className="rounded-xl bg-[#faf7ee] p-4 text-sm">
                      <p className="font-semibold text-zinc-950">SKU: {selectedVariant.sku}</p>
                      <p className="mt-1 text-zinc-600">
                        {selectedVariant.stockQuantity > 0
                            ? `Còn ${selectedVariant.stockQuantity} sản phẩm`
                            : 'Hết hàng'}
                      </p>
                    </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                  <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      className="px-4 py-3 text-zinc-600 hover:text-zinc-950"
                      aria-label="Giảm số lượng"
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-zinc-950">
                                {quantity}
                            </span>
                  <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(Math.max(1, maxQuantity), value + 1))}
                      className="px-4 py-3 text-zinc-600 hover:text-zinc-950"
                      aria-label="Tăng số lượng"
                      disabled={!selectedVariant || maxQuantity <= 0}
                  >
                    +
                  </button>
                </div>

                <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || maxQuantity <= 0}
                >
                  Thêm vào giỏ
                </Button>
              </div>

              <div className="mt-6 rounded-2xl border border-[#e6d68e] bg-[#fefccf] p-5">
                <p className="text-sm font-bold text-zinc-950">Dữ liệu sản phẩm đã sẵn sàng cho các bước sau</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Sản phẩm này có cấu trúc variant, hình ảnh, tồn kho và thông tin cơ bản để sau này nối với
                  cart, order và Design Studio.
                </p>
              </div>
            </section>
          </div>

          <section id="product-reviews" className="mt-14 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0592a]">Phản hồi khách hàng</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">Đánh giá sản phẩm</h2>
                <div className="mt-5 rounded-2xl bg-[#faf7ee] p-5">
                  {reviewCount > 0 ? (
                      <>
                        <p className="text-4xl font-black tracking-tight text-zinc-950">{(Number(product.averageRating) || 0).toFixed(1)}<span className="ml-1 text-base font-semibold text-zinc-500">/ 5</span></p>
                        <div className="mt-3"><DetailRating averageRating={product.averageRating} reviewCount={reviewCount} /></div>
                        <p className="mt-3 text-sm text-zinc-600">Tổng hợp từ {reviewCount.toLocaleString('vi-VN')} đánh giá được hiển thị.</p>
                        <p className="mt-2 text-xs leading-5 text-zinc-500">Danh sách nội dung nhận xét chi tiết chưa được tải trong phiên bản này.</p>
                      </>
                  ) : (
                      <>
                        <p className="text-2xl font-black text-zinc-950">Chưa có đánh giá</p>
                        <div className="mt-3"><DetailRating averageRating={0} reviewCount={0} /></div>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">Sản phẩm chưa có đánh giá nào được hiển thị. Hãy là người đầu tiên chia sẻ trải nghiệm khi chức năng đánh giá được mở.</p>
                      </>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">Chia sẻ đánh giá của bạn</h3>
                    <p className="mt-1 text-sm text-zinc-600">Giao diện xem trước — chưa gửi hoặc lưu dữ liệu.</p>
                  </div>
                  <span className="rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-bold text-[#c94a1f]">Sắp ra mắt</span>
                </div>

                <fieldset disabled className="mt-5 space-y-4 disabled:opacity-70">
                  <div>
                    <label htmlFor="review-rating" className="mb-2 block text-sm font-semibold text-zinc-800">Mức đánh giá</label>
                    <select id="review-rating" defaultValue="5" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600">
                      <option value="5">★★★★★ — Rất hài lòng</option>
                      <option value="4">★★★★☆ — Hài lòng</option>
                      <option value="3">★★★☆☆ — Bình thường</option>
                      <option value="2">★★☆☆☆ — Chưa hài lòng</option>
                      <option value="1">★☆☆☆☆ — Không hài lòng</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-zinc-800">Nội dung đánh giá</label>
                    <textarea id="review-comment" rows={4} placeholder="Chất liệu, kích thước và trải nghiệm sử dụng..." className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 placeholder:text-zinc-400" />
                  </div>
                  <Button disabled className="w-full sm:w-auto">Gửi đánh giá (sắp ra mắt)</Button>
                </fieldset>
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-zinc-200 pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f0592a]">Tiếp tục khám phá</p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-950">Khám phá sản phẩm khác</h2>
                <p className="mt-1 text-sm text-zinc-600">Những sản phẩm được khách hàng lựa chọn nhiều nhất.</p>
              </div>
              <Link to="/catalog" className="text-sm font-semibold text-[#f0592a] hover:underline">
                Xem tất cả
              </Link>
            </div>

            <BestSellingProducts currentId={product.id} />
          </section>
        </Container>
      </div>
  )
}

function BestSellingProducts({ currentId }) {
  const relatedQuery = useQuery({
    queryKey: ['products', 'best-selling'],
    queryFn: productApi.getAll,
    staleTime: 60 * 1000,
  })

  if (relatedQuery.isLoading) {
    return (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
          {[1, 2, 3, 4].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="aspect-square animate-pulse rounded-xl bg-zinc-100" />
                <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
                <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-zinc-100" />
              </div>
          ))}
        </div>
    )
  }

  if (relatedQuery.isError) {
    return <p role="status" className="mt-5 text-sm text-zinc-500">Chưa thể tải danh sách sản phẩm bán chạy.</p>
  }

  const products = (Array.isArray(relatedQuery.data) ? relatedQuery.data : [])
      .filter((item) => String(item.id) !== String(currentId))
      .sort((a, b) => (Number(b.soldCount) || 0) - (Number(a.soldCount) || 0))
      .slice(0, 4)

  if (!products.length) {
    return <p className="mt-5 text-sm text-zinc-500">Chưa có dữ liệu sản phẩm bán chạy.</p>
  }

  return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
  )
}
