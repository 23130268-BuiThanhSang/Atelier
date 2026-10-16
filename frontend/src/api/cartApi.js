import axios from 'axios'

/**
 * Lấy userId đã lưu trong localStorage sau khi đăng nhập.
 * Trả về null nếu chưa đăng nhập.
 */
function getUserId() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('userId')
    if (stored) return Number(stored)
  }
  return null
}

function authHeaders(userId) {
  return { 'X-User-ID': String(userId) }
}

export const cartApi = {
  // Lấy giỏ hàng của user (yêu cầu userId)
  getCart: (userId) =>
    axios
      .get('/api/v1/cart', { headers: authHeaders(userId) })
      .then((response) => response.data),

  // Thêm sản phẩm vào giỏ
  addItem: (payload, userId) =>
    axios
      .post('/api/v1/cart/items', payload, { headers: authHeaders(userId) })
      .then((response) => response.data),

  // Cập nhật số lượng
  updateQuantity: (variantId, quantity, userId) =>
    axios
      .put(`/api/v1/cart/items/${variantId}`, { quantity }, { headers: authHeaders(userId) })
      .then((response) => response.data),

  // Xóa sản phẩm khỏi giỏ
  removeItem: (variantId, userId) =>
    axios
      .delete(`/api/v1/cart/items/${variantId}`, { headers: authHeaders(userId) })
      .then((response) => response.data),
}
