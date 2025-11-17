import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useNotification } from '../../contexts/NotificationContext';
import ChangePasswordModal from './ChangePasswordModal';

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { startNavigation } = useNavigation();
  const { showSuccess } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log('User clicked logout button');
    startNavigation(); // Show spinner briefly
    onLogout();
    setIsOpen(false);
    // Show a brief toast and then navigate
    try {
      showSuccess('Logged out successfully. Redirecting…', 3000);
    } catch {}
    setTimeout(() => {
      navigate('/login', { replace: true });
      console.log('Navigated to login page');
    }, 700);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm"
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
            <User size={16} className="text-white" />
          </div>
        )}
        <span className="hidden sm:block font-medium">
          {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-[9997] overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
            >
              <User size={16} className="text-gray-500" />
              Profile
            </button>

            <button
              onClick={() => { setShowChangePassword(true); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
            >
              <Settings size={16} className="text-gray-500" />
              Settings
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
            >
              <LogOut size={16} className="text-red-500" />
              Logout
            </button>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        defaultEmail={user?.email}
      />
    </div>
  );
};

export default UserProfileDropdown;
