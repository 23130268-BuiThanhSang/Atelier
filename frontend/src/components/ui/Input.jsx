export default function Input({
    id,
    label,
    error = '',
    helperText = '',
    className = '',
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-zinc-900">
                    {label}
                </label>
            )}

            <input
                id={id}
                className={[
                    'w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none transition-all',
                    'placeholder:text-zinc-400',
                    'focus:bg-white focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10',
                    error ? 'border-red-400' : 'border-zinc-200',
                    className,
                ].join(' ')}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                {...props}
            />

            {error && (
                <p id={`${id}-error`} className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${id}-helper`} className="text-sm text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    )
}
