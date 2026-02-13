# API Integration Guide

This guide will help you connect the admin panel to your backend APIs.

## 🔧 Setup

### 1. Create API Configuration

Create `src/config/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Create Environment File

Create `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 📡 API Endpoints by Module

### 1️⃣ Dashboard

```javascript
// src/services/dashboardService.js
import api from '../config/api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getDailyUnlocks = async (days = 7) => {
  const response = await api.get(`/dashboard/unlocks?days=${days}`);
  return response.data;
};

export const getRevenueByType = async () => {
  const response = await api.get('/dashboard/revenue-by-type');
  return response.data;
};

export const getTopCategories = async () => {
  const response = await api.get('/dashboard/top-categories');
  return response.data;
};
```

**Expected API Endpoints**:
- `GET /dashboard/stats` - Returns all dashboard metrics
- `GET /dashboard/unlocks?days=7` - Returns daily unlock data
- `GET /dashboard/revenue-by-type` - Returns revenue breakdown
- `GET /dashboard/top-categories` - Returns top categories

---

### 2️⃣ Users Management

```javascript
// src/services/userService.js
import api from '../config/api';

export const getUsers = async (page = 1, search = '') => {
  const response = await api.get(`/users?page=${page}&search=${search}`);
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await api.post(`/users/${userId}/block`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await api.post(`/users/${userId}/unblock`);
  return response.data;
};

export const issueCredits = async (userId, credits, reason) => {
  const response = await api.post(`/users/${userId}/credits`, { credits, reason });
  return response.data;
};

export const getUserHistory = async (userId) => {
  const response = await api.get(`/users/${userId}/history`);
  return response.data;
};
```

**Expected API Endpoints**:
- `GET /users?page=1&search=` - Get users list
- `POST /users/:id/block` - Block user
- `POST /users/:id/unblock` - Unblock user
- `POST /users/:id/credits` - Issue credits
- `GET /users/:id/history` - Get user history

---

### 3️⃣ Workers Management

```javascript
// src/services/workerService.js
import api from '../config/api';

export const getWorkers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/workers?${params}`);
  return response.data;
};

export const approveWorker = async (workerId) => {
  const response = await api.post(`/workers/${workerId}/approve`);
  return response.data;
};

export const rejectWorker = async (workerId, reason) => {
  const response = await api.post(`/workers/${workerId}/reject`, { reason });
  return response.data;
};

export const blockWorker = async (workerId) => {
  const response = await api.post(`/workers/${workerId}/block`);
  return response.data;
};

export const markFeatured = async (workerId, plan) => {
  const response = await api.post(`/workers/${workerId}/featured`, { plan });
  return response.data;
};

export const assignBadge = async (workerId, badgeType) => {
  const response = await api.post(`/workers/${workerId}/badge`, { badgeType });
  return response.data;
};

export const approveKYC = async (workerId) => {
  const response = await api.post(`/workers/${workerId}/kyc/approve`);
  return response.data;
};
```

**Expected API Endpoints**:
- `GET /workers?type=&category=&city=` - Get workers with filters
- `POST /workers/:id/approve` - Approve worker
- `POST /workers/:id/reject` - Reject worker
- `POST /workers/:id/block` - Block worker
- `POST /workers/:id/featured` - Mark as featured
- `POST /workers/:id/badge` - Assign badge
- `POST /workers/:id/kyc/approve` - Approve KYC

---

### 4️⃣ Categories

```javascript
// src/services/categoryService.js
import api from '../config/api';

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
```

**Expected API Endpoints**:
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

---

### 5️⃣ Pricing & Plans

```javascript
// src/services/pricingService.js
import api from '../config/api';

export const getPricing = async () => {
  const response = await api.get('/pricing');
  return response.data;
};

export const updateOnboardingFee = async (type, price) => {
  const response = await api.put('/pricing/onboarding', { type, price });
  return response.data;
};

export const updateFeaturedPlan = async (plan, price) => {
  const response = await api.put('/pricing/featured', { plan, price });
  return response.data;
};

export const updateSubscriptionPlan = async (planId, data) => {
  const response = await api.put(`/pricing/subscription/${planId}`, data);
  return response.data;
};
```

**Expected API Endpoints**:
- `GET /pricing` - Get all pricing
- `PUT /pricing/onboarding` - Update onboarding fee
- `PUT /pricing/featured` - Update featured plan
- `PUT /pricing/subscription/:id` - Update subscription

---

### 6️⃣ Featured & Ranking

```javascript
// src/services/featuredService.js
import api from '../config/api';

