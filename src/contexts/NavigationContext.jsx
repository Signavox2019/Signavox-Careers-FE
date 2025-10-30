import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = () => {
    setIsNavigating(true);
    // Auto-hide after 500ms for split second effect
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      startNavigation,
      stopNavigation
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
