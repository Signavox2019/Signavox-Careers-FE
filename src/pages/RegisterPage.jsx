import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  ArrowRight, 
  Building2, 
  Users,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Briefcase,
  GraduationCap,
  Code
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigation } from '../contexts/NavigationContext';
import baseUrl from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { startNavigation } = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    pan: '',
    gender: '',
    DOB: '',
    permanentAddress: '',
    currentAddress: '',
    socialLinks: { linkedin: '', github: '' },
    skills: [],
    education: [],
    experienced: false,
    experiences: [],
    resume: null,
    profileImage: null,
    agreeToTerms: false
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [educationInput, setEducationInput] = useState({ 
    programOrDegree: '', 
    branchOrSpecialization: '', 
    institution: '', 
    boardOrUniversity: '', 
    passedYear: '', 
    percentageOrCGPA: '' 
  });
  const [experienceInput, setExperienceInput] = useState({ 
    companyName: '', 
    designation: '', 
    startDate: '', 
    endDate: '', 
    responsibilities: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerStatus, setRegisterStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const addSkill = () => {
    if (skillsInput.trim() && !formData.skills.includes(skillsInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillsInput.trim()]
      }));
      setSkillsInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addEducation = () => {
    if (educationInput.institution && educationInput.programOrDegree && educationInput.passedYear) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationInput }]
      }));
      setEducationInput({ 
        programOrDegree: '', 
        branchOrSpecialization: '', 
        institution: '', 
        boardOrUniversity: '', 
        passedYear: '', 
        percentageOrCGPA: '' 
      });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (experienceInput.companyName && experienceInput.designation && experienceInput.startDate) {
      setFormData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...experienceInput }]
      }));
      setExperienceInput({ 
        companyName: '', 
        designation: '', 
        startDate: '', 
        endDate: '', 
        responsibilities: '' 
      });
    }
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.pan) {
      newErrors.pan = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else if (!['male', 'female', 'other'].includes(formData.gender.toLowerCase())) {
      newErrors.gender = 'Please select a valid gender';
    }
    
    if (!formData.DOB) {
      newErrors.DOB = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getStepProgress = () => {
    let completedSections = 0;
    let totalSections = 3;

    // Step 1: Personal & Contact Information
    if (formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.pan) {
      completedSections++;
    }

    // Step 2: Skills, Education & Experience
    if (formData.skills.length > 0 && formData.education.length > 0) {
      if (formData.experienced) {
        if (formData.experiences.length > 0) {
          completedSections++;
        }
      } else {
        completedSections++;
      }
    }

    // Step 3: Resume & Terms
    if (formData.resume && formData.agreeToTerms) {
      completedSections++;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    
    if (formData.education.length === 0) {
      newErrors.education = 'At least one education entry is required';
    }
    
    if (formData.experienced && formData.experiences.length === 0) {
      newErrors.experiences = 'Experience details are required for experienced candidates';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('middleName', formData.middleName || '');
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('pan', formData.pan || '');
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('DOB', formData.DOB);
      formDataToSend.append('permanentAddress', formData.permanentAddress || '');
      formDataToSend.append('currentAddress', formData.currentAddress || '');
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('education', JSON.stringify(formData.education));
      formDataToSend.append('experienced', formData.experienced);
      formDataToSend.append('experiences', JSON.stringify(formData.experiences));
      
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }
      
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setRegisterStatus('success');
        showSuccess('Registration successful! Redirecting to login...');
        // Navigate to login page after successful registration
        startNavigation(); // Show spinner
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setRegisterStatus('error');
        showError(result.message || 'Registration failed. Please try again.');
        setErrors({ submit: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterStatus('error');
      showError('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Personal Information
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.firstName ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.firstName}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your middle name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.lastName ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.lastName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6 text-green-600" />
          Contact Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.phoneNumber ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phoneNumber && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.gender ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.gender}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.DOB ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.DOB && (
              <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.DOB}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.pan ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="ABCDE1234F"
            />
          </div>
          {errors.pan && (
            <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.pan}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permanent Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter your permanent address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter your current address"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Linkedin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, github: e.target.value }
                }))}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-600" />
          Technical Skills *
        </h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            placeholder="Enter a skill (e.g., Java, React, Python...)"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200"
          >
            Add
          </button>
        </div>
        
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.skills && (
          <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.skills}</span>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          Education Details *
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Program/Degree *</label>
            <select
              value={educationInput.programOrDegree}
              onChange={(e) => setEducationInput(prev => ({ ...prev, programOrDegree: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Select Program/Degree</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
              <option value="BTech">BTech</option>
              <option value="MTech">MTech</option>
              <option value="MSC">MSC</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input
            type="text"
            value={educationInput.branchOrSpecialization}
            onChange={(e) => setEducationInput(prev => ({ ...prev, branchOrSpecialization: e.target.value }))}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Branch/Specialization"
          />
          <input
            type="text"
            value={educationInput.institution}
            onChange={(e) => setEducationInput(prev => ({ ...prev, institution: e.target.value }))}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Institution Name *"
          />
          <input
            type="text"
            value={educationInput.boardOrUniversity}
            onChange={(e) => setEducationInput(prev => ({ ...prev, boardOrUniversity: e.target.value }))}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Board/University *"
          />
          <input
            type="number"
            value={educationInput.passedYear}
            onChange={(e) => setEducationInput(prev => ({ ...prev, passedYear: e.target.value }))}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Passed Year *"
            min="1950"
            max="2030"
          />
          <input
            type="text"
            value={educationInput.percentageOrCGPA}
            onChange={(e) => setEducationInput(prev => ({ ...prev, percentageOrCGPA: e.target.value }))}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Percentage/CGPA"
          />
        </div>
        
        <button
          type="button"
          onClick={addEducation}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 mb-4"
        >
          Add Education
        </button>
        
        {formData.education.length > 0 && (
          <div className="space-y-2">
            {formData.education.map((edu, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {edu.programOrDegree} {edu.branchOrSpecialization && `- ${edu.branchOrSpecialization}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {edu.institution} ({edu.passedYear}) - {edu.percentageOrCGPA}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.education && (
          <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.education}</span>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange-600" />
          Work Experience
        </h3>
        
        <div className="mb-4">
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={formData.experienced}
              onChange={(e) => setFormData(prev => ({ ...prev, experienced: e.target.checked }))}
              className="w-4 h-4 text-orange-600 bg-gray-50 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">I have work experience</span>
          </label>
        </div>
        
        {formData.experienced && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={experienceInput.companyName}
                onChange={(e) => setExperienceInput(prev => ({ ...prev, companyName: e.target.value }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Company Name *"
              />
              <input
                type="text"
                value={experienceInput.designation}
                onChange={(e) => setExperienceInput(prev => ({ ...prev, designation: e.target.value }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Job Designation *"
              />
              <input
                type="date"
                value={experienceInput.startDate}
                onChange={(e) => setExperienceInput(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Start Date *"
              />
              <input
                type="date"
                value={experienceInput.endDate}
                onChange={(e) => setExperienceInput(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="End Date (Leave empty if current)"
              />
            </div>
            
            <textarea
              value={experienceInput.responsibilities}
              onChange={(e) => setExperienceInput(prev => ({ ...prev, responsibilities: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none mb-4"
              placeholder="Job responsibilities and achievements..."
            />
            
            <button
              type="button"
              onClick={addExperience}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 mb-4"
            >
              Add Experience
            </button>
            
            {formData.experiences.length > 0 && (
              <div className="space-y-2">
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{exp.designation} at {exp.companyName}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {errors.experiences && (
          <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.experiences}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Resume Upload */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-green-600" />
          Resume Upload *
        </h3>
        
        <div className="relative">
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="flex items-center justify-center w-full px-6 py-8 bg-white border-2 border-dashed border-green-300 rounded-xl text-gray-700 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all duration-200"
          >
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {formData.resume ? formData.resume.name : 'Click to upload your resume'}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
          </label>
        </div>
        {errors.resume && (
          <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.resume}</span>
          </div>
        )}
      </div>

      {/* Profile Image Upload */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" />
          Profile Image (Optional)
        </h3>
        
        <div className="relative">
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            className="flex items-center justify-center w-full px-6 py-8 bg-white border-2 border-dashed border-purple-300 rounded-xl text-gray-700 cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
          >
            <div className="text-center">
              <User className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {formData.profileImage ? formData.profileImage.name : 'Click to upload your profile image'}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-gray-600" />
          Terms and Conditions
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
            />
            <div className="text-sm text-gray-700">
              <p className="mb-2">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Privacy Policy
                </a>
              </p>
              <p className="text-gray-600">
                By submitting this form, I consent to Signavox Technologies processing my personal data 
                for recruitment purposes and understand that my information will be stored securely.
              </p>
            </div>
          </label>
        </div>
        {errors.agreeToTerms && (
          <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.agreeToTerms}</span>
          </div>
        )}
      </div>
    </div>
  );

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
      {/* <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-100 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-100 rounded-full opacity-20 animate-bounce"></div> */}

      <div className="relative w-full max-w-4xl">
        {/* Registration Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Team
            </h1>
            <p className="text-gray-600">
              Create your <span className="text-blue-600 font-semibold">Signavox</span> account
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-600">{getStepProgress()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Success Message */}
          {registerStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Registration successful! Check your email for login credentials.</span>
            </div>
          )}

          {/* Error Message */}
          {registerStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit || 'Registration failed. Please try again.'}</span>
            </div>
          )}

          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Next
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
