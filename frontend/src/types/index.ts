export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface TaskResponse {
  status: string;
  warning?: string;
  data: {
    task: Task;
  };
}

export interface TasksResponse {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    tasks: Task[];
  };
}

export interface TaskStats {
  status: string;
  data: {
    stats: Array<{
      _id: string;
      count: number;
    }>;
    overdue: number;
    total: number;
  };
}

export interface ApiError {
  status: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  stats: TaskStats['data'] | null;
  loading: boolean;
  error: string | null;
  warning: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  createTask: (task: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearWarning: () => void;
}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


// Error handling types
export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export const isApiError = (error: unknown): error is ApiErrorResponse => {
  return typeof error === 'object' && error !== null && 'response' in error;
};
