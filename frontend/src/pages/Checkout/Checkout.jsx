import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MapPin,
  Phone,
  User as UserIcon,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ShoppingBag,
  Building2,
} from 'lucide-react'
import Container from '../../components/ui/Container'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Toast from '../../components/ui/Toast'
import { cartApi } from '../../api/cartApi'
import { orderApi } from '../../api/orderApi'
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

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const userId = getUserId()
  const setItemCount = useCartStore((state) => state.setItemCount)

  // Danh sách variantId truyền từ trang Giỏ hàng
  const stateSelectedIds = location.state?.selectedVariantIds

  // Form states
  const [shippingName, setShippingName] = useState('')
  const [shippingPhone, setShippingPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD') // COD | BANK_TRANSFER

  // Validation & UI states
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  // Điền trước thông tin tài khoản nếu đã có trong localStorage
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const storedName = localStorage.getItem('userName')
      if (storedName && !shippingName) {
        setShippingName(storedName)
      }
    }
  }, [])

  const showToast = (message, variant = 'success') => {
    setToast({ open: true, message, variant })
  }

  // Tải dữ liệu giỏ hàng của user
  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartApi.getCart(userId),
    enabled: Boolean(userId),
  })

  const cartItems = cart?.items || []

  // Lọc chỉ lấy các món hàng được tích chọn đặt hàng
  const orderItems = useMemo(() => {
    if (!cartItems.length) return []
    if (Array.isArray(stateSelectedIds) && stateSelectedIds.length > 0) {
      const selectedSet = new Set(stateSelectedIds.map(Number))
      return cartItems.filter((item) => selectedSet.has(Number(item.variantId)))
    }
    return cartItems // Nếu không truyền state (vd: vào trực tiếp), lấy tất cả
  }, [cartItems, stateSelectedIds])

  // Tính toán số lượng và tiền
  const totalQuantity = useMemo(
    () => orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [orderItems]
  )

  const subtotal = useMemo(
    () =>
      orderItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
        0
      ),
    [orderItems]
  )

  const shippingFee = orderItems.length === 0 ? 0 : subtotal >= 500000 ? 0 : 30000
  const totalAmount = subtotal + shippingFee

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!shippingName.trim()) {
      newErrors.shippingName = 'Vui lòng nhập họ tên người nhận.'
    }
    if (!shippingPhone.trim()) {
      newErrors.shippingPhone = 'Vui lòng nhập số điện thoại.'
    } else {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
      if (!phoneRegex.test(shippingPhone.trim().replace(/\s+/g, ''))) {
        newErrors.shippingPhone = 'Số điện thoại không hợp lệ (10 chữ số).'
      }
    }
    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng chi tiết.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý gửi đặt hàng
  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      showToast('Vui lòng kiểm tra lại thông tin nhận hàng.', 'error')
      return
    }

    if (orderItems.length === 0) {
      showToast('Không có sản phẩm nào trong đơn hàng.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim(),
        paymentMethod,
        selectedVariantIds: orderItems.map((it) => it.variantId),
      }

      const res = await orderApi.createOrder(payload, userId)

      // Cập nhật lại cache giỏ hàng và store
      await queryClient.invalidateQueries({ queryKey: ['cart', userId] })
      const remainingCount = Math.max(0, (cart?.itemCount || 0) - totalQuantity)
      setItemCount(remainingCount)

      showToast('Đặt hàng thành công! Đang chuyển hướng...', 'success')

      setTimeout(() => {
        if (res?.id) {
          navigate(`/order_detail/${res.id}`)
        } else {
          navigate('/my-orders')
        }
      }, 1000)
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || 'Đặt hàng thất bại. Vui lòng thử lại!'
      showToast(errMsg, 'error')
      setIsSubmitting(false)
    }
  }

  // Chưa đăng nhập
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-20">
          <PageHeader title="Đặt hàng" description="Vui lòng đăng nhập để tiếp tục." />
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">Bạn chưa đăng nhập</h2>
            <p className="text-zinc-600 max-w-sm mb-8">
              Vui lòng đăng nhập tài khoản để thực hiện đặt hàng.
            </p>
            <Link to="/login">
              <Button>Đăng nhập ngay</Button>
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

  if (isError || orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fefccf]">
        <Container className="py-20">
          <PageHeader
            title="Đặt hàng"
            description="Không có sản phẩm nào được chọn để thanh toán."
          />
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">
              Chưa có sản phẩm nào được chọn
            </h2>
            <p className="text-zinc-600 max-w-sm mb-8">
              Vui lòng quay lại giỏ hàng và chọn các món bạn muốn mua.
            </p>
            <Link to="/cart">
              <Button>Quay lại giỏ hàng</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fefccf] pb-16 font-sans">
      <Container>
        <div className="pt-6 pb-2">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-[#f0592a] font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
          </button>
          <PageHeader
            title="Xác nhận đặt hàng"
            description="Kiểm tra thông tin giao hàng và chi tiết sản phẩm trước khi hoàn tất."
          />
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Cột trái: Thông tin nhận hàng & Phương thức thanh toán */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. THÔNG TIN GIAO HÀNG */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#f0592a]/10 flex items-center justify-center text-[#f0592a]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-950">Địa chỉ nhận hàng</h2>
                    <p className="text-xs text-zinc-500">Thông tin liên lạc và địa chỉ nhận hàng của bạn</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Họ tên */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={shippingName}
                        onChange={(e) => {
                          setShippingName(e.target.value)
                          if (errors.shippingName) setErrors((prev) => ({ ...prev, shippingName: '' }))
                        }}
                        className={`w-full rounded-xl border bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10 ${
                          errors.shippingName ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                    {errors.shippingName && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingName}</p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        placeholder="0912 345 678"
                        value={shippingPhone}
                        onChange={(e) => {
                          setShippingPhone(e.target.value)
                          if (errors.shippingPhone) setErrors((prev) => ({ ...prev, shippingPhone: '' }))
                        }}
                        className={`w-full rounded-xl border bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10 ${
                          errors.shippingPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                    {errors.shippingPhone && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingPhone}</p>
                    )}
                  </div>

                  {/* Địa chỉ nhận hàng chi tiết */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      value={shippingAddress}
                      onChange={(e) => {
                        setShippingAddress(e.target.value)
                        if (errors.shippingAddress) setErrors((prev) => ({ ...prev, shippingAddress: '' }))
                      }}
                      className={`w-full rounded-xl border bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10 resize-none ${
                        errors.shippingAddress ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-200'
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress}</p>
                    )}
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PHƯƠNG THỨC VẬN CHUYỂN */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#f0592a]/10 flex items-center justify-center text-[#f0592a]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-950">Hình thức giao hàng</h2>
                    <p className="text-xs text-zinc-500">Đơn vị vận chuyển liên kết tiêu chuẩn</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[#f0592a]/30 bg-[#fdfbf4]">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-4 border-[#f0592a] bg-white flex items-center justify-center" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">Giao hàng tiêu chuẩn</p>
                      <p className="text-xs text-zinc-500">Nhận hàng sau 2 - 4 ngày làm việc</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-950">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
              </div>

              {/* 3. PHƯƠNG THỨC THANH TOÁN */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#f0592a]/10 flex items-center justify-center text-[#f0592a]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-950">Phương thức thanh toán</h2>
                    <p className="text-xs text-zinc-500">Lựa chọn cách thanh toán phù hợp với bạn</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#f0592a] bg-[#fdfbf4] ring-2 ring-[#f0592a]/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 w-4 h-4 text-[#f0592a] accent-[#f0592a] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-950">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                          Phổ biến
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Bạn chỉ cần thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được kiện hàng.
                      </p>
                    </div>
                  </label>

                  {/* Chuyển khoản ngân hàng */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-[#f0592a] bg-[#fdfbf4] ring-2 ring-[#f0592a]/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="mt-1 w-4 h-4 text-[#f0592a] accent-[#f0592a] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-950">
                          Chuyển khoản ngân hàng (VietQR)
                        </span>
                        <Building2 className="w-4 h-4 text-zinc-400" />
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Thanh toán nhanh chóng bằng cách quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử.
                      </p>

                      {paymentMethod === 'BANK_TRANSFER' && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200 text-xs text-zinc-700 space-y-1">
                          <p className="font-semibold text-zinc-900">Thông tin chuyển khoản Atelier:</p>
                          <p>• Ngân hàng: <strong>MB Bank (Quân Đội)</strong></p>
                          <p>• Số tài khoản: <strong>9999 8888 6666</strong></p>
                          <p>• Chủ tài khoản: <strong>ATELIER PLATFORM</strong></p>
                          <p className="text-amber-700 italic">
                            * Nội dung chuyển khoản: Mã đơn hàng (sẽ xuất hiện ở trang xác nhận tiếp theo).
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng & Nút Xác nhận */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                  <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#f0592a]" />
                    Đơn hàng ({orderItems.length} sản phẩm)
                  </h2>
                  <Link
                    to="/cart"
                    className="text-xs text-[#f0592a] hover:underline font-semibold"
                  >
                    Thay đổi
                  </Link>
                </div>

                {/* Danh sách các sản phẩm đang đặt */}
                <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 pr-1 -mr-1 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.variantId} className="flex gap-3 py-3 items-center">
                      <div className="relative w-14 h-14 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            👕
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 bg-[#f0592a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                          x{item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {item.size} • {item.color}
                        </p>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xs text-zinc-400">
                            {formatPrice(Number(item.price))}
                          </span>
                          <span className="text-xs font-bold text-zinc-950">
                            {formatPrice(Number(item.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tính tổng tiền */}
                <div className="border-t border-zinc-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Tổng tiền hàng</span>
                    <span className="text-zinc-950 font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Phí giao hàng</span>
                    {shippingFee === 0 ? (
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    ) : (
                      <span className="text-zinc-950 font-semibold">{formatPrice(shippingFee)}</span>
                    )}
                  </div>

                  <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-zinc-950">Tổng thanh toán</span>
                    <span className="text-2xl font-extrabold text-[#f0592a]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Nút Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting || orderItems.length === 0}
                  className="w-full py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-5 h-5 text-white" />
                      Đang xử lý đặt hàng...
                    </span>
                  ) : (
                    'Xác nhận đặt hàng'
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Bảo đảm quyền lợi người mua · Kiểm tra hàng trước khi nhận</span>
                </div>
              </div>
            </div>
          </div>
        </form>

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
