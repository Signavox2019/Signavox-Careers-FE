import { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  Building2, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import baseUrl from '../api';

const ForgotPasswordPage = () => {
  const { showSuccess, showError } = useNotification();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        showSuccess('Password reset instructions sent to your email!');
      } else {
        showError(result.message || 'Failed to send reset instructions. Please try again.');
        setErrors({ submit: result.message || 'Failed to send reset instructions' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showError('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image - Career Growth Theme */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='800' viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='careerGradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23059669;stop-opacity:0.08'/%3E%3Cstop offset='30%25' style='stop-color:%230F766E;stop-opacity:0.08'/%3E%3Cstop offset='60%25' style='stop-color:%231E40AF;stop-opacity:0.08'/%3E%3Cstop offset='100%25' style='stop-color:%237C2D12;stop-opacity:0.08'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23careerGradient)'/%3E%3C!-- Career Growth Elements --%3E%3Cg fill='%23059669' fill-opacity='0.12'%3E%3C!-- Ladder/Steps representing career growth --%3E%3Crect x='100' y='600' width='20' height='100' rx='2'/%3E%3Crect x='120' y='580' width='20' height='120' rx='2'/%3E%3Crect x='140' y='560' width='20' height='140' rx='2'/%3E%3Crect x='160' y='540' width='20' height='160' rx='2'/%3E%3Crect x='180' y='520' width='20' height='180' rx='2'/%3E%3C!-- Success indicators --%3E%3Ccircle cx='300' cy='200' r='15'/%3E%3Ccircle cx='350' cy='250' r='20'/%3E%3Ccircle cx='400' cy='300' r='25'/%3E%3Ccircle cx='450' cy='350' r='30'/%3E%3C!-- Growth arrows --%3E%3Cpath d='M600 500 L650 450 L700 500 L650 550 Z' fill='%230F766E' fill-opacity='0.15'/%3E%3Cpath d='M750 400 L800 350 L850 400 L800 450 Z' fill='%230F766E' fill-opacity='0.15'/%3E%3Cpath d='M900 300 L950 250 L1000 300 L950 350 Z' fill='%230F766E' fill-opacity='0.15'/%3E%3C!-- Professional building blocks --%3E%3Crect x='200' y='300' width='60' height='60' rx='8' fill='%231E40AF' fill-opacity='0.1'/%3E%3Crect x='280' y='280' width='60' height='80' rx='8' fill='%231E40AF' fill-opacity='0.1'/%3E%3Crect x='360' y='260' width='60' height='100' rx='8' fill='%231E40AF' fill-opacity='0.1'/%3E%3Crect x='440' y='240' width='60' height='120' rx='8' fill='%231E40AF' fill-opacity='0.1'/%3E%3C!-- Achievement stars --%3E%3Cpath d='M800 100 L810 120 L830 120 L815 135 L820 155 L800 140 L780 155 L785 135 L770 120 L790 120 Z' fill='%237C2D12' fill-opacity='0.12'/%3E%3Cpath d='M900 150 L905 160 L915 160 L908 170 L910 180 L900 170 L890 180 L892 170 L885 160 L895 160 Z' fill='%237C2D12' fill-opacity='0.12'/%3E%3Cpath d='M1000 200 L1005 210 L1015 210 L1008 220 L1010 230 L1000 220 L990 230 L992 220 L985 210 L995 210 Z' fill='%237C2D12' fill-opacity='0.12'/%3E%3C!-- Network connections --%3E%3Cline x1='100' y1='200' x2='200' y2='250' stroke='%23059669' stroke-width='2' stroke-opacity='0.1'/%3E%3Cline x1='200' y1='250' x2='300' y2='200' stroke='%23059669' stroke-width='2' stroke-opacity='0.1'/%3E%3Cline x1='300' y1='200' x2='400' y2='250' stroke='%23059669' stroke-width='2' stroke-opacity='0.1'/%3E%3Cline x1='400' y1='250' x2='500' y2='200' stroke='%23059669' stroke-width='2' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-100 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-100 rounded-full opacity-20 animate-bounce"></div>

      <div className="relative w-full max-w-md">
        {/* Forgot Password Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {!isSubmitted ? (
            /* Forgot Password Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Instructions...
                  </div>
                ) : (
                  <>
                    Send Reset Instructions
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
