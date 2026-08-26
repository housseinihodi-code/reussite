import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/user.types';
import { Loader } from '@/components/Loader/Loader';

interface ProtectedRouteProps {
  roles?: Role[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !user.roles.some((r) => roles.includes(r.name))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
