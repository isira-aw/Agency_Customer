import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/customer';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrationAPI = {
  start: (data) => api.post('/register/start', data),
  update: (id, data) => api.put(`/register/update/${id}`, data),
  getAll: () => api.get('/register/all'),
  getDetail: (id) => api.get(`/register/detail/${id}`),
  uploadCV: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/register/upload-cv/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/register/delete/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/booking/create', data),
  getAll: () => api.get('/booking/all'),
  getByDate: (date) => api.get(`/booking/by-date/${date}`),
  updateStatus: (id, status) => api.put(`/booking/update-status/${id}`, { status }),
  delete: (id) => api.delete(`/booking/delete/${id}`),
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  delete: (id) => api.delete(`/gallery/delete/${id}`),
};

export const settingsAPI = {
  getTimeSlots: () => api.get('/settings/time-slots'),
  getHomepageContent: () => api.get('/settings/homepage'),
};

export default api;