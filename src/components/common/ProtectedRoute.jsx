import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAuthPage, getRedirectPath } from '../../utils/routeProtection';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, requireAuth = true, authPages = [] }) => {
  const { isAuthenticated, loading, checkTokenValidity } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(false);

  // Validate token when route changes and user appears authenticated
  useEffect(() => {
    const validateOnRouteChange = async () => {
      if (isAuthenticated && !loading) {
        setIsValidating(true);
        try {
          const isValid = await checkTokenValidity();
          if (!isValid) {
            // Token is invalid, user will be redirected to login
            console.log('Token validation failed, redirecting to login');
          }
        } catch (error) {
          console.error('Token validation error:', error);
        } finally {
          setIsValidating(false);
        }
      }
    };

    validateOnRouteChange();
  }, [location.pathname, isAuthenticated, loading, checkTokenValidity]);

  // Do not block rendering with a loader; allow children to render while auth is resolving
  // This helps avoid pages appearing to load indefinitely
  if (loading || isValidating) {
    return children;
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
    const isCurrentAuthPage = authPages.some(page => currentPath === `/${page}` || currentPath.startsWith(`/${page}/`));
    
    if (isCurrentAuthPage) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
