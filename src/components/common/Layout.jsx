import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import UserProfileDropdown from './UserProfileDropdown';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/jobs':
        return 'Jobs';
      case '/profile':
        return 'Profile';
      default:
        return 'CareerHub';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-16">
        {/* Top navbar */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-[9998] shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
              >
                <Menu size={20} className="text-gray-600" />
              </button>

              {/* Page title - hidden on mobile, shown on desktop */}
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getPageTitle()}
                </h1>
              </div>

              {/* Right side - Auth section */}
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <UserProfileDropdown user={user} onLogout={logout} />
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate('/login')}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => navigate('/register')}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
