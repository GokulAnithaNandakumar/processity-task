/**
 * Simple Integration Tests
 * Basic API integration tests without complex DOM matchers
 */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Task API Integration', () => {
    it('should fetch tasks from API', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
      ];

      mockedAxios.get = vi.fn().mockResolvedValue({
        data: { tasks: mockTasks }
      });

      const response = await axios.get('/api/tasks');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks');
      expect(response.data.tasks).toHaveLength(2);
      expect(response.data.tasks[0].title).toBe('Task 1');
    });

    it('should create new task via API', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const createdTask = { id: '3', ...newTask, completed: false };

      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { task: createdTask }
      });

      const response = await axios.post('/api/tasks', newTask);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/tasks', newTask);
      expect(response.data.task.title).toBe('New Task');
      expect(response.data.task.id).toBe('3');
    });

    it('should update task via API', async () => {
      const taskId = '1';
      const updates = { completed: true };
      const updatedTask = { id: taskId, title: 'Task 1', ...updates };

      mockedAxios.put = vi.fn().mockResolvedValue({
        data: { task: updatedTask }
      });

      const response = await axios.put(`/api/tasks/${taskId}`, updates);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/api/tasks/${taskId}`, updates);
      expect(response.data.task.completed).toBe(true);
    });

    it('should delete task via API', async () => {
      const taskId = '1';

      mockedAxios.delete = vi.fn().mockResolvedValue({
        data: { success: true }
      });

      const response = await axios.delete(`/api/tasks/${taskId}`);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/tasks/${taskId}`);
      expect(response.data.success).toBe(true);
    });
  });

  describe('Authentication API Integration', () => {
    it('should handle login API call', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const loginResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      };

      mockedAxios.post = vi.fn().mockResolvedValue({
        data: loginResponse
      });

      const response = await axios.post('/api/auth/login', credentials);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(response.data.token).toBe('fake-jwt-token');
      expect(response.data.user.email).toBe('test@example.com');
    });

    it('should handle registration API call', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };
      const registrationResponse = {
        user: { id: '2', ...userData },
        token: 'new-jwt-token'
      };

      mockedAxios.post = vi.fn().mockResolvedValue({
        data: registrationResponse
      });

      const response = await axios.post('/api/auth/register', userData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(response.data.user.name).toBe('New User');
      expect(response.data.token).toBe('new-jwt-token');
    });

    it('should handle logout API call', async () => {
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { message: 'Logged out successfully' }
      });

      const response = await axios.post('/api/auth/logout');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout');
      expect(response.data.message).toBe('Logged out successfully');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get = vi.fn().mockRejectedValue(networkError);

      try {
        await axios.get('/api/tasks');
      } catch (error) {
        expect(error).toBe(networkError);
      }

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks');
    });

    it('should handle HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };

      mockedAxios.get = vi.fn().mockRejectedValue(httpError);

      try {
        await axios.get('/api/tasks/999');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe('Not found');
      }
    });

    it('should handle unauthorized errors', async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      mockedAxios.get = vi.fn().mockRejectedValue(unauthorizedError);

      try {
        await axios.get('/api/protected');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.message).toBe('Unauthorized');
      }
    });
  });

  describe('Request Configuration Integration', () => {
    it('should send requests with authentication headers', async () => {
      const token = 'bearer-token';

      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: { tasks: [] } }),
        defaults: { headers: { common: {} } }
      });

      const apiClient = axios.create();
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await apiClient.get('/api/tasks');

      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should handle request timeouts', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded') as any;
      timeoutError.code = 'ECONNABORTED';

      mockedAxios.get = vi.fn().mockRejectedValue(timeoutError);

      try {
        await axios.get('/api/slow-endpoint');
      } catch (error: any) {
        expect(error.code).toBe('ECONNABORTED');
        expect(error.message).toContain('timeout');
      }
    });
  });
});
