import { Link } from 'react-router-dom'
import Button from './Button'

function formatPrice(value) {
    if (typeof value !== 'number') return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value)
}

export default function ProductCard({ product, onAddToCart }) {
    if (!product) return null

    return (
        <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-zinc-100">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                            Chưa có hình ảnh
                        </div>
                    )}
                </div>

                <div className="space-y-2 p-4">
                    <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-zinc-950">{product.name}</h2>
                    <p className="text-base font-bold text-[#f0592a]">{formatPrice(product.price)}</p>
                </div>
            </Link>

            {onAddToCart && (
                <div className="px-4 pb-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onAddToCart(product)}
                    >
                        Thêm vào giỏ
                    </Button>
                </div>
            )}
        </article>
    )
}
