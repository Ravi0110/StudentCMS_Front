import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from '../components';

/**
 * ProtectedRoute — wraps children and redirects to /login
 * if the user is not authenticated.
 *
 * Optionally accepts `allowedRoles` to restrict by role.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) return <Loader fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
