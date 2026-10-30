import { useState } from 'react'
import Button from '../../components/ui/Button'
import StarRating from '../../components/ui/StarRating'
import { getUserId, reviewApi } from '../../api/reviewApi'

const MAX_COMMENT = 1200

/** Form gửi đánh giá mới hoặc sửa đánh giá đã có. */
export default function ReviewForm({ productId, review = null, onSuccess, onCancel, notify }) {
    const editing = Boolean(review?.id)
    const [rating, setRating] = useState(review?.rating || 0)
    const [comment, setComment] = useState(review?.comment || '')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!rating) {
            setError('Vui lòng chọn số sao trước khi gửi.')
            return
        }
        if (comment.length > MAX_COMMENT) {
            setError(`Nội dung đánh giá tối đa ${MAX_COMMENT} ký tự.`)
            return
        }

        const userId = getUserId()
        if (!userId) {
            setError('Vui lòng đăng nhập để đánh giá sản phẩm.')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const payload = { rating, comment: comment.trim() || null }
            if (editing) {
                await reviewApi.update(review.id, payload, userId)
            } else {
                await reviewApi.create(productId, payload, userId)
            }

            notify(editing ? 'Đã cập nhật đánh giá của bạn.' : 'Cảm ơn bạn đã đánh giá sản phẩm.', 'success')
            if (!editing) {
                setRating(0)
                setComment('')
            }
            onSuccess?.()
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-zinc-950">
                        {editing ? 'Sửa đánh giá của bạn' : 'Chia sẻ đánh giá của bạn'}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                        Chọn số sao và chia sẻ cảm nhận về sản phẩm.
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <span className="mb-2 block text-sm font-semibold text-zinc-800">Mức đánh giá</span>
                <div className="flex flex-wrap items-center gap-3">
                    <StarRating value={rating} onChange={setRating} readOnly={false} size="lg" />
                    <span className="text-sm text-zinc-500">
                        {rating ? `${rating} / 5 sao` : 'Chưa chọn'}
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Nội dung đánh giá
                </label>
                <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Chất liệu, kích thước và trải nghiệm sử dụng..."
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#f0592a] focus:bg-white focus:outline-none"
                />
                <div className="mt-1 flex justify-end">
                    <span className={`text-xs ${comment.length > MAX_COMMENT ? 'font-semibold text-red-600' : 'text-zinc-400'}`}>
                        {comment.length}/{MAX_COMMENT} ký tự
                    </span>
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : editing ? 'Lưu đánh giá' : 'Gửi đánh giá'}
                </Button>
                {editing && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
                        Hủy
                    </Button>
                )}
            </div>
        </form>
    )
}
