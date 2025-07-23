import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, isInitialized } = useAuth();
  const location = useLocation();

  // Don't make routing decisions until auth state is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user || !token) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

