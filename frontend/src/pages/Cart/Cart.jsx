import { useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, CreditCard, ShoppingBag } from 'lucide-react'
import Button from '../../components/ui/Button'
import Container from '../../components/ui/Container'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Toast from '../../components/ui/Toast'
import { cartApi } from '../../api/cartApi'
import { useCartStore } from '../../store/cartStore'

function formatPrice(value) {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function getUserId() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('userId')
    if (stored) return Number(stored)
  }
  return null
}

export default function Cart() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = getUserId()

  const [toast, setToast] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const setItemCount = useCartStore((state) => state.setItemCount)

  // Danh sách các variantId được tích chọn để đặt hàng
  const [selectedVariantIds, setSelectedVariantIds] = useState(new Set())
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

  const showToast = useCallback((message, variant = 'success') => {
    setToast({ open: true, message, variant })
  }, [])

  // Nếu chưa đăng nhập → hiển thị yêu cầu đăng nhập
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-20">
          <PageHeader title="Giỏ hàng" description="Bạn chưa đăng nhập." />
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
              <CreditCard className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-zinc-600 max-w-sm mb-8">
              Hãy đăng nhập để xem giỏ hàng và đặt hàng của bạn.
            </p>
            <Link to="/login">
              <Button>Đăng nhập ngay</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartApi.getCart(userId),
    enabled: Boolean(userId),
  })

  const items = cart?.items || []
  const totalItemCount = cart?.itemCount || 0

  // Tự động chọn tất cả sản phẩm khi giỏ hàng được tải lần đầu
  useEffect(() => {
    if (items.length > 0 && !hasInitializedSelection) {
      setSelectedVariantIds(new Set(items.map((it) => it.variantId)))
      setHasInitializedSelection(true)
    }
  }, [items, hasInitializedSelection])

  // Lọc danh sách sản phẩm được chọn
  const selectedItems = useMemo(
    () => items.filter((item) => selectedVariantIds.has(item.variantId)),
    [items, selectedVariantIds]
  )

  // Tính số lượng và tiền chỉ dựa trên các sản phẩm ĐƯỢC CHỌN
  const selectedItemCount = useMemo(
    () => selectedItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [selectedItems]
  )

  const selectedSubtotal = useMemo(
    () =>
      selectedItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
        0
      ),
    [selectedItems]
  )

  const shipping = selectedItems.length === 0 ? 0 : selectedSubtotal >= 500000 ? 0 : 30000
  const grandTotal = selectedSubtotal + shipping

  const isAllSelected = items.length > 0 && selectedItems.length === items.length

  // Xử lý chọn / bỏ chọn tất cả
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVariantIds(new Set())
    } else {
      setSelectedVariantIds(new Set(items.map((it) => it.variantId)))
    }
  }

  // Xử lý chọn / bỏ chọn một sản phẩm
  const handleToggleItem = (variantId) => {
    setSelectedVariantIds((prev) => {
      const next = new Set(prev)
      if (next.has(variantId)) {
        next.delete(variantId)
      } else {
        next.add(variantId)
      }
      return next
    })
  }

  // Chuyển sang trang Đặt hàng
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      showToast('Vui lòng tích chọn ít nhất 1 sản phẩm để đặt hàng.', 'error')
      return
    }
    navigate('/checkout', {
      state: {
        selectedVariantIds: Array.from(selectedVariantIds),
      },
    })
  }

  // Mutation: cập nhật số lượng
  const updateMutation = useMutation({
    mutationFn: ({ variantId, quantity }) =>
      cartApi.updateQuantity(variantId, quantity, userId),
    onMutate: async ({ variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', userId] })
      const previous = queryClient.getQueryData(['cart', userId])

      queryClient.setQueryData(['cart', userId], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }
      })
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', userId], context.previous)
      }
      showToast(err.response?.data?.message || 'Không thể cập nhật số lượng.', 'error')
    },
    onSuccess: (response) => {
      if (response?.itemCount !== undefined) {
        setItemCount(response.itemCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] })
    },
  })

  // Mutation: xóa sản phẩm
  const removeMutation = useMutation({
    mutationFn: (variantId) => cartApi.removeItem(variantId, userId),
    onSuccess: (response, variantId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] })
      if (response?.itemCount !== undefined) {
        setItemCount(response.itemCount)
      }
      // Bỏ khỏi danh sách tích chọn nếu vừa xóa
      setSelectedVariantIds((prev) => {
        const next = new Set(prev)
        next.delete(variantId)
        return next
      })
      setRemovingId(null)
      showToast('Đã xóa sản phẩm khỏi giỏ hàng.')
    },
    onError: (error) => {
      setRemovingId(null)
      showToast(error.response?.data?.message || 'Không thể xóa sản phẩm.', 'error')
    },
  })

  const handleRemove = (variantId) => {
    setRemovingId(variantId)
  }

  const confirmRemove = (variantId) => {
    removeMutation.mutate(variantId)
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-20">
          <PageHeader title="Giỏ hàng" description="Không thể tải giỏ hàng." />
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">Lỗi tải giỏ hàng</h2>
            <p className="text-zinc-600 mb-6">Vui lòng thử lại sau.</p>
            <Link to="/catalog">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="flex min-h-[60vh] items-center justify-center py-10">
          <Spinner />
        </Container>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-20">
          <PageHeader
            title="Giỏ hàng"
            description="Giỏ hàng của bạn đang trống."
            action={
              <Link to="/catalog">
                <Button variant="outline">Tiếp tục mua sắm</Button>
              </Link>
            }
          />
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
              <CreditCard className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-zinc-600 max-w-sm mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm.
            </p>
            <Link to="/catalog">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fefccf]">
      <Container>
        <PageHeader
          title="Giỏ hàng"
          description={`Bạn có ${totalItemCount} sản phẩm trong giỏ hàng.`}
          action={
            <Link to="/catalog">
              <Button variant="outline">Tiếp tục mua sắm</Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Thanh chọn tất cả + Danh sách sản phẩm */}
          <div className="lg:col-span-8 space-y-4">
            {/* Thanh Chọn Tất Cả */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-zinc-300 text-[#f0592a] accent-[#f0592a] cursor-pointer"
                />
                <span className="text-sm font-semibold text-zinc-900">
                  Chọn tất cả ({items.length} sản phẩm)
                </span>
              </label>

              <span className="text-xs text-zinc-500">
                Đã chọn <strong className="text-[#f0592a] font-bold">{selectedItems.length}</strong> / {items.length}
              </span>
            </div>

            {/* Danh sách từng sản phẩm */}
            {items.map((item) => {
              const isChecked = selectedVariantIds.has(item.variantId)

              return (
                <article
                  key={item.variantId}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isChecked
                      ? 'border-[#f0592a]/40 bg-white shadow-sm ring-1 ring-[#f0592a]/20'
                      : 'border-zinc-200 bg-white/80 opacity-90'
                  }`}
                >
                  <div className="flex p-4 items-center gap-4">
                    {/* Checkbox tích chọn sản phẩm */}
                    <div className="shrink-0 flex items-center pr-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleItem(item.variantId)}
                        className="w-4 h-4 rounded border-zinc-300 text-[#f0592a] accent-[#f0592a] cursor-pointer"
                        aria-label={`Chọn sản phẩm ${item.productName}`}
                      />
                    </div>

                    {/* Hình ảnh sản phẩm — nhỏ gọn 70x70 */}
                    <div className="shrink-0 relative w-[70px] h-[70px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-zinc-400">
                          <span aria-hidden="true" className="text-2xl mb-1">👕</span>
                          <p className="text-[10px]">Không có ảnh</p>
                        </div>
                      )}
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-zinc-950 line-clamp-2 leading-tight">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1">
                            {item.size} • {item.color}
                          </p>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemove(item.variantId)}
                          disabled={removingId === item.variantId}
                          className="px-2.5 py-1 shrink-0"
                          title="Xóa khỏi giỏ hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-4">
                        {/* Giá đơn vị + Tổng tiền dòng */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Đơn giá</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-semibold text-zinc-950">
                              {formatPrice(Number(item.price))}
                            </span>
                            <span className="text-[10px] text-zinc-400">/ cái</span>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-[#f0592a]">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </div>
                      </div>

                      {/* Bộ điều khiển số lượng */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 border border-zinc-200 rounded-lg overflow-hidden bg-white">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                variantId: item.variantId,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updateMutation.isPending ||
                              removingId === item.variantId
                            }
                            className="px-2 py-1.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10)
                              if (!isNaN(val) && val >= 1) {
                                updateMutation.mutate({
                                  variantId: item.variantId,
                                  quantity: val,
                                })
                              }
                            }}
                            className="w-10 text-center border-y-0 text-xs font-semibold text-zinc-950 focus:ring-0"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                variantId: item.variantId,
                                quantity: item.quantity + 1,
                              })
                            }
                            disabled={
                              item.quantity >= (item.stockQuantity || 0) ||
                              updateMutation.isPending ||
                              removingId === item.variantId
                            }
                            className="px-2 py-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        <p className="text-[11px] text-zinc-400">
                          Còn {item.stockQuantity || 0} sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-zinc-950 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#f0592a]" />
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Đã chọn</span>
                  <span className="text-zinc-950 font-semibold">
                    {selectedItems.length} sản phẩm ({selectedItemCount} món)
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Tạm tính</span>
                  <span className="text-zinc-950 font-semibold">{formatPrice(selectedSubtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Phí vận chuyển</span>
                  {selectedItems.length === 0 ? (
                    <span className="text-zinc-400">0 ₫</span>
                  ) : shipping > 0 ? (
                    <span className="text-zinc-950 font-semibold">{formatPrice(shipping)}</span>
                  ) : (
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  )}
                </div>

                {selectedSubtotal > 0 && selectedSubtotal < 500000 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
                    Mua thêm {formatPrice(500000 - selectedSubtotal)} để được miễn phí vận chuyển!
                  </p>
                )}
              </div>

              <div className="border-t border-zinc-200 pt-5">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-bold text-zinc-950">Tổng thanh toán</span>
                  <span className="text-xl font-extrabold text-[#f0592a]">{formatPrice(grandTotal)}</span>
                </div>

                {/* Nút Đặt hàng */}
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all"
                  disabled={selectedItems.length === 0}
                >
                  {selectedItems.length === 0
                    ? 'Đặt hàng'
                    : `Đặt hàng (${selectedItemCount})`}
                </Button>

                {selectedItems.length === 0 && (
                  <p className="mt-2.5 text-xs text-amber-600 text-center font-medium">
                    Vui lòng tích chọn ít nhất 1 sản phẩm để đặt hàng.
                  </p>
                )}

                <p className="mt-4 text-xs text-zinc-500 text-center">
                  Thanh toán an toàn · Giao hàng toàn quốc
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal xác nhận xóa */}
        <Modal
          open={removingId !== null}
          onClose={() => setRemovingId(null)}
          title="Xác nhận xóa"
        >
          <p className="text-zinc-600 mb-6">
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setRemovingId(null)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmRemove(removingId)}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </Modal>

        <Toast
          open={toast?.open}
          message={toast?.message || ''}
          variant={toast?.variant || 'success'}
          onClose={() => setToast(null)}
        />
      </Container>
    </div>
  )
}
