import { useEffect } from 'react'

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
    )
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    footer = null,
    className = '',
}) {
    useEffect(() => {
        if (!open) return undefined

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className={`w-full max-w-lg rounded-2xl bg-white shadow-xl ${className}`}>
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4">
                    <h2 id="modal-title" className="text-lg font-semibold text-zinc-950">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="rounded-lg p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-5 py-5">{children}</div>

                {footer && <div className="border-t border-zinc-200 px-5 py-4">{footer}</div>}
            </div>
        </div>
    )
}
