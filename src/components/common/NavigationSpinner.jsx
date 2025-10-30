import { useNavigation } from '../../contexts/NavigationContext';

const NavigationSpinner = () => {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Simple transparent background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Simple spinner container */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Clean single-ring spinner */}
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-3 border-gray-200 border-t-blue-500 animate-spin"></div>
        </div>
        
        {/* Simple loading text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationSpinner;
