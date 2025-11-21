import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/customer';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/login', data),
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
  changePassword: (data) => api.post('/profile/change-password', data),
};

export const profileAPI = {
  getDocuments: () => api.get('/profile/documents'),
  uploadDocument: (file, category, description) => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    if (description) formData.append('description', description);
    return api.post('/profile/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument: (id) => api.delete(`/profile/documents/${id}`),
  downloadDocument: (id) => api.get(`/profile/documents/download/${id}`, {
    responseType: 'blob',
  }),
  getBookings: () => api.get('/profile/bookings'),
  getBookingsByStatus: (status) => api.get(`/profile/bookings/status/${status}`),
};

export const registrationAPI = {
  start: (data) => api.post('/register/start', data),
  update: (id, data) => api.put(`/register/update/${id}`, data),
  uploadCV: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/register/upload-cv/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPayment: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/register/payment/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const bookingAPI = {
  create: (data) => api.post('/booking/create', data),
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
};

export const settingsAPI = {
  getTimeSlots: () => api.get('/settings/time-slots'),
  getHomepageContent: () => api.get('/settings/homepage'),
};

export default api;