import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiService } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to validate token - returns structured result without throwing
  const validateToken = async (token) => {
    try {
      const response = await apiService.validateToken(token);
      if (response?.message === 'Invalid or expired token') {
        return { valid: false, message: response.message };
      }
      if (response?.success && response?.user) {
        return { valid: true, user: response.user };
      }
      return { valid: false, message: response?.message || 'Token validation failed' };
    } catch (error) {
      console.error('Token validation error:', error);
      // Do NOT force logout on transient/network errors; let caller decide
      return { valid: false, message: 'Validation request failed' };
    }
  };

  // Function to clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('appliedJobs');

    // localStorage.removeItem('authToken');
    // localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check for existing token in localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (token) {
          // Validate token with server
          const result = await validateToken(token);
          if (result.valid && result.user) {
            setUser(result.user);
            setIsAuthenticated(true);
            try { localStorage.setItem('userData', JSON.stringify(result.user)); } catch {}
          } else if (result.message === 'Invalid or expired token') {
            // Only clear on explicit invalid token
            clearAuthData();
          } else {
            // On other errors, keep existing storage; do not force logout
            console.warn('Token validation could not confirm validity; preserving session temporarily');
          }
        } else {
          // No token found, check for old user data and clear it
          const userData = localStorage.getItem('userData') || localStorage.getItem('user');
          if (userData) {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        // Do not clear storage here; only explicit invalid token should clear
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logging out user...');
    
    // Clear all authentication-related localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('user');
    
    // Clear any other application-specific localStorage items
    localStorage.removeItem('appliedJobs');
    
    console.log('localStorage cleared successfully');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Function to manually validate token (can be called when needed)
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      clearAuthData();
      return false;
    }

    try {
      const result = await validateToken(token);
      if (result.valid && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        try { localStorage.setItem('userData', JSON.stringify(result.user)); } catch {}
        return true;
      } else if (result.message === 'Invalid or expired token') {
        clearAuthData();
        return false;
      } else {
        // For transient errors, keep session
        return true;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      // On unexpected error, keep session and report false to caller
      return true;
    }
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkTokenValidity,
  }), [user, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
