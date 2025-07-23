import React, { createContext, useReducer, useEffect } from 'react';
import type { AuthContextType, User } from '../types';
import { authAPI } from '../services/api';
import { isApiError } from '../types';
import { tokenCookies } from '../utils/cookies';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Add this to track initial load
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE_COMPLETE' };

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
        isInitialized: true,
      };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null, isInitialized: true };
    case 'INITIALIZE_COMPLETE':
      return { ...state, isInitialized: true };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from secure cookies on app start
  useEffect(() => {
    const token = tokenCookies.getToken();
    const user = tokenCookies.getUser();

    if (token && user) {
      try {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        tokenCookies.clearAll();
        dispatch({ type: 'INITIALIZE_COMPLETE' });
      }
    } else {
      dispatch({ type: 'INITIALIZE_COMPLETE' });
    }
  }, []);  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authAPI.login(email, password);
      const { user } = response.data;
      const { token } = response;

      // Store in secure cookies
      tokenCookies.setToken(token);
      tokenCookies.setUser(user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: unknown) {
      const errorMessage = isApiError(error)
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authAPI.register(name, email, password, confirmPassword);
      const { user } = response.data;
      const { token } = response;

      // Store in secure cookies
      tokenCookies.setToken(token);
      tokenCookies.setUser(user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: unknown) {
      const errorMessage = isApiError(error)
        ? error.response?.data?.message || 'Registration failed'
        : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // Call server logout endpoint
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      tokenCookies.clearAll();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    login,
    register,
    logout,
    loading: state.loading,
    error: state.error,
    isInitialized: state.isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
