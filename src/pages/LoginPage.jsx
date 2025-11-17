import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Building2, 
  Users,
  Github,
  Linkedin,
  Twitter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigation } from '../contexts/NavigationContext';
import baseUrl from '../api';
import loginBG from '../assets/login_bg.png'

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { startNavigation } = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Use AuthContext to store token and user data
        login(result.user, result.token);
        
        // Show success notification
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard or home page
        startNavigation(); // Show spinner
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        showError(result.message || 'Login failed. Please check your credentials.');
        setErrors({ submit: result.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
      >
        {/* Fullscreen, creative, and professional background */}
        <img
          src={loginBG}
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ filter: 'brightness(0.7) blur(1px)' }}
        />
        {/* Creative overlay with branding gradients & effects */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Dark translucent overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/70" /> */}
          {/* Subtle top-left grid dots */}
          <div
            className="absolute left-0 top-0 w-full h-full opacity-10"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat"
            }}
          />
          {/* Decorative floating shapes */}
          {/* <div className="absolute top-20 left-16 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-800 opacity-40 blur-2xl animate-pulse"></div>
          <div className="absolute right-8 bottom-32 w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-800 to-purple-400 opacity-30 blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 left-64 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-sky-400 opacity-25 blur-lg animate-pulse"></div> */}
          {/* Elegant grid lines */}
          {/* <div className="absolute inset-0 pointer-events-none z-20">
            <svg width="100%" height="100%" className="opacity-5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lines" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M80 0 L0 80" stroke="#fff" strokeWidth="1" />
                  <path d="M0 0 L80 80" stroke="#fff" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lines)" />
            </svg>
          </div> */}
        </div>
      </div>

      <div className="relative w-full max-w-md z-20">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to your <span className="text-blue-600 font-semibold">Signavox</span> account
            </p>
          </div>


          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end pt-1">
              <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
