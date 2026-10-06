const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
}

export default function Spinner({ size = 'md', label = 'Đang tải...' }) {
    return (
        <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
            <span
                className={`inline-block animate-spin rounded-full border-zinc-200 border-t-[#f0592a] ${sizeClasses[size]}`}
            />
            <span className="sr-only">{label}</span>
        </span>
    )
}
