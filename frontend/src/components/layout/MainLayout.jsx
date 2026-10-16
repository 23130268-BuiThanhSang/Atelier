import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from './Header'
import Footer from './Footer'
import { cartApi } from '../../api/cartApi'
import { useCartStore } from '../../store/cartStore'

function getUserId() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('userId')
    if (stored) return Number(stored)
  }
  return null
}

export default function MainLayout() {
  const userId = getUserId()
  const setItemCount = useCartStore((state) => state.setItemCount)

  // Fetch giỏ hàng ban đầu để set vào zustand store (để Header dùng)
  const { data: cart } = useQuery({
    queryKey: ['cart-count', userId],
    queryFn: () => cartApi.getCart(userId).then((c) => c.itemCount),
    enabled: Boolean(userId),
  })

  useEffect(() => {
    if (cart !== undefined) {
      setItemCount(cart)
    }
  }, [cart, setItemCount])

  const cartCount = useCartStore((state) => state.itemCount)

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-950">
      <Header cartCount={cartCount} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
