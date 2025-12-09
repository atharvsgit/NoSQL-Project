import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle responses and errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/users/me'),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  updateUserRole: (id, role) => api.put(`/users/role/${id}`, { role }),
};

// Event APIs
export const eventAPI = {
  createEvent: (data) => api.post('/events', data),
  getApprovedEvents: (params) => api.get('/events', { params }),
  getAllEvents: (params) => api.get('/events/all', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  updateEventStatus: (id, status) => api.put(`/events/status/${id}`, { status }),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// Registration APIs
export const registrationAPI = {
  registerForEvent: (eventId) => api.post(`/registrations/${eventId}`),
  getUserRegistrations: () => api.get('/registrations/user'),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  unregisterFromEvent: (eventId) => api.delete(`/registrations/${eventId}`),
  checkInAttendee: (registrationId) => api.put(`/registrations/checkin/${registrationId}`),
};

export default api;
