import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data)    => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: ()           => api.get('/auth/me'),
}

// ─── User API ───────────────────────────────────────────────────────────────
export const userAPI = {
  getAll: ()              => api.get('/users'),
  getById: (id)           => api.get(`/users/${id}`),
  update: (id, data)      => api.put(`/users/${id}`, data),
  delete: (id)            => api.delete(`/users/${id}`),
  updateRole: (id, role)  => api.patch(`/users/${id}/role`, { role }),
}

// ─── Donor API ──────────────────────────────────────────────────────────────
export const donorAPI = {
  getAll: ()                       => api.get('/donors'),
  getById: (id)                    => api.get(`/donors/${id}`),
  create: (data)                   => api.post('/donors', data),
  update: (id, data)               => api.put(`/donors/${id}`, data),
  updateEligibility: (id, status)  => api.patch(`/donors/${id}/eligibility`, { eligibilityStatus: status }),
}

// ─── Blood Bank API ─────────────────────────────────────────────────────────
export const bloodBankAPI = {
  getAll: ()           => api.get('/blood-banks'),
  getById: (id)        => api.get(`/blood-banks/${id}`),
  create: (data)       => api.post('/blood-banks', data),
  update: (id, data)   => api.put(`/blood-banks/${id}`, data),
  delete: (id)         => api.delete(`/blood-banks/${id}`),
}

// ─── Blood Stock API ─────────────────────────────────────────────────────────
export const bloodStockAPI = {
  getAll: ()                     => api.get('/blood-stock'),
  getByBank: (bankId)            => api.get(`/blood-stock/bank/${bankId}`),
  update: (id, quantity)         => api.put(`/blood-stock/${id}`, { quantity }),
  getLowStock: (threshold = 100) => api.get(`/blood-stock/low?threshold=${threshold}`),
}

// ─── Blood Request API ───────────────────────────────────────────────────────
export const bloodRequestAPI = {
  getAll: ()                => api.get('/blood-requests'),
  getMyRequests: ()         => api.get('/blood-requests/my'),
  getById: (id)             => api.get(`/blood-requests/${id}`),
  create: (data)            => api.post('/blood-requests', data),
  updateStatus: (id, status) => api.patch(`/blood-requests/${id}/status`, { status }),
  cancel: (id)              => api.patch(`/blood-requests/${id}/status`, { status: 'Cancelled' }),
}

// ─── Donation API ────────────────────────────────────────────────────────────
export const donationAPI = {
  getAll: ()                          => api.get('/donations'),
  getByDonor: (donorId)               => api.get(`/donations/donor/${donorId}`),
  create: (data)                      => api.post('/donations', data),
  updateScreening: (id, status)       => api.patch(`/donations/${id}/screening`, { screeningStatus: status }),
}

// ─── Admin API ──────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
}

// ─── Fulfillment API ─────────────────────────────────────────────────────────
export const fulfillmentAPI = {
  getAll: ()              => api.get('/fulfillments'),
  create: (requestId)     => api.post('/fulfillments', { requestId }),
}

export default api
