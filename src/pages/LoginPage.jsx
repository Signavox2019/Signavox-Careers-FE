import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigation } from "../contexts/NavigationContext";
import baseUrl from "../api";
import loginBG from "../assets/login_bg.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { startNavigation } = useNavigation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Use AuthContext to store token and user data
        login(result.user, result.token);

        // Show success notification
        showSuccess("Login successful! Redirecting...");

        // Redirect to dashboard or home page
        startNavigation(); // Show spinner
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showError(
          result.message || "Login failed. Please check your credentials."
        );
        setErrors({ submit: result.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Network error. Please try again.");
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black">
    //   {/* Background Image */}
    //   <div
    //     className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
    //   >
    //     {/* Fullscreen, creative, and professional background */}
    //     <img
    //       src={loginBG}
    //       alt="Login background"
    //       className="absolute inset-0 w-full h-full object-cover object-center z-0"
    //       style={{ filter: 'brightness(0.7) blur(1px)' }}
    //     />
    //     {/* Creative overlay with branding gradients & effects */}
    //     <div className="absolute inset-0 z-10 pointer-events-none">
    //       {/* Dark translucent overlay */}
    //       {/* <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/70" /> */}
    //       {/* Subtle top-left grid dots */}
    //       <div
    //         className="absolute left-0 top-0 w-full h-full opacity-10"
    //         style={{
    //           backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    //           backgroundRepeat: "repeat"
    //         }}
    //       />
    //       {/* Decorative floating shapes */}
    //       {/* <div className="absolute top-20 left-16 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-800 opacity-40 blur-2xl animate-pulse"></div>
    //       <div className="absolute right-8 bottom-32 w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-800 to-purple-400 opacity-30 blur-3xl animate-blob"></div>
    //       <div className="absolute bottom-10 left-64 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-sky-400 opacity-25 blur-lg animate-pulse"></div> */}
    //       {/* Elegant grid lines */}
    //       {/* <div className="absolute inset-0 pointer-events-none z-20">
    //         <svg width="100%" height="100%" className="opacity-5" xmlns="http://www.w3.org/2000/svg">
    //           <defs>
    //             <pattern id="lines" width="80" height="80" patternUnits="userSpaceOnUse">
    //               <path d="M80 0 L0 80" stroke="#fff" strokeWidth="1" />
    //               <path d="M0 0 L80 80" stroke="#fff" strokeWidth="1" />
    //             </pattern>
    //           </defs>
    //           <rect width="100%" height="100%" fill="url(#lines)" />
    //         </svg>
    //       </div> */}
    //     </div>
    //   </div>

    //   <div className="relative w-full max-w-md z-20">
    //     {/* Login Card */}
    //     <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 overflow-hidden">
    //       {/* Header */}
    //       <div className="text-center mb-4 sm:mb-6">
    //         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
    //           <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
    //         </div>
    //         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
    //           Welcome Back
    //         </h1>
    //         <p className="text-sm sm:text-base text-gray-600">
    //           Sign in to your <span className="text-blue-600 font-semibold">Signavox</span> account
    //         </p>
    //       </div>

    //       {/* Login Form */}
    //       <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
    //         {/* Email Field */}
    //         <div>
    //           <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
    //             Email Address
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
    //             </div>
    //             <input
    //               type="email"
    //               name="email"
    //               value={formData.email}
    //               onChange={handleInputChange}
    //               className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
    //                 errors.email ? 'border-red-400' : 'border-gray-200'
    //               }`}
    //               placeholder="Enter your email"
    //             />
    //           </div>
    //           {errors.email && (
    //             <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
    //               <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
    //               <span>{errors.email}</span>
    //             </div>
    //           )}
    //         </div>

    //         {/* Password Field */}
    //         <div>
    //           <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
    //             Password
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
    //             </div>
    //             <input
    //               type={showPassword ? 'text' : 'password'}
    //               name="password"
    //               value={formData.password}
    //               onChange={handleInputChange}
    //               className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
    //                 errors.password ? 'border-red-400' : 'border-gray-200'
    //               }`}
    //               placeholder="Enter your password"
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
    //             >
    //               {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
    //             </button>
    //           </div>
    //           {errors.password && (
    //             <div className="mt-1.5 flex items-center gap-1 text-red-500 text-xs sm:text-sm">
    //               <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
    //               <span>{errors.password}</span>
    //             </div>
    //           )}
    //         </div>

    //         {/* Forgot Password */}
    //         <div className="flex items-center justify-end pt-1">
    //           <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors">
    //             Forgot password?
    //           </Link>
    //         </div>

    //         {/* Login Button */}
    //         <button
    //           type="submit"
    //           disabled={isLoading}
    //           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    //         >
    //           {isLoading ? (
    //             <div className="flex items-center justify-center gap-2">
    //               <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
    //               <span>Signing in...</span>
    //             </div>
    //           ) : (
    //             <>
    //               Sign In
    //               <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
    //             </>
    //           )}
    //         </button>
    //       </form>

    //       {/* Sign Up Link */}
    //       <div className="text-center mt-4 sm:mt-6">
    //         <p className="text-xs sm:text-sm text-gray-600">
    //           Don't have an account?{' '}
    //           <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
    //             Sign up here
    //           </Link>
    //         </p>
    //       </div>
    //     </div>

    //   </div>
    // </div>

    //  started from from here

    <>
      <style>{`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
    }
  `}</style>

      {/* PAGE WRAPPER */}
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-[60%_40%] bg-slate-50">
        <div
          className="
    hidden xl:flex relative
    h-screen w-full
    bg-cover bg-center bg-no-repeat
  "
          style={{
            backgroundImage:
            

                            "url('https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",

                          
                          }}
        >
          {/* OVERLAY */}
          {/* <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" /> */}

{/* <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/90 to-black/50" /> */}

<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/30" />

          {/* CONTENT */}
<div className="relative z-10 flex flex-col justify-center px-16 w-full">
            <h1 className="text-5xl font-semibold text-gray-300 leading-tight">
              Build your career with
       <span
  className="
    block mt-4
    text-6xl 2xl:text-7xl
    font-bold leading-[1.3]
    break-words
    bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600
    bg-clip-text text-transparent animate-gradient
  "
>

                Signavox Technologies
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 max-w-2xl ">
              Be part of teams building practical technology solutions across
              <span className="font-medium text-white">
                {" "}
                Cloud, AI, Fintech, Healthcare
              </span>{" "}
              and Enterprise platforms.
            </p>

            <p className="mt-4 text-lg text-gray-200 max-w-2xl ">
              Work on meaningful projects, collaborate with experienced teams,
              and grow your career in a professional environment.
            </p>

            <div className="mt-6 w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="relative flex items-center justify-center bg-gray-50 h-screen ">
          {/* Divider */}
          <div className="hidden xl:block absolute left-0 top-0 h-full  bg-gray-200" />

          {/* CARD FULL HEIGHT */}
          <div className="w-full h-full flex items-center">
            <div
              className="
                w-full h-full bg-white
                rounded-none 
                border-l border-gray-200
                shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]
                p-8 flex flex-col justify-center
              "
            >
              {/* HEADER */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Building2 className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900">
                  Career Portal Login
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Sign in to continue with{" "}
                  <span className="font-semibold text-blue-600">Signavox</span>
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        errors.email ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border rounded-lg outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-400 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        errors.password ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border rounded-lg outline-none focus:ring-2 ${
                        errors.password
                          ? "border-red-400 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold shadow-md"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="text-center mt-6 text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
