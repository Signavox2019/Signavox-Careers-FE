import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HomePage from '../../pages/HomePage';

const RoleBasedRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // If not authenticated, show home page
  if (!isAuthenticated || !user) {
    return <HomePage />;
  }

  const userRole = user.role?.toLowerCase();

  // Redirect based on role
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (userRole === 'recruiter') {
    return <Navigate to="/recruiter" replace />;
  }

  // Default: show home page for regular users
  return <HomePage />;
};

export default RoleBasedRedirect;
