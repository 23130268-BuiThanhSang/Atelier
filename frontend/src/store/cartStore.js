import { create } from 'zustand'

/**
 * Store đồng bộ số lượng sản phẩm trong giỏ hàng giữa các component
 * (Header badge, Cart page, ProductDetail).
 */
export const useCartStore = create((set) => ({
  itemCount: 0,

  setItemCount: (count) => set({ itemCount: count }),

  increment: (qty = 1) =>
    set((state) => ({ itemCount: state.itemCount + qty })),

  decrement: (qty = 1) =>
    set((state) => ({ itemCount: Math.max(0, state.itemCount - qty) })),
}))
