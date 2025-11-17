import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  ArrowRight, 
  Building2, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Clock
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigation } from '../contexts/NavigationContext';
import baseUrl from '../api';
import loginBG from '../assets/login_bg.png';

const ForgotPasswordPage = () => {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const { startNavigation } = useNavigation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'email':
    setEmail(value);
        break;
      case 'otp':
        setOtp(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStep(2);
        setOtpTimer(300); // 5 minutes timer
        showSuccess('OTP sent to your email!');
        
        // Start countdown timer
        const timer = setInterval(() => {
          setOtpTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showError(result.message || 'Failed to send OTP. Please try again.');
        setErrors({ submit: result.message || 'Failed to send OTP' });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      showError('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          otp,
          newPassword 
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showSuccess('Password reset successfully! Redirecting to login...');
        setIsLoading(true); // Show spinner during reset and redirect

        // Reset form fields and state
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpTimer(0);

        // Wait 2 seconds, then navigate to login page
        startNavigation(); // Show navigation spinner
        setTimeout(() => {
          setIsLoading(false); // Hide spinner just before navigation (optional, but safe)
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        showError(result.message || 'Failed to reset password. Please try again.');
        setErrors({ submit: result.message || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showError('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={loginBG}
          alt="Forgot Password background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ filter: 'brightness(0.6) blur(1px)' }}
        />
        {/* Creative overlay with branding gradients & effects */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Subtle grid pattern */}
          <div
            className="absolute left-0 top-0 w-full h-full opacity-10"
          style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat"
            }}
          />
          {/* Decorative floating shapes */}
          <div className="hidden sm:block absolute top-20 left-16 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-800 opacity-30 blur-2xl animate-pulse"></div>
          <div className="hidden sm:block absolute right-8 bottom-32 w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-800 to-purple-400 opacity-25 blur-3xl animate-bounce"></div>
          <div className="hidden sm:block absolute bottom-10 left-64 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-sky-400 opacity-20 blur-lg animate-pulse"></div>
      </div>
      </div>

      <div className="relative w-full max-w-md z-20">
        {/* Forgot Password Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="hidden sm:flex w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mx-auto mb-6 shadow-lg">
              {step === 1 ? <Mail className="w-10 h-10 text-white" /> : <Shield className="w-10 h-10 text-white" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {step === 1 ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {step === 1 
                ? 'No worries! Enter your email and we\'ll send you an OTP.' 
                : 'Enter the OTP sent to your email and create a new password.'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            /* Step 1: Email Form */
            <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-5">
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
                    value={email}
                    onChange={handleInputChange}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP & Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-5">
              {/* Email Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">OTP sent to: {email}</span>
                </div>
              </div>

              {/* OTP Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleInputChange}
                    maxLength="6"
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center tracking-widest ${
                      errors.otp ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="000000"
                  />
                </div>
                {errors.otp && (
                  <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.otp}</span>
                  </div>
                )}
                {otpTimer > 0 && (
                  <div className="mt-1.5 flex items-center gap-1 text-blue-600 text-xs sm:text-sm">
                    <Clock className="w-4 h-4" />
                    <span>OTP expires in {formatTime(otpTimer)}</span>
                  </div>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={newPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.newPassword ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.newPassword}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otpTimer === 0}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Resetting Password...
            </div>
                ) : (
                  <>
                    Reset Password
                    <CheckCircle className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>

              {/* Back to Step 1 */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm sm:text-base transition-colors"
              >
                ← Back to Email
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Remember your password?{' '}
              <button 
                onClick={() => {
                  startNavigation();
                  navigate('/login');
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
