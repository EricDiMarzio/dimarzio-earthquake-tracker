import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This is a WRAPPER COMPONENT - not a HOC - Sometimes called a Guard Component, wrapper components are used in place of HOCs because they are declarative and readable. It also plays well with react-router
// This also allows us to abstract out this logic rather than repeating it inside components.

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // show loading spinner while checking auth
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Navigates away if - the component has a required role - the user's role does not match the required role - the user is not an admin.  All three must be met to navigate away.
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  //if authorization and authentication pass - return the child component.
  return <>{children}</>;
}
