import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

const variantIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const variantClasses = {
  success: 'bg-green-50 border-green-100 text-green-700',
  error: 'bg-red-50 border-red-100 text-red-700',
  info: 'bg-blue-50 border-blue-100 text-blue-700',
}

export default function Toast({ open, message, variant = 'info', onClose, duration = 4000 }) {
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      onClose()
    }, duration)
    setTimer(id)
    return () => clearTimeout(id)
  }, [open, duration, onClose])

  const handleClose = useCallback(() => {
    if (timer) clearTimeout(timer)
    onClose()
  }, [timer, onClose])

  if (!open) return null

  const Icon = variantIcons[variant] || variantIcons.info

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${variantClasses[variant]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex shrink-0 items-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="shrink-0 rounded-lg p-1.5 text-current opacity-70 transition-opacity hover:opacity-100"
        aria-label="Đóng thông báo"
      >
        <span className="sr-only">Đóng</span>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
