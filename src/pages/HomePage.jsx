import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import Swal from 'sweetalert2';
import {
  Building2,
  Users,
  Code,
  Cloud,
  Brain,
  Shield,
  ArrowRight,
  Star,
  Award,
  Globe,
  Zap,
  Target,
  Heart,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Lightbulb,
  Rocket
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { startNavigation } = useNavigation();

  useEffect(() => {
    // Show SweetAlert for logged-out users after a short delay
    if (!loading && !isAuthenticated) {
      const timer = setTimeout(() => {
        Swal.fire({
          title: 'Welcome to Signavox Technologies!',
          text: 'Please sign in to access all features and apply for positions.',
          icon: 'info',
          confirmButtonText: 'Sign In',
          showCancelButton: true,
          cancelButtonText: 'Continue Browsing',
          confirmButtonColor: '#3B82F6',
          cancelButtonColor: '#6B7280'
        }).then((result) => {
          if (result.isConfirmed) {
            startNavigation();
            navigate('/login');
          }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

      {/* Hero Section - White Shades Background */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Geometric Shapes */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-60 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-100 rounded-full opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-100 rounded-full opacity-60 animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-cyan-100 rounded-full opacity-60 animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-pink-100 rounded-full opacity-60 animate-float" style={{animationDelay: '2.5s'}}></div>
        </div> */}

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Company Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-600 font-medium text-lg">Signavox Technologies</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Shaping the Future of
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  Technology
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join our innovative team and be part of a company that delivers cutting-edge
                digital solutions, cloud technologies, and AI-powered automation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('careers')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Explore Careers
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-semibold text-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Learn More
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      startNavigation();
                      navigate('/login');
                    }}
                    className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Interactive Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  onClick={() => navigate('/jobs')}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Engineering</h3>
                  <p className="text-gray-600 text-sm">Java Developers</p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>View Positions</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  onClick={() => navigate('/jobs')}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                    <Cloud className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Solutions</h3>
                  <p className="text-gray-600 text-sm">DevOps & Infrastructure</p>
                  <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <span>Explore Roles</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  onClick={() => navigate('/jobs')}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI & Automation</h3>
                  <p className="text-gray-600 text-sm">Machine Learning</p>
                  <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                    <span>Join Team</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  onClick={() => navigate('/jobs')}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cybersecurity</h3>
                  <p className="text-gray-600 text-sm">Security Solutions</p>
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Signavox</span> Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are a leading software company dedicated to delivering innovative technology
              solutions that drive business growth and success across various industries.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our <span className="text-blue-600">Mission</span></h3>
              <p className="text-gray-600 leading-relaxed">
                To assist businesses in navigating and thriving within a fast-paced technological
                environment by delivering high-quality services that empower our clients to remain competitive and secure.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our <span className="text-green-600">Values</span></h3>
              <p className="text-gray-600 leading-relaxed">
                We prioritize strong human connections, providing tailored support and guidance.
                We build enduring partnerships that blend innovation with a personal approach.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse-glow">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our <span className="text-purple-600">Vision</span></h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted technology partner, helping businesses achieve sustained
                success in a constantly evolving tech landscape through innovation and excellence.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Digital Transformation</h4>
              <p className="text-sm text-gray-600">Transform your online presence with innovative digital solutions</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Cloud Solutions</h4>
              <p className="text-sm text-gray-600">Scalable and secure cloud solutions for enhanced agility</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Engineering Solutions</h4>
              <p className="text-sm text-gray-600">Advanced engineering solutions tailored to industry demands</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI & Automation</h4>
              <p className="text-sm text-gray-600">Cutting-edge AI and automation technologies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities Section */}
      <section id="careers" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Join Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Growing</span> Team
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We're seeking passionate and talented professionals to join our innovative team.
              Grow your career with us and be part of shaping the future of technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Java Developers</h3>
                    <p className="text-gray-600">
                      We're looking for both frontend and backend Java developers to join our engineering team.
                      Perfect for freshers and experienced candidates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hyderabad Location</h3>
                    <p className="text-gray-600">
                      Work from our modern office in Hyderabad with a collaborative and innovative work culture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Career Growth</h3>
                    <p className="text-gray-600">
                      Opportunities to learn and grow with live projects, career development, and mentorship programs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What We Offer
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Friendly work culture
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Live project experience
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Career development
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Mentorship programs
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Current Openings</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">Senior Java Developer</h4>
                  <p className="text-gray-300 text-sm mb-2">Full-time • Hyderabad • 5+ years</p>
                  <p className="text-blue-200 text-sm">Backend development, Spring Boot, Microservices</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">Frontend Java Developer</h4>
                  <p className="text-gray-300 text-sm mb-2">Full-time • Hyderabad • 2+ years</p>
                  <p className="text-blue-200 text-sm">React, Angular, JavaScript, TypeScript</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">Java Developer (Fresher)</h4>
                  <p className="text-gray-300 text-sm mb-2">Full-time • Hyderabad • Entry Level</p>
                  <p className="text-blue-200 text-sm">Java, Spring, Database, Web Technologies</p>
                </div>
              </div>
              <button
                onClick={() => {
                  startNavigation();
                  navigate('/jobs');
                }}
                className="w-full mt-6 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                View All Positions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            Ready to Join Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Team</span>?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Take the next step in your career and be part of our innovative journey.
            We're looking for passionate individuals who want to make a difference in the tech world.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              // onClick={() => scrollToSection('careers')}
              onClick={() => navigate('/jobs')}
              className="group px-12 cursor-pointer py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-xl text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Apply Now
              <ArrowRight className="inline-block ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => {
                  startNavigation();
                  navigate('/register');
                }}
                className="px-12 py-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold text-xl hover:bg-white/30 transition-all duration-300 text-center"
              >
                Join Us
              </button>
            )}
            <button
              onClick={() => scrollToSection('about')}
              className="px-12 py-6 border-2 border-white/30 text-white rounded-2xl font-semibold text-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">50+</h3>
              <p className="text-blue-200">Team Members</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">100+</h3>
              <p className="text-blue-200">Projects Delivered</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">98%</h3>
              <p className="text-blue-200">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => scrollToSection('careers')}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center group animate-pulse-glow"
        >
          <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;