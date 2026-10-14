import axios from 'axios'

export const productApi = {
  // README quy định mọi lời gọi backend đi qua src/api/ và tiền tố /api/v1.
  getAll: () => axios.get('/api/v1/products').then((response) => response.data),
  getById: (id) => axios.get(`/api/v1/products/${id}`).then((response) => response.data),
}