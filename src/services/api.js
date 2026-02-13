import axios from 'axios';

// API Base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return the full response data (which contains success, data, etc.)
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
      }
      
      return Promise.reject({ message, status: error.response.status, data: error.response.data });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({ message: 'Network error. Please check your connection.', status: 0 });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message || 'An unexpected error occurred', status: 0 });
    }
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User API endpoints
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  block: (id) => api.patch(`/users/${id}/block`),
  unblock: (id) => api.patch(`/users/${id}/unblock`),
};

// Worker API endpoints
export const workerAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  create: (workerData) => api.post('/workers', workerData),
  update: (id, workerData) => api.put(`/workers/${id}`, workerData),
  delete: (id) => api.delete(`/workers/${id}`),
  approve: (id) => api.post(`/workers/${id}/approve`),
  reject: (id, reason) => api.post(`/workers/${id}/reject`, { reason }),
  block: (id) => api.post(`/workers/${id}/block`),
  unblock: (id) => api.post(`/workers/${id}/unblock`),
  markFeatured: (id, plan) => api.post(`/workers/${id}/featured`, { plan }),
  removeFeatured: (id) => api.delete(`/workers/${id}/featured`),
  approveKYC: (id) => api.post(`/workers/${id}/kyc/approve`),
};

// Category API endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getChartData: (type) => api.get(`/dashboard/charts/${type}`),
};

// Transaction API endpoints
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  verify: (id, data) => api.post(`/transactions/${id}/verify`, data),
};

// Notification API endpoints
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (notificationData) => api.post('/notifications', notificationData),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Complaint API endpoints
export const complaintAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  resolve: (id) => api.patch(`/complaints/${id}/resolve`),
};

export default api;
