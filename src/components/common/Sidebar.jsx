import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, Menu, X, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/snignavox_icon.png';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { startNavigation } = useNavigation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const userRole = user?.role?.toLowerCase();
    
    // Base items for all authenticated users
    const baseItems = [
      {
        name: 'Home',
        href: '/home',
        icon: Home,
      },
      {
        name: 'Jobs',
        href: '/jobs',
        icon: Briefcase,
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: User,
      },
    ];

    // Admin-specific items
    if (userRole === 'admin') {
      return [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
        ...baseItems,
      ];
    }

    // Recruiter-specific items
    if (userRole === 'recruiter') {
      return [
        {
          name: 'Dashboard',
          href: '/recruiter',
          icon: LayoutDashboard,
        },
        ...baseItems,
      ];
    }

    // Regular user items
    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-[9999] transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-16'}
        lg:translate-x-0 lg:w-16
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center ">
              <img src={logo} alt="logo" className=" object-contain" />
              {/* <Briefcase size={20} className="text-white" /> */}
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`
                      flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group
                      ${isOpen 
                        ? 'gap-3' 
                        : 'justify-center'
                      }
                      ${isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border border-blue-200'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                      }
                    `}
                    onClick={() => {
                      // Show navigation spinner
                      startNavigation();
                      // Close sidebar on mobile when link is clicked
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isOpen && (
                      <span className="whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                    
                    {/* Tooltip for desktop when sidebar is collapsed */}
                    {!isOpen && hoveredItem === item.name && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-2xl whitespace-nowrap z-[99999] hidden lg:block pointer-events-none top-1/2 transform -translate-y-1/2">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
