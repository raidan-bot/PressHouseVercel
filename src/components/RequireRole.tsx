import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  children: React.ReactNode;
  roles: string[];
  fallbackPath?: string;
}

export default function RequireRole({ children, roles, fallbackPath = '/login' }: RequireRoleProps) {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !userData) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!roles.includes(userData.role)) {
    // If user is logged in but doesn't have the right role, redirect to Access Denied
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
