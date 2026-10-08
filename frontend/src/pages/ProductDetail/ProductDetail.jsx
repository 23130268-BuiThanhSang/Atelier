import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/ui/ProductCard'
// import { productApi } from '../../api/productApi'
import { MOCK_PRODUCTS } from '../Catalog/mockProducts'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ProductDetail() {
  const { id } = useParams()
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // ========================================================================
  // API THẬT - GIỮ LẠI ĐỂ MỞ SAU KHI BACKEND HOÀN THIỆN
  // ========================================================================
  /*
  const productQuery = useQuery({
      queryKey: ['product', id],
      queryFn: () => productApi.getById(id),
  })

  const product = productQuery.data
  */

  // ========================================================================
  // MOCK PREVIEW - CHỈ DÙNG ĐỂ XEM GIAO DIỆN
  // XÓA KHỐI MOCK NÀY KHI CHUYỂN SANG API THẬT.
  // ========================================================================
  const product = MOCK_PRODUCTS.find((item) => String(item.id) === String(id))
  const productQuery = {
    data: product,
    isLoading: false,
    isError: !product,
  }

  const selectedVariant = useMemo(() => {
    if (!product) return null

    return product.variants.find((variant) => {
      const matchesColor = selectedColor ? variant.color === selectedColor : true
      const matchesSize = selectedSize ? variant.size === selectedSize : true
      return matchesColor && matchesSize
    }) || null
  }, [product, selectedColor, selectedSize])

  const handleSelectColor = (color) => {
    setSelectedColor(color)

    if (product && selectedSize) {
      const exists = product.variants.some(
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
        <Container className="flex min-h-[60vh] items-center justify-center py-10">
          <Spinner />
        </Container>
    )
  }

  if (productQuery.isError || !product) {
    return (
        <Container className="py-16">
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <h1 className="text-2xl font-bold text-zinc-950">Không tìm thấy sản phẩm</h1>
            <p className="mt-2 text-zinc-600">Sản phẩm có thể đã bị xóa hoặc không còn hoạt động.</p>
            <Link to="/catalog" className="mt-6 inline-block">
              <Button>Xem danh sách sản phẩm</Button>
            </Link>
          </div>
        </Container>
    )
  }

  const availableSizes = product.sizes.filter((size) => {
    return product.variants.some(
        (variant) => variant.size === size && (!selectedColor || variant.color === selectedColor),
    )
  })

  const maxQuantity = selectedVariant?.stockQuantity || 0
  const currentPrice = selectedVariant?.price || product.price

  return (
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
                <img
                    src={product.imageUrls[selectedImage] || product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
              </div>
            </div>

            {product.imageUrls.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.imageUrls.map((image, index) => (
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
                  {product.colors.map((color) => (
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

        <section className="mt-14 border-t border-zinc-200 pt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f0592a]">Tiếp tục khám phá</p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-950">Thêm sản phẩm khác</h2>
            </div>
            <Link to="/catalog" className="text-sm font-semibold text-[#f0592a] hover:underline">
              Xem tất cả
            </Link>
          </div>

          <RelatedProducts categoryId={product.categoryId} currentId={product.id} />
        </section>
      </Container>
  )
}

function RelatedProducts({ categoryId, currentId }) {
  // ========================================================================
  // API THẬT - GIỮ LẠI ĐỂ MỞ SAU KHI BACKEND HOÀN THIỆN
  // ========================================================================
  /*
  const relatedQuery = useQuery({
      queryKey: ['related-products', categoryId],
      queryFn: () => productApi.getAll({ categoryId, sort: 'featured' }),
  })

  if (relatedQuery.isLoading) {
      return (
          <div className="mt-6 flex h-48 items-center justify-center">
              <Spinner />
          </div>
      )
  }

  const products = (relatedQuery.data || [])
      .filter((product) => product.id !== currentId)
      .slice(0, 4)
  */

  // ========================================================================
  // MOCK PREVIEW - CHỈ DÙNG ĐỂ XEM GIAO DIỆN
  // ========================================================================
  const products = MOCK_PRODUCTS
      .filter((product) => product.categoryId === categoryId && product.id !== currentId)
      .slice(0, 4)

  if (!products.length) return null

  return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
  )
}
