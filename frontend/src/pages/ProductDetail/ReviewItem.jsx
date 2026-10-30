import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import StarRating from '../../components/ui/StarRating'
import { getUserId, reviewApi } from '../../api/reviewApi'

function formatDate(value) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Một đánh giá trong danh sách, kèm thao tác sửa/xóa nếu là của chính người dùng. */
export default function ReviewItem({ review, onEdit, onChanged, notify, highlight = false }) {
    const [deleting, setDeleting] = useState(false)
    const [confirming, setConfirming] = useState(false)

    const mine = Boolean(review.mine)
    const hidden = String(review.status || '').toUpperCase() === 'HIDDEN'
    const canEdit = mine && !hidden && typeof onEdit === 'function'
    const initial = (review.authorName || 'A').trim().charAt(0).toUpperCase()

    const handleDelete = async () => {
        const userId = getUserId()
        if (!userId) {
            notify('Vui lòng đăng nhập để xóa đánh giá.', 'error')
            return
        }

        setDeleting(true)
        try {
            await reviewApi.remove(review.id, userId)
            notify('Đã xóa đánh giá của bạn.', 'success')
            setConfirming(false)
            onChanged?.()
        } catch (err) {
            notify(err.response?.data?.message || 'Không thể xóa đánh giá. Vui lòng thử lại.', 'error')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <article className={`rounded-2xl border p-4 sm:p-5 ${highlight ? 'border-[#f0592a]/30 bg-[#fff8f4]' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-start gap-3">
                {review.authorAvatarUrl ? (
                    <img
                        src={review.authorAvatarUrl}
                        alt={review.authorName}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fefccf] text-sm font-bold text-[#c94a1f]">
                        {initial}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-zinc-950">{review.authorName}</span>
                        {mine && (
                            <span className="rounded-full bg-[#fff1ea] px-2 py-0.5 text-[11px] font-bold text-[#c94a1f]">
                                Của bạn
                            </span>
                        )}
                        {hidden && (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                                Đang bị ẩn
                            </span>
                        )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <StarRating value={review.rating} size="sm" />
                        {review.createdAt && (
                            <span className="text-xs text-zinc-400">{formatDate(review.createdAt)}</span>
                        )}
                    </div>

                    {review.comment ? (
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700">{review.comment}</p>
                    ) : (
                        <p className="mt-3 text-sm italic text-zinc-400">Người dùng không để lại nội dung.</p>
                    )}

                    {hidden && mine && (
                        <p className="mt-3 text-xs text-zinc-500">
                            Đánh giá này đang bị quản trị viên ẩn nên không thể chỉnh sửa. Liên hệ hỗ trợ nếu cần thêm thông tin.
                        </p>
                    )}

                    {mine && !hidden && (
                        <div className="mt-3">
                            {confirming ? (
                                <div className="flex flex-wrap items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                                    <span className="text-xs font-semibold text-red-700">Xóa đánh giá này?</span>
                                    <Button size="sm" variant="danger" onClick={handleDelete} disabled={deleting}>
                                        {deleting ? 'Đang xóa...' : 'Xóa'}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={deleting}>
                                        Hủy
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(review)}
                                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-[#f0592a]"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Sửa
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setConfirming(true)}
                                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}
