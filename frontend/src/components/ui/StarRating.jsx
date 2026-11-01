import { useState } from 'react'

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

/**
 * Hiển thị hoặc chọn số sao.
 * - readOnly: chỉ hiển thị theo giá trị trung bình (làm tròn).
 * - onChange: bật chế độ chọn sao cho form đánh giá.
 */
export default function StarRating({
  value = 0,
  onChange,
  readOnly = true,
  size = 'md',
  className = '',
}) {
  const [hovered, setHovered] = useState(0)
  const rating = Number(value) || 0
  const activeValue = readOnly ? Math.round(rating) : hovered || rating
  const interactive = !readOnly && typeof onChange === 'function'

  return (
    <div
      className={`inline-flex items-center gap-0.5 leading-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Chọn số sao' : `Đánh giá ${rating.toFixed(1)} trên 5 sao`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= activeValue
        const starClass = isActive ? 'text-amber-500' : 'text-zinc-300'

        if (!interactive) {
          return (
            <span key={star} aria-hidden="true" className={starClass}>
              ★
            </span>
          )
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} sao`}
            title={`${star} sao`}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(star)}
            className={`${starClass} cursor-pointer rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0592a]/40`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
