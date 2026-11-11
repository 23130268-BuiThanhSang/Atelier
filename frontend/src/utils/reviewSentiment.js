const SENTIMENT_META = {
  POSITIVE: { label: 'Tích cực', className: 'bg-emerald-50 text-emerald-700' },
  NEGATIVE: { label: 'Tiêu cực', className: 'bg-red-50 text-red-700' },
  NEUTRAL: { label: 'Trung tính', className: 'bg-zinc-100 text-zinc-600' },
}

/** Trả về nhãn + class Tailwind cho badge cảm xúc, hoặc null nếu chưa có nhãn. */
export function getSentimentMeta(sentiment) {
  if (!sentiment) return null
  return SENTIMENT_META[String(sentiment).toUpperCase()] || null
}
