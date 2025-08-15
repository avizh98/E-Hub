import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { 
  User, 
  Task, 
  ChatMessage, 
  Payment, 
  Rating,
  HelperProfile,
  TaskCategory,
  TaskStatus,
  Location 
} from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      // TODO: Navigate to login screen
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  signup: (data: {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: 'requester' | 'helper';
  }) => api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  verifyPhone: (data: { phoneNumber: string; otp: string }) =>
    api.post('/auth/verify-phone', data),

  logout: () => api.post('/auth/logout'),

  refreshToken: () => api.post('/auth/refresh-token'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get<User>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/users/profile', data),

  uploadProfilePicture: (formData: FormData) =>
    api.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  switchRole: (role: 'requester' | 'helper') =>
    api.post('/users/switch-role', { role }),

  deleteAccount: () => api.delete('/users/account'),
};

// Helper specific APIs
export const helperAPI = {
  submitVerification: (data: FormData) =>
    api.post('/helpers/verification', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateAvailability: (isAvailable: boolean) =>
    api.put('/helpers/availability', { isAvailable }),

  updateLocation: (location: Location) =>
    api.put('/helpers/location', location),

  getEarnings: (period?: 'day' | 'week' | 'month') =>
    api.get('/helpers/earnings', { params: { period } }),

  getNearbyTasks: (location: Location, radius?: number) =>
    api.get<Task[]>('/helpers/nearby-tasks', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius || 5, // km
      },
    }),
};

// Task APIs
export const taskAPI = {
  createTask: (data: {
    category: TaskCategory;
    title: string;
    description: string;
    pickupLocation: Location;
    deliveryLocation: Location;
    urgency: 'asap' | 'scheduled';
    scheduledTime?: string;
    budget: number;
    attachments?: string[];
  }) => api.post<Task>('/tasks', data),

  getTask: (taskId: string) => api.get<Task>(`/tasks/${taskId}`),

  getUserTasks: (status?: TaskStatus) =>
    api.get<Task[]>('/tasks/user', { params: { status } }),

  acceptTask: (taskId: string) =>
    api.post<Task>(`/tasks/${taskId}/accept`),

  updateTaskStatus: (taskId: string, status: TaskStatus) =>
    api.put<Task>(`/tasks/${taskId}/status`, { status }),

  cancelTask: (taskId: string, reason: string) =>
    api.post<Task>(`/tasks/${taskId}/cancel`, { reason }),

  uploadTaskAttachment: (taskId: string, formData: FormData) =>
    api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Chat APIs
export const chatAPI = {
  getMessages: (taskId: string) =>
    api.get<ChatMessage[]>(`/chats/${taskId}/messages`),

  sendMessage: (taskId: string, data: {
    message: string;
    messageType: 'text' | 'image' | 'voice';
    attachmentUrl?: string;
  }) => api.post<ChatMessage>(`/chats/${taskId}/messages`, data),

  markAsRead: (taskId: string, messageIds: string[]) =>
    api.put(`/chats/${taskId}/messages/read`, { messageIds }),

  uploadChatAttachment: (taskId: string, formData: FormData) =>
    api.post(`/chats/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Payment APIs
export const paymentAPI = {
  initiatePayment: (taskId: string, data: {
    paymentMethod: 'card' | 'upi' | 'wallet';
    amount: number;
    tip?: number;
  }) => api.post<Payment>(`/payments/${taskId}/initiate`, data),

  confirmCashPayment: (taskId: string, amount: number, tip?: number) =>
    api.post<Payment>(`/payments/${taskId}/cash`, { amount, tip }),

  getPaymentHistory: () => api.get<Payment[]>('/payments/history'),

  getPaymentDetails: (paymentId: string) =>
    api.get<Payment>(`/payments/${paymentId}`),
};

// Rating APIs
export const ratingAPI = {
  submitRating: (taskId: string, data: {
    rating: number;
    review?: string;
  }) => api.post<Rating>(`/ratings/${taskId}`, data),

  getUserRatings: (userId: string) =>
    api.get<Rating[]>(`/ratings/user/${userId}`),
};

// Notification APIs
export const notificationAPI = {
  registerDeviceToken: (token: string) =>
    api.post('/notifications/register', { token }),

  getNotifications: () => api.get('/notifications'),

  markAsRead: (notificationIds: string[]) =>
    api.put('/notifications/read', { notificationIds }),

  updatePreferences: (preferences: {
    taskRequests: boolean;
    taskUpdates: boolean;
    messages: boolean;
    payments: boolean;
  }) => api.put('/notifications/preferences', preferences),
};

export default api;