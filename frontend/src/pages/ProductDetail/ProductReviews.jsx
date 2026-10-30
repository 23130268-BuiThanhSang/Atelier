import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import StarRating from '../../components/ui/StarRating'
import Toast from '../../components/ui/Toast'
import { getUserId, reviewApi } from '../../api/reviewApi'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

const PAGE_SIZE = 5

function buildDistribution(summary) {
    const distribution = summary?.distribution || {}
    return [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: Number(distribution[star] ?? distribution[String(star)] ?? 0) || 0,
    }))
}

export default function ProductReviews({ productId }) {
    const queryClient = useQueryClient()
    const userId = getUserId()

    const [page, setPage] = useState(0)
    const [editingReview, setEditingReview] = useState(null)
    const [toast, setToast] = useState(null)

    const notify = (message, variant = 'success') => {
        setToast({ open: true, message, variant })
    }

    const reviewsQuery = useQuery({
        queryKey: ['reviews', productId, 'list', page, userId],
        queryFn: () => reviewApi.getProductReviews({ productId, page, size: PAGE_SIZE, userId }),
        enabled: Boolean(productId),
        placeholderData: (previousData) => previousData,
    })

    const meQuery = useQuery({
        queryKey: ['reviews', productId, 'me', userId],
        queryFn: () => reviewApi.getMyReview(productId, userId),
        enabled: Boolean(productId),
    })

    const refreshAll = () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
    }

    // Nếu xóa đánh giá cuối cùng của trang hiện tại thì lùi về trang trước.
    const handleItemDeleted = () => {
        if (items.length === 1 && page > 0) {
            setPage((current) => Math.max(0, current - 1))
        }
        refreshAll()
    }

    const summary = reviewsQuery.data?.summary
    const distribution = buildDistribution(summary)
    const totalReviews = Number(summary?.totalReviews) || 0
    const averageRating = Number(summary?.averageRating) || 0
    const items = reviewsQuery.data?.items || []
    const totalPages = Number(reviewsQuery.data?.totalPages) || 0
    const totalItems = Number(reviewsQuery.data?.totalItems) || 0

    const myReview = meQuery.data?.review
    const reason = meQuery.data?.reason
    const visibleItems = myReview
        ? items.filter((item) => item.id !== myReview.id)
        : items

    const handleFormSuccess = () => {
        setEditingReview(null)
        refreshAll()
    }

    return (
        <section id="product-reviews" className="mt-14 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0592a]">Phản hồi khách hàng</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">Đánh giá sản phẩm</h2>
                </div>
                <p className="text-sm text-zinc-500">
                    {totalReviews > 0
                        ? `${totalReviews.toLocaleString('vi-VN')} đánh giá được hiển thị`
                        : 'Chưa có đánh giá nào'}
                </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="space-y-4">
                    <div className="rounded-2xl bg-[#faf7ee] p-5">
                        {totalReviews > 0 ? (
                            <>
                                <p className="text-4xl font-black tracking-tight text-zinc-950">
                                    {averageRating.toFixed(1)}
                                    <span className="ml-1 text-base font-semibold text-zinc-500">/ 5</span>
                                </p>
                                <div className="mt-3">
                                    <StarRating value={averageRating} size="md" />
                                </div>
                                <p className="mt-3 text-sm text-zinc-600">
                                    Tổng hợp từ {totalReviews.toLocaleString('vi-VN')} đánh giá.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-2xl font-black text-zinc-950">Chưa có đánh giá</p>
                                <div className="mt-3">
                                    <StarRating value={0} size="md" />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này.
                                </p>
                            </>
                        )}
                    </div>

                    {totalReviews > 0 && (
                        <div className="rounded-2xl border border-zinc-200 p-4">
                            <h3 className="text-sm font-bold text-zinc-950">Phân bố số sao</h3>
                            <div className="mt-3 space-y-2">
                                {distribution.map(({ star, count }) => {
                                    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
                                    return (
                                        <div key={star} className="flex items-center gap-2 px-1.5 py-1">
                                            <span className="w-10 shrink-0 text-xs font-semibold text-zinc-600">
                                                {star} sao
                                            </span>
                                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                                                <span
                                                    className="block h-full rounded-full bg-amber-400"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </span>
                                            <span className="w-8 shrink-0 text-right text-xs text-zinc-500">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </aside>

                <div className="space-y-5">
                    {meQuery.isLoading && (
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-500">
                            Đang kiểm tra trạng thái đánh giá của bạn...
                        </div>
                    )}

                    {!meQuery.isLoading && reason === 'NOT_LOGGED_IN' && (
                        <div className="rounded-2xl border border-[#e6d68e] bg-[#fefccf] p-5">
                            <p className="text-sm font-bold text-zinc-950">Bạn muốn chia sẻ cảm nhận?</p>
                            <p className="mt-1 text-sm text-zinc-600">
                                Đăng nhập để gửi đánh giá cho sản phẩm này.
                            </p>
                            <Link to="/login" className="mt-3 inline-block">
                                <Button size="sm">Đăng nhập để đánh giá</Button>
                            </Link>
                        </div>
                    )}

                    {!meQuery.isLoading && reason === 'NOT_PURCHASED' && (
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                            <p className="text-sm font-bold text-zinc-950">Bạn chưa thể đánh giá sản phẩm này</p>
                            <p className="mt-1 text-sm text-zinc-600">
                                Chỉ khách đã mua và nhận hàng mới có thể gửi đánh giá. Đơn hàng ở trạng thái
                                hoàn thành hoặc đã giao sẽ mở khóa đánh giá.
                            </p>
                            <Link to="/my-orders" className="mt-3 inline-block">
                                <Button size="sm" variant="outline">Xem đơn hàng của tôi</Button>
                            </Link>
                        </div>
                    )}

                    {!meQuery.isLoading && reason === 'CAN_REVIEW' && (
                        <ReviewForm
                            productId={productId}
                            notify={notify}
                            onSuccess={handleFormSuccess}
                        />
                    )}

                    {!meQuery.isLoading && reason === 'ALREADY_REVIEWED' && myReview && (
                        editingReview ? (
                            <ReviewForm
                                productId={productId}
                                review={editingReview}
                                notify={notify}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setEditingReview(null)}
                            />
                        ) : (
                            <ReviewItem
                                review={myReview}
                                highlight
                                notify={notify}
                                onEdit={(review) => setEditingReview(review)}
                                onChanged={handleItemDeleted}
                            />
                        )
                    )}

                    {reviewsQuery.isLoading && (
                        <div className="space-y-3" aria-live="polite">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="rounded-2xl border border-zinc-200 p-5">
                                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
                                    <div className="mt-3 h-3 w-24 animate-pulse rounded bg-zinc-100" />
                                    <div className="mt-4 h-3 w-full animate-pulse rounded bg-zinc-100" />
                                </div>
                            ))}
                        </div>
                    )}

                    {reviewsQuery.isError && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
                            <p>Không thể tải đánh giá. Vui lòng thử lại.</p>
                            <Button size="sm" variant="outline" className="mt-3" onClick={() => reviewsQuery.refetch()}>
                                Thử lại
                            </Button>
                        </div>
                    )}

                    {!reviewsQuery.isLoading && !reviewsQuery.isError && visibleItems.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                            <p className="text-sm font-semibold text-zinc-700">
                                Chưa có đánh giá nào được hiển thị.
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                Đánh giá của bạn sẽ xuất hiện tại đây.
                            </p>
                        </div>
                    )}

                    {visibleItems.length > 0 && (
                        <div className="space-y-3">
                            {visibleItems.map((review) => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    notify={notify}
                                    onChanged={handleItemDeleted}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                            <p className="text-xs text-zinc-500">
                                Trang {page + 1} / {totalPages} · {totalItems.toLocaleString('vi-VN')} đánh giá
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page === 0}
                                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                                >
                                    Trước
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Toast
                open={toast?.open}
                message={toast?.message || ''}
                variant={toast?.variant || 'success'}
                onClose={() => setToast(null)}
            />
        </section>
    )
}
