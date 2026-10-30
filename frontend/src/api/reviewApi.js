import axios from 'axios'

/**
 * Lấy userId đã lưu trong localStorage sau khi đăng nhập.
 * Trả về null nếu chưa đăng nhập.
 */
export function getUserId() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('userId')
    if (stored) return Number(stored)
  }
  return null
}

function authHeaders(userId) {
  return { 'X-User-ID': String(userId) }
}

function optionalAuth(userId) {
  return userId ? { headers: authHeaders(userId) } : undefined
}

export const reviewApi = {
  // Danh sách đánh giá công khai + điểm tổng hợp của một sản phẩm
  getProductReviews: ({ productId, page = 0, size = 5, rating = null, sort = 'newest', userId = null }) =>
    axios
      .get(`/api/v1/products/${productId}/reviews`, {
        params: {
          page,
          size,
          sort,
          ...(rating ? { rating } : {}),
        },
        ...optionalAuth(userId),
      })
      .then((response) => response.data),

  // Trạng thái đánh giá của người dùng hiện tại với sản phẩm
  getMyReview: (productId, userId) =>
    axios
      .get(`/api/v1/products/${productId}/reviews/me`, optionalAuth(userId))
      .then((response) => response.data),

  create: (productId, payload, userId) =>
    axios
      .post(`/api/v1/products/${productId}/reviews`, payload, {
        headers: authHeaders(userId),
      })
      .then((response) => response.data),

  update: (reviewId, payload, userId) =>
    axios
      .put(`/api/v1/reviews/${reviewId}`, payload, {
        headers: authHeaders(userId),
      })
      .then((response) => response.data),

  remove: (reviewId, userId) =>
    axios.delete(`/api/v1/reviews/${reviewId}`, {
      headers: authHeaders(userId),
    }),

  adminList: ({ page = 0, size = 10, keyword = '', rating = null, status = null } = {}) =>
    axios
      .get('/api/v1/admin/reviews', {
        params: {
          page,
          size,
          ...(keyword ? { keyword } : {}),
          ...(rating ? { rating } : {}),
          ...(status ? { status } : {}),
        },
      })
      .then((response) => response.data),

  adminUpdateStatus: (reviewId, status) =>
    axios
      .patch(`/api/v1/admin/reviews/${reviewId}/status`, { status })
      .then((response) => response.data),

  adminRemove: (reviewId) => axios.delete(`/api/v1/admin/reviews/${reviewId}`),
}
