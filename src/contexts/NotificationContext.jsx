import { createContext, useContext, useState } from 'react';
import Notification from '../components/common/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration = 5000) => {
    return addNotification({ type: 'success', message, duration });
  };

  const showError = (message, duration = 5000) => {
    return addNotification({ type: 'error', message, duration });
  };

  const showWarning = (message, duration = 5000) => {
    return addNotification({ type: 'warning', message, duration });
  };

  const showInfo = (message, duration = 5000) => {
    return addNotification({ type: 'info', message, duration });
  };

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};
