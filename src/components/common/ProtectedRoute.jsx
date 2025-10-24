import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAuthPage, getRedirectPath } from '../../utils/routeProtection';

const ProtectedRoute = ({ children, requireAuth = true, authPages = [] }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get redirect path based on authentication status and current path
  const redirectPath = getRedirectPath(isAuthenticated, location.pathname);
  
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires no authentication but user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Additional check for specific auth pages when user is authenticated
  if (isAuthenticated && authPages.length > 0) {
    const currentPath = location.pathname;
    const isCurrentAuthPage = authPages.some(page => currentPath.includes(page));
    
    if (isCurrentAuthPage) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
