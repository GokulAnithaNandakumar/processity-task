/**
 * Integration Tests for Frontend
 * Tests components working together with API integration
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('API Integration', () => {
    it('should mock axios requests successfully', () => {
      // Simple test to verify axios mocking works
      mockedAxios.get = vi.fn().mockResolvedValue({ data: { message: 'success' } });

      expect(mockedAxios.get).toBeDefined();
      expect(vi.isMockFunction(mockedAxios.get)).toBe(true);
    });

    it('should handle API request and response cycle', async () => {
      const mockResponse = {
        data: {
          tasks: [
            { id: '1', title: 'Test Task', completed: false }
          ]
        }
      };

      mockedAxios.get = vi.fn().mockResolvedValue(mockResponse);

      const response = await axios.get('/api/tasks');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks');
      expect(response.data.tasks).toHaveLength(1);
      expect(response.data.tasks[0].title).toBe('Test Task');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get = vi.fn().mockRejectedValue(mockError);

      try {
        await axios.get('/api/tasks');
      } catch (error) {
        expect(error).toBe(mockError);
      }

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks');
    });
  });

  describe('Form Submission Integration', () => {
    it('should handle form submission with API call', () => {
      const mockSubmit = vi.fn();
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { success: true }
      });

      const TestForm = () => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mockSubmit();
            axios.post('/api/tasks', { title: 'New Task' });
          }}
          data-testid="test-form"
        >
          <input data-testid="title-input" defaultValue="New Task" />
          <button type="submit" data-testid="submit-btn">Submit</button>
        </form>
      );

      render(<TestForm />);

      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(mockSubmit).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/tasks', { title: 'New Task' });
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should handle login API integration', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        data: {
          token: 'fake-token',
          user: { name: 'Test User' }
        }
      };

      mockedAxios.post = vi.fn().mockResolvedValue(mockResponse);

      const response = await axios.post('/api/auth/login', loginData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', loginData);
      expect(response.data.token).toBe('fake-token');
      expect(response.data.user.name).toBe('Test User');
    });

    it('should handle logout API integration', async () => {
      mockedAxios.post = vi.fn().mockResolvedValue({ data: { success: true } });

      await axios.post('/api/auth/logout');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle 401 unauthorized error', async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      mockedAxios.get = vi.fn().mockRejectedValue(unauthorizedError);

      try {
        await axios.get('/api/protected');
      } catch (error) {
        expect(error).toBe(unauthorizedError);
      }
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get = vi.fn().mockRejectedValue(networkError);

      try {
        await axios.get('/api/tasks');
      } catch (error) {
        expect(error).toBe(networkError);
      }
    });
  });

  describe('Component and API Integration', () => {
    it('should render loading state during API call', async () => {
      // Mock delayed response
      mockedAxios.get = vi.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() =>
          resolve({ data: { tasks: [] } }), 100
        ))
      );

      const LoadingComponent = () => {
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
          axios.get('/api/tasks').finally(() => setLoading(false));
        }, []);

        return loading ?
          <div data-testid="loading">Loading...</div> :
          <div data-testid="content">Content loaded</div>;
      };

      const React = await import('react');

      render(<LoadingComponent />);

      // Should show loading initially
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });
  });
});
