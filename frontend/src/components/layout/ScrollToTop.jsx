import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Cuộn lên đầu trang khi pathname thay đổi.
 * Tôn trọng thiết lập giảm chuyển động của hệ điều hành/trình duyệt.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [pathname])

  return null
}