export const getFeaturedRequests = async () => {
  const response = await api.get('/featured/requests');
  return response.data;
};

export const approveFeatured = async (requestId) => {
  const response = await api.post(`/featured/requests/${requestId}/approve`);
  return response.data;
};

export const rejectFeatured = async (requestId) => {
  const response = await api.post(`/featured/requests/${requestId}/reject`);
  return response.data;
};

export const getActiveFeatured = async () => {
  const response = await api.get('/featured/active');
  return response.data;
};

export const updatePriority = async (workerId, priority) => {
  const response = await api.put(`/featured/${workerId}/priority`, { priority });
  return response.data;
};

export const removeFeatured = async (workerId) => {
  const response = await api.delete(`/featured/${workerId}`);
  return response.data;
};
```

---

### 7️⃣ Payments & Revenue

```javascript
// src/services/paymentService.js
import api from '../config/api';

export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/payments/transactions?${params}`);
  return response.data;
};

export const getRevenueReports = async (period = 'monthly') => {
  const response = await api.get(`/payments/revenue?period=${period}`);
  return response.data;
};

export const issueRefund = async (transactionId, amount, reason) => {
  const response = await api.post('/payments/refund', { transactionId, amount, reason });
  return response.data;
};

export const exportTransactions = async (filters = {}) => {
  const response = await api.get('/payments/export', { 
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};
```

---

### 8️⃣ Complaints

```javascript
// src/services/complaintService.js
import api from '../config/api';

export const getComplaints = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/complaints?${params}`);
  return response.data;
};

export const warnWorker = async (complaintId, workerId) => {
  const response = await api.post(`/complaints/${complaintId}/warn`, { workerId });
  return response.data;
};

export const refundUnlock = async (complaintId) => {
  const response = await api.post(`/complaints/${complaintId}/refund`);
  return response.data;
};

export const resolveComplaint = async (complaintId) => {
  const response = await api.post(`/complaints/${complaintId}/resolve`);
  return response.data;
};
```

---

### 9️⃣ Analytics

```javascript
// src/services/analyticsService.js
import api from '../config/api';

export const getUnlocksByCategory = async () => {
  const response = await api.get('/analytics/unlocks-by-category');
  return response.data;
};

export const getWorkersByCity = async () => {
  const response = await api.get('/analytics/workers-by-city');
  return response.data;
};

export const getConversionRate = async () => {
  const response = await api.get('/analytics/conversion-rate');
  return response.data;
};

export const exportAnalytics = async () => {
  const response = await api.get('/analytics/export', { responseType: 'blob' });
  return response.data;
};
```

---

### 🔔 10️⃣ Notifications

```javascript
// src/services/notificationService.js
import api from '../config/api';

export const sendNotification = async (data) => {
  const response = await api.post('/notifications/send', data);
  return response.data;
};

export const getNotificationHistory = async () => {
  const response = await api.get('/notifications/history');
  return response.data;
};

export const uploadBanner = async (formData) => {
  const response = await api.post('/notifications/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getBanners = async () => {
  const response = await api.get('/notifications/banners');
  return response.data;
};
```

---

### 📄 11️⃣ CMS

```javascript
// src/services/cmsService.js
import api from '../config/api';

export const getContent = async (type) => {
  const response = await api.get(`/cms/${type}`);
  return response.data;
};

export const updateContent = async (type, content) => {
  const response = await api.put(`/cms/${type}`, { content });
  return response.data;
};
```

---

## 🔐 Authentication

Create `src/services/authService.js`:

```javascript
import api from '../config/api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('adminToken', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

---

## 🎯 Implementation Steps

### Step 1: Update Components to Use Services

Example for Dashboard:

```javascript
// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getDashboardStats, getDailyUnlocks } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // Your existing JSX with real data
  );
};
```

### Step 2: Add Loading States

Create `src/components/Loading.jsx`:

```javascript
const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default Loading;
```

### Step 3: Add Error Handling

Create `src/components/ErrorMessage.jsx`:

```javascript
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-2 text-red-600 hover:underline">
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
```

---

## 📝 Backend Requirements

Your backend should provide these endpoints with proper:
- ✅ Authentication (JWT)
- ✅ Authorization (Admin role check)
- ✅ Input validation
- ✅ Error handling
- ✅ Pagination
- ✅ Filtering
- ✅ Sorting

---

## 🚀 Testing

1. Test each API endpoint with Postman/Insomnia
2. Verify authentication flow
3. Test error scenarios
4. Check loading states
5. Verify data updates in real-time

---

**Ready to integrate!** Follow this guide step by step to connect your backend APIs.
