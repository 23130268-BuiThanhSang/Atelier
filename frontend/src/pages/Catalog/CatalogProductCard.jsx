import { Link } from 'react-router-dom'

function formatPrice(value) {
    const price = Number(value)

    if (!Number.isFinite(price)) return 'Đang cập nhật'

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price)
}

/**
 * Thẻ sản phẩm dùng lại cho Catalog và Home.
 * `variant="home"` dùng nhấn mạnh nhẹ cho các nhóm sản phẩm đề xuất;
 * không cần chỉnh component ProductCard dùng chung của toàn ứng dụng.
 */
function ProductRating({ averageRating, reviewCount }) {
    const rating = Number(averageRating) || 0
    const count = Number(reviewCount) || 0
    const hasReviews = count > 0

    return (
        <div className="mt-1 flex min-h-7 flex-wrap items-center gap-x-2 gap-y-1">
            <div
                className="flex shrink-0 items-center gap-0.5 text-xl leading-none tracking-tight sm:text-2xl"
                role="img"
                aria-label={hasReviews ? `Đánh giá ${rating.toFixed(1)} trên 5` : 'Chưa có đánh giá'}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        aria-hidden="true"
                        className={hasReviews && star <= Math.round(rating)
                            ? 'text-amber-500 drop-shadow-[0_1px_1px_rgba(245,158,11,0.18)]'
                            : 'text-zinc-300'}
                    >
                        ★
                    </span>
                ))}
            </div>

            {hasReviews ? (
                <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                    <strong className="font-bold text-zinc-900">{rating.toFixed(1)}</strong>
                    <span className="mx-1 text-zinc-300">·</span>
                    {count.toLocaleString('vi-VN')} đánh giá
                </span>
            ) : (
                <span className="text-xs font-medium text-zinc-500">Chưa có đánh giá</span>
            )}
        </div>
    )
}

export default function CatalogProductCard({
                                               product,
                                               variant = 'catalog',
                                               showCategory = true,
                                               showFooterMetrics = true,
                                               className = '',
                                           }) {
    if (!product) return null

    const isHome = variant === 'home'
    const price = product.price ?? product.basePrice
    const imageUrl = product.imageUrl || product.images?.[0] || product.imageUrls?.[0]

    return (
        <article className={`group h-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f0592a]/45 hover:shadow-xl hover:shadow-[#f0592a]/10 active:scale-[0.99] ${isHome ? 'hover:shadow-[#f0592a]/15' : ''} ${className}`}>
            <Link
                to={`/products/${product.id}`}
                className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#f0592a]/25"
            >
                <div className={`relative overflow-hidden bg-[#f6eed2] ${isHome ? 'aspect-[4/4.6]' : 'aspect-[4/5]'}`}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name || 'Sản phẩm Atelier'}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f6eed2] to-zinc-100 px-4 text-center text-sm text-zinc-500">
                            <span className="text-3xl" aria-hidden="true">◇</span>
                            <span>Chưa có hình ảnh</span>
                        </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/25 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                    {showCategory && product.categoryName && (
                        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-zinc-800 shadow-sm backdrop-blur transition-colors group-hover:bg-white">
                            {product.categoryName}
                        </span>
                    )}
                    {isHome && (
                        <span className="absolute bottom-3 right-3 translate-y-1 rounded-full bg-zinc-950/75 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            Khám phá sản phẩm <span aria-hidden="true">↗</span>
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h2 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-zinc-950 transition-colors duration-200 group-hover:text-[#f0592a] sm:text-base">
                        {product.name}
                    </h2>

                    {/* Rating intentionally sits directly under the product title. */}
                    <ProductRating
                        averageRating={product.averageRating}
                        reviewCount={product.reviewCount}
                    />

                    <div className="mt-auto border-t border-zinc-100 pt-3 sm:pt-4">
                        <p className="text-lg font-extrabold tracking-tight text-[#f0592a] sm:text-xl">
                            {formatPrice(price)}
                        </p>
                        {showFooterMetrics && (
                            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-500">
                                <span className="truncate">
                                    {Number(product.soldCount) > 0
                                        ? `Đã bán ${Number(product.soldCount).toLocaleString('vi-VN')}`
                                        : 'Sẵn sàng khám phá'}
                                </span>
                                <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-zinc-700 transition-colors group-hover:text-[#f0592a]">
                                    Xem sản phẩm <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    )
}
