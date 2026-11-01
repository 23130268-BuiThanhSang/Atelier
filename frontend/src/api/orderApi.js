import axios from 'axios'

function authHeaders(userId) {
  if (!userId) return {}
  return { 'X-User-ID': String(userId) }
}

export const orderApi = {
  /**
   * Tạo đơn hàng mới từ các mặt hàng trong giỏ.
   * payload: { shippingName, shippingPhone, shippingAddress, note, paymentMethod, selectedVariantIds }
   */
  createOrder: (payload, userId) =>
    axios
      .post('/api/orders', payload, { headers: authHeaders(userId) })
      .then((res) => res.data),

  /**
   * Lấy lịch sử đơn hàng của người dùng theo email.
   */
  getMyOrders: (email) =>
    axios
      .get(`/api/orders/user?email=${encodeURIComponent(email)}`)
      .then((res) => res.data),

  /**
   * Lấy chi tiết đơn hàng theo ID.
   */
  getOrderDetail: (id) =>
    axios
      .get(`/api/orders/${id}`)
      .then((res) => res.data),
}
