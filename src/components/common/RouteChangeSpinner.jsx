import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';

const RouteChangeSpinner = () => {
  const location = useLocation();
  const { startNavigation } = useNavigation();

  useEffect(() => {
    // Trigger a brief global spinner on every route change
    startNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default RouteChangeSpinner;


