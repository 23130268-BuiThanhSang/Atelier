export default function PageHeader({ title, description, action = null, className = '' }) {
    return (
        <div className={`flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between ${className}`}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{title}</h1>
                {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    )
}
