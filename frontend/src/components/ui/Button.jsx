const variantClasses = {
    primary: 'bg-[#f0592a] text-white hover:bg-[#d94a1f]',
    secondary: 'bg-[#fefccf] text-zinc-950 hover:bg-[#f6eed2]',
    outline: 'border border-zinc-200 bg-white text-zinc-700 hover:border-[#f0592a] hover:text-[#f0592a]',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950',
    danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
}

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
                variantClasses[variant],
                sizeClasses[size],
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </button>
    )
}
