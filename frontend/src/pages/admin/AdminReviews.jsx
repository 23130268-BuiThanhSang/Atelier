import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Loader2,
    MessageSquareText,
    Search,
    Star,
    Trash2,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import StarRating from '../../components/ui/StarRating'
import Toast from '../../components/ui/Toast'
import { reviewApi } from '../../api/reviewApi'

const PAGE_SIZE = 10

function formatDateTime(value) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function StatusBadge({ status }) {
    const visible = String(status).toUpperCase() === 'VISIBLE'
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            visible ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
        }`}>
            {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {visible ? 'Đang hiển thị' : 'Đang ẩn'}
        </span>
    )
}

export default function AdminReviews() {
    const queryClient = useQueryClient()

    const [currentPage, setCurrentPage] = useState(0)
    const [keywordInput, setKeywordInput] = useState('')
    const [ratingFilter, setRatingFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [pendingDelete, setPendingDelete] = useState(null)
    const [toast, setToast] = useState(null)

    const notify = (message, variant = 'success') => {
        setToast({ open: true, message, variant })
    }

    const reviewsQuery = useQuery({
        queryKey: ['admin', 'reviews', currentPage, keywordInput.trim(), ratingFilter, statusFilter],
        queryFn: () => reviewApi.adminList({
            page: currentPage,
            size: PAGE_SIZE,
            keyword: keywordInput.trim(),
            rating: ratingFilter ? Number(ratingFilter) : null,
            status: statusFilter || null,
        }),
        placeholderData: (previousData) => previousData,
    })

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
    }

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => reviewApi.adminUpdateStatus(id, status),
        onSuccess: (_, variables) => {
            notify(variables.status === 'HIDDEN' ? 'Đã ẩn đánh giá.' : 'Đã hiển thị lại đánh giá.')
            invalidateAll()
        },
        onError: (error) => {
            notify(error.response?.data?.message || 'Không thể đổi trạng thái đánh giá.', 'error')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => reviewApi.adminRemove(id),
        onSuccess: () => {
            notify('Đã xóa đánh giá.')
            setPendingDelete(null)
            invalidateAll()
        },
        onError: (error) => {
            notify(error.response?.data?.message || 'Không thể xóa đánh giá.', 'error')
        },
    })

    const items = reviewsQuery.data?.items || []
    const totalElements = Number(reviewsQuery.data?.totalItems) || 0
    const totalPages = Number(reviewsQuery.data?.totalPages) || 0
    const isLoading = reviewsQuery.isLoading
    const isBusy = statusMutation.isPending || deleteMutation.isPending

    const handleToggleStatus = (review) => {
        const nextStatus = String(review.status).toUpperCase() === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE'
        statusMutation.mutate({ id: review.id, status: nextStatus })
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#f0592a] mb-1">
                        <span>Kiểm duyệt nội dung</span>
                        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f0592a]" />}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Đánh giá sản phẩm</h1>
                    <p className="mt-1 text-sm text-zinc-500">Ẩn đánh giá không phù hợp hoặc xóa vĩnh viễn khi cần.</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-zinc-700 border border-zinc-200">
                        {totalElements.toLocaleString('vi-VN')} đánh giá
                    </span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xs border border-zinc-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(event) => {
                            setKeywordInput(event.target.value)
                            setCurrentPage(0)
                        }}
                        placeholder="Tìm theo người đánh giá, email, sản phẩm, nội dung..."
                        className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#f0592a] transition-all font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={ratingFilter}
                        onChange={(event) => {
                            setRatingFilter(event.target.value)
                            setCurrentPage(0)
                        }}
                        aria-label="Lọc theo số sao"
                        className="h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer focus:outline-none focus:border-[#f0592a]"
                    >
                        <option value="">Tất cả số sao</option>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>{star} sao</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(event) => {
                            setStatusFilter(event.target.value)
                            setCurrentPage(0)
                        }}
                        aria-label="Lọc theo trạng thái"
                        className="h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer focus:outline-none focus:border-[#f0592a]"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="VISIBLE">Đang hiển thị</option>
                        <option value="HIDDEN">Đang ẩn</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/70 overflow-hidden flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[1080px]">
                        <thead>
                            <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-b border-zinc-100">
                                <th className="py-3.5 pl-6 pr-4">Người đánh giá</th>
                                <th className="py-3.5 px-4">Sản phẩm</th>
                                <th className="py-3.5 px-4">Đánh giá</th>
                                <th className="py-3.5 px-4">Nội dung</th>
                                <th className="py-3.5 px-4">Thời gian</th>
                                <th className="py-3.5 px-4">Trạng thái</th>
                                <th className="py-3.5 pl-4 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center text-zinc-500">
                                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#f0592a]" />
                                        Đang tải danh sách đánh giá...
                                    </td>
                                </tr>
                            )}

                            {!isLoading && reviewsQuery.isError && (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center">
                                        <p className="text-sm font-semibold text-red-600">Không thể tải danh sách đánh giá.</p>
                                        <Button size="sm" variant="outline" className="mt-3" onClick={() => reviewsQuery.refetch()}>
                                            Thử lại
                                        </Button>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !reviewsQuery.isError && items.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center">
                                        <MessageSquareText className="mx-auto mb-2 h-6 w-6 text-zinc-300" />
                                        <p className="text-sm font-semibold text-zinc-600">Không có đánh giá nào phù hợp bộ lọc.</p>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && items.map((review) => {
                                const hidden = String(review.status).toUpperCase() === 'HIDDEN'
                                return (
                                    <tr key={review.id} className="hover:bg-zinc-50/70 transition-colors">
                                        <td className="py-4 pl-6 pr-4 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fefccf] text-xs font-bold text-[#c94a1f]">
                                                    {(review.authorName || 'A').trim().charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-zinc-950 truncate max-w-[180px]">{review.authorName}</p>
                                                    <p className="text-[11px] text-zinc-500 truncate max-w-[180px]">{review.authorEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <span className="font-medium text-zinc-700 line-clamp-2 max-w-[190px]">{review.productName}</span>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex items-center gap-1">
                                                <StarRating value={review.rating} size="sm" />
                                                <span className="ml-1 font-semibold text-zinc-700">{review.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <p className={`max-w-[280px] whitespace-pre-line ${hidden ? 'text-zinc-400' : 'text-zinc-700'}`}>
                                                {review.comment || <span className="italic text-zinc-400">Không có nội dung</span>}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 align-top text-zinc-500">{formatDateTime(review.createdAt)}</td>
                                        <td className="py-4 px-4 align-top"><StatusBadge status={review.status} /></td>
                                        <td className="py-4 pl-4 pr-6 align-top text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(review)}
                                                    disabled={isBusy}
                                                    title={hidden ? 'Hiển thị lại đánh giá' : 'Ẩn đánh giá'}
                                                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50"
                                                >
                                                    {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPendingDelete(review)}
                                                    disabled={isBusy}
                                                    title="Xóa vĩnh viễn"
                                                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div>
                        Hiển thị <strong className="text-zinc-900">{items.length ? currentPage * PAGE_SIZE + 1 : 0} đến {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</strong> trong <strong className="text-zinc-900">{totalElements}</strong> đánh giá
                    </div>

                    <div className="flex items-center gap-1 font-semibold">
                        <button
                            type="button"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-700 bg-white border border-zinc-200 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentPage(index)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentPage === index
                                        ? 'bg-[#f0592a] text-white shadow-xs'
                                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage((page) => page + 1)}
                            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 disabled:opacity-40 hover:bg-zinc-100 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                open={Boolean(pendingDelete)}
                onClose={() => {
                    if (!deleteMutation.isPending) setPendingDelete(null)
                }}
                title="Xóa đánh giá"
                footer={(
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setPendingDelete(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => deleteMutation.mutate(pendingDelete.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                        </Button>
                    </div>
                )}
            >
                <div className="space-y-2 text-sm text-zinc-700">
                    <p>Đánh giá của <strong>{pendingDelete?.authorName}</strong> cho sản phẩm <strong>{pendingDelete?.productName}</strong> sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
                    <div className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {pendingDelete?.rating} sao
                        {pendingDelete?.comment ? ` · ${pendingDelete.comment}` : ''}
                    </div>
                </div>
            </Modal>

            <Toast
                open={toast?.open}
                message={toast?.message || ''}
                variant={toast?.variant || 'success'}
                onClose={() => setToast(null)}
            />
        </div>
    )
}
