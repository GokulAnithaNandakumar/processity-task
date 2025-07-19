import React, { createContext, useReducer, useCallback } from 'react';
import type { TaskContextType, Task, TaskFilters, TaskStats } from '../types';
import { tasksAPI } from '../services/api';

interface TaskState {
  tasks: Task[];
  stats: TaskStats['data'] | null;
  loading: boolean;
  error: string | null;
  warning: string | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WARNING'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_STATS'; payload: TaskStats['data'] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: string };

const initialState: TaskState = {
  tasks: [],
  stats: null,
  loading: false,
  error: null,
  warning: null,
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export { TaskContext };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WARNING':
      return { ...state, warning: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_STATS':
      return { ...state, stats: action.payload, loading: false, error: null };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await tasksAPI.getTasks(filters);
      dispatch({ type: 'SET_TASKS', payload: response.data.tasks });
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  const createTask = useCallback(async (task: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_WARNING', payload: null });

      const response = await tasksAPI.createTask(task);
      dispatch({ type: 'ADD_TASK', payload: response.data.task });

      // Check for warning in response
      if (response.warning) {
        dispatch({ type: 'SET_WARNING', payload: response.warning });
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create task';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  const updateTask = useCallback(async (id: string, task: Partial<Task>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_WARNING', payload: null });

      const response = await tasksAPI.updateTask(id, task);
      dispatch({ type: 'UPDATE_TASK', payload: response.data.task });

      // Check for warning in response
      if (response.warning) {
        dispatch({ type: 'SET_WARNING', payload: response.warning });
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update task';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      await tasksAPI.deleteTask(id);
      dispatch({ type: 'REMOVE_TASK', payload: id });
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete task';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await tasksAPI.getStats();
      dispatch({ type: 'SET_STATS', payload: response.data });
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch statistics';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  const clearWarning = useCallback(() => {
    dispatch({ type: 'SET_WARNING', payload: null });
  }, []);

  const value: TaskContextType = {
    tasks: state.tasks,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    warning: state.warning,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
    clearWarning,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
