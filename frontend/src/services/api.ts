import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { AuthResponse, TaskResponse, TasksResponse, TaskStats, Task, TaskFilters } from '../types';
import { tokenCookies } from '../utils/cookies';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Re-enable for cookie authentication
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenCookies.getToken();
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
  (error) => {
    if (error.response?.status === 401) {
      tokenCookies.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if the server logout fails, we should clear local auth state
      console.warn('Server logout failed:', error);
    }
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (filters?: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response: AxiosResponse<TasksResponse> = await api.get(`/tasks?${params}`);
    return response.data;
  },

  getTask: async (id: string): Promise<TaskResponse> => {
    const response: AxiosResponse<TaskResponse> = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<TaskResponse> => {
    const response: AxiosResponse<TaskResponse> = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<Task>): Promise<TaskResponse> => {
    const response: AxiosResponse<TaskResponse> = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getStats: async (): Promise<TaskStats> => {
    const response: AxiosResponse<TaskStats> = await api.get('/tasks/stats/overview');
    return response.data;
  },
};

export default api;
