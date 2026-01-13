import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Notification from '../components/common/Notification';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api';
import EditPersonalDetailsModal from '../components/profile/EditPersonalDetailsModal';
import EducationModal from '../components/profile/EducationModal';
import CertificationModal from '../components/profile/CertificationModal';
import ExperienceModal from '../components/profile/ExperienceModal';

const ProfilePage = () => {
  const { isAuthenticated, logout, checkTokenValidity } = useAuth();
  const navigate = useNavigate();
  const { startNavigation, stopNavigation } = useNavigation();
  const [profileData, setProfileData] = useState(() => {
    try {
      const cached = localStorage.getItem('userData');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('profileActiveTab') || 'personal');
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('profileActiveTab', tabId);
    } catch {
      // ignore storage errors
    }
  };
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [resumeData, setResumeData] = useState(() => ({
    resumeUrl: profileData?.resumeUrl || null
  }));
  const [resumeLoading, setResumeLoading] = useState(false);
  const [notif, setNotif] = useState({ visible: false, type: 'info', message: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Local editable copies and form state for CRUD sections
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [certificationList, setCertificationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [experiencedFlag, setExperiencedFlag] = useState(() => profileData?.experienced ?? ((profileData?.experiences || []).length > 0));
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState(false);

  const emptyEdu = { programOrDegree: '', branchOrSpecialization: '', institution: '', boardOrUniversity: '', passedYear: '', percentageOrCGPA: '' };
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);

  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  const [newSkill, setNewSkill] = useState('');

  // Helpers (hoisted) - used in useEffect below
  function parseYear(val) {
    if (!val) return -Infinity;
    const match = String(val).match(/\d{4}/);
    return match ? parseInt(match[0], 10) : -Infinity;
  }
  function sortEducation(list) {
    return [...(list || [])].sort((a, b) => parseYear(b?.passedYear) - parseYear(a?.passedYear));
  }

  // Format experience dates as Mon YYYY, handling "Present"
  function formatMonthYear(value) {
    if (!value) return '—';
    if (typeof value === 'string' && /present/i.test(value)) return 'Present';
    const isoMatch = typeof value === 'string' && value.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const monthIndex = Math.max(0, Math.min(11, parseInt(isoMatch[2], 10) - 1));
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[monthIndex]} ${year}`;
    }
    const date = new Date(value);
    if (!isNaN(date)) {
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }
    return String(value);
  }

  // Get social media icon component
  function getSocialIcon(type) {
    const icons = {
      linkedin: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      github: (
        <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
        </svg>
      ),
      twitter: (
        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      facebook: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      youtube: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      portfolio: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      other: (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    };
    return icons[type] || icons.other;
  }

  // Get social media label
  function getSocialLabel(type) {
    const labels = {
      linkedin: 'LinkedIn',
      github: 'GitHub',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      portfolio: 'Portfolio/Website',
      other: 'Other'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  // Get social media background color
  function getSocialBgColor(type) {
    const colors = {
      linkedin: 'bg-blue-50 border-blue-100',
      github: 'bg-gray-50 border-gray-100',
      twitter: 'bg-blue-50 border-blue-100',
      facebook: 'bg-blue-50 border-blue-100',
      instagram: 'bg-pink-50 border-pink-100',
      youtube: 'bg-red-50 border-red-100',
      portfolio: 'bg-indigo-50 border-indigo-100',
      other: 'bg-gray-50 border-gray-100'
    };
    return colors[type] || colors.other;
  }

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          setError('No authentication token found');
          return;
        }
        // Validate token first
        try {
          const validateRes = await apiService.validateToken(token);
          if (validateRes?.message === 'Invalid or expired token') {
            setNotif({ visible: true, type: 'error', message: 'Invalid or expired token. Redirecting to login…' });
            // Clear any auth remnants
            try { logout(); } catch { }
            // Show spinner briefly then navigate
            startNavigation();
            setTimeout(() => {
              stopNavigation();
              navigate('/login');
            }, 1500);
            return;
          }
          if (validateRes?.success) {
            // mark user as valid in context/local storage; do not clear on transient errors
            try { await checkTokenValidity(); } catch { }
          }
        } catch (e) {
          // On transient errors, don't log out. Proceed to try fetching profile.
        }

        const response = await apiService.getUserProfile(token);
        console.log('GET /users/me response:', response);
        if (response && response.user) {
          setProfileData(response.user);
          // Education is fetched separately via education API
          setSkillsList(response.user.skills || []);
          setCertificationList(response.user.certifications || []);
          setExperienceList(response.user.experiences || []);
          setExperiencedFlag(response.user.experienced ?? ((response.user.experiences || []).length > 0));
          // keep cache fresh for next load
          try { localStorage.setItem('userData', JSON.stringify(response.user)); } catch { }
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  // Fetch education data
  useEffect(() => {
    let isMounted = true;
    const fetchEducation = async () => {
      if (!isMounted) return;
      setLoadingEducation(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          return;
        }
        const response = await apiService.getEducation(token);
        if (response && Array.isArray(response)) {
          setEducationList(sortEducation(response));
        }
      } catch (err) {
        console.error('Error fetching education:', err);
      } finally {
        if (isMounted) setLoadingEducation(false);
      }
    };

    if (isAuthenticated) {
      fetchEducation();
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // Fetch skills data
  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      if (!isMounted) return;
      setLoadingSkills(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;
        const response = await apiService.getSkills(token);
        if (!isMounted) return;
        const skills = Array.isArray(response?.skills) ? response.skills : Array.isArray(response) ? response : [];
        setSkillsList(skills);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        if (isMounted) setLoadingSkills(false);
      }
    };
    if (isAuthenticated) {
      fetchSkills();
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // Fetch certifications data
  useEffect(() => {
    let isMounted = true;
    const fetchCertifications = async () => {
      if (!isMounted) return;
      setLoadingCertifications(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;
        const response = await apiService.getCertifications(token);
        if (!isMounted) return;
        const certs = Array.isArray(response?.certifications) ? response.certifications : Array.isArray(response) ? response : [];
        setCertificationList(certs);
      } catch (err) {
        console.error('Error fetching certifications:', err);
      } finally {
        if (isMounted) setLoadingCertifications(false);
      }
    };
    if (isAuthenticated) {
      fetchCertifications();
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // Fetch experience data
  // Fetch resume data
  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      if (!isMounted) return;
      setResumeLoading(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;
        const response = await apiService.getResume(token);
        if (!isMounted) return;
        if (response?.resumeUrl) {
          setResumeData({ resumeUrl: response.resumeUrl });
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        if (isMounted) setResumeLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchResume();
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);
  useEffect(() => {
    let isMounted = true;
    const fetchExperience = async () => {
      if (!isMounted) return;
      setLoadingExperience(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;
        const response = await apiService.getExperience(token);
        if (!isMounted) return;
        const experiences = Array.isArray(response?.experiences) ? response.experiences : Array.isArray(response) ? response : [];
        setExperienceList(experiences);
        if (typeof response?.experienced === 'boolean') {
          setExperiencedFlag(response.experienced);
        } else {
          setExperiencedFlag(experiences.length > 0);
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
      } finally {
        if (isMounted) setLoadingExperience(false);
      }
    };
    if (isAuthenticated) {
      fetchExperience();
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  // Never block the page due to loading; we render cached data immediately and refresh in background

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Profile Data</h1>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'education', label: 'Education Details' },
    { id: 'certs_skills', label: 'Skills & Certifications' },
    { id: 'experience', label: 'Experience' },
    { id: 'resume', label: 'Resume' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Safely compute a valid resume URL for the anchor tag
  const resumeLinkCandidate = resumeData?.resumeUrl ?? profileData.resumeUrl ?? profileData.resume?.url ?? profileData.resume?.link;
  const resumeLink = typeof resumeLinkCandidate === 'string' && resumeLinkCandidate.trim().length > 0
    ? resumeLinkCandidate
    : null;

  // Sort helpers defined above (hoisted)

  // Persist helper
  const persistProfile = (updated) => {
    setProfileData(updated);
    try { localStorage.setItem('userData', JSON.stringify(updated)); } catch { }
  };

  // Education modal helpers
  const openNewEducationModal = () => {
    setSelectedEducation(null);
    setIsEducationModalOpen(true);
  };

  const openEditEducationModal = (edu) => {
    setSelectedEducation(edu);
    setIsEducationModalOpen(true);
  };

  const closeEducationModal = () => {
    setSelectedEducation(null);
    setIsEducationModalOpen(false);
  };

  // Education handlers
  const handleSaveEducation = async (formValues) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingEducation(true);
      let response;

      if (selectedEducation?._id) {
        response = await apiService.updateEducation(selectedEducation._id, formValues, token);
      } else {
        response = await apiService.createEducation(formValues, token);
      }

      let updatedEducationList = Array.isArray(response?.education)
        ? response.education
        : Array.isArray(response)
          ? response
          : null;

      if (!updatedEducationList) {
        const fallback = await apiService.getEducation(token);
        updatedEducationList = Array.isArray(fallback?.education)
          ? fallback.education
          : Array.isArray(fallback)
            ? fallback
            : null;
      }

      if (!updatedEducationList) {
        throw new Error('Invalid response from server');
      }

      const sorted = sortEducation(updatedEducationList);
      setEducationList(sorted);
      setNotif({
        visible: true,
        type: 'success',
        message: selectedEducation?._id ? 'Education updated successfully' : 'Education added successfully'
      });
      closeEducationModal();
    } catch (err) {
      console.error('Error saving education:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to save education' });
    } finally {
      setLoadingEducation(false);
    }
  };

  const handleDeleteEducation = async (eduId) => {
    const confirmation = await Swal.fire({
      title: 'Delete education entry?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingEducation(true);
      await apiService.deleteEducation(eduId, token);
      
      // Refresh education list
        const response = await apiService.getEducation(token);
        if (response && Array.isArray(response)) {
          const sorted = sortEducation(response);
          setEducationList(sorted);
          setNotif({ visible: true, type: 'success', message: 'Education deleted successfully' });
        }
    } catch (err) {
      console.error('Error deleting education:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to delete education' });
    } finally {
      setLoadingEducation(false);
    }
  };

  // Skills handlers
  const handleAddSkill = async () => {
    const rawValue = newSkill || '';
    const entries = rawValue
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (entries.length === 0) {
      setNotif({ visible: true, type: 'error', message: 'Enter at least one skill' });
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingSkills(true);
      const response = await apiService.addSkills(entries, token);
      const updatedSkills = Array.isArray(response?.skills) ? response.skills : Array.isArray(response) ? response : null;
      if (!updatedSkills) {
        throw new Error('Invalid response from server');
      }
      setSkillsList(updatedSkills);
      setNewSkill('');
      setNotif({ visible: true, type: 'success', message: 'Skills added successfully' });
    } catch (err) {
      console.error('Error adding skills:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to add skills' });
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    const updatedList = skillsList.filter((item) => item !== skill);
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingSkills(true);
      const response = await apiService.updateSkills(updatedList, token);
      const refreshed = Array.isArray(response?.skills) ? response.skills : Array.isArray(response) ? response : null;
      if (!refreshed) {
        throw new Error('Invalid response from server');
      }
      setSkillsList(refreshed);
      setNotif({ visible: true, type: 'success', message: 'Skill removed' });
    } catch (err) {
      console.error('Error removing skill:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to remove skill' });
    } finally {
      setLoadingSkills(false);
    }
  };

  // Certification modal helpers
  const openNewCertificationModal = () => {
    setSelectedCertification(null);
    setIsCertificationModalOpen(true);
  };

  const openEditCertificationModal = (certification) => {
    setSelectedCertification(certification);
    setIsCertificationModalOpen(true);
  };

  const closeCertificationModal = () => {
    setSelectedCertification(null);
    setIsCertificationModalOpen(false);
  };

  const handleSaveCertification = async (formValues) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingCertifications(true);
      let response;
      if (selectedCertification?._id) {
        response = await apiService.updateCertification(selectedCertification._id, formValues, token);
      } else {
        response = await apiService.createCertification(formValues, token);
      }

      const extractCerts = (payload) => Array.isArray(payload?.certifications) ? payload.certifications : Array.isArray(payload) ? payload : null;
      let updatedCerts = extractCerts(response);
      if (!updatedCerts) {
        const fallback = await apiService.getCertifications(token);
        updatedCerts = extractCerts(fallback);
      }
      if (!updatedCerts) {
        throw new Error('Invalid response from server');
      }

      setCertificationList(updatedCerts);
      setNotif({
        visible: true,
        type: 'success',
        message: selectedCertification?._id ? 'Certification updated successfully' : 'Certification added successfully'
      });
      closeCertificationModal();
    } catch (err) {
      console.error('Error saving certification:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to save certification' });
    } finally {
      setLoadingCertifications(false);
    }
  };

  const handleDeleteCertification = async (certId) => {
    const confirmation = await Swal.fire({
      title: 'Delete certification?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });
    if (!confirmation.isConfirmed) return;

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingCertifications(true);
      await apiService.deleteCertification(certId, token);
      const refreshed = await apiService.getCertifications(token);
      const extractCerts = (payload) => Array.isArray(payload?.certifications) ? payload.certifications : Array.isArray(payload) ? payload : null;
      const updatedCerts = extractCerts(refreshed) || [];
      setCertificationList(updatedCerts);
      setNotif({ visible: true, type: 'success', message: 'Certification deleted successfully' });
    } catch (err) {
      console.error('Error deleting certification:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to delete certification' });
    } finally {
      setLoadingCertifications(false);
    }
  };

  // Experience modal helpers
  const openNewExperienceModal = () => {
    setSelectedExperience(null);
    setIsExperienceModalOpen(true);
  };

  const openEditExperienceModal = (experience) => {
    setSelectedExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const closeExperienceModal = () => {
    setSelectedExperience(null);
    setIsExperienceModalOpen(false);
  };

  const handleSaveExperience = async (formValues) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingExperience(true);
      let response;
      if (selectedExperience?._id) {
        response = await apiService.updateExperience(selectedExperience._id, formValues, token);
      } else {
        response = await apiService.createExperience(formValues, token);
      }

      const extractExperiences = (payload) => Array.isArray(payload?.experiences) ? payload.experiences : Array.isArray(payload) ? payload : null;
      let updatedExperiences = extractExperiences(response);
      let updatedExperiencedFlag = typeof response?.experienced === 'boolean' ? response.experienced : experiencedFlag;

      if (!updatedExperiences) {
        const fallback = await apiService.getExperience(token);
        updatedExperiences = extractExperiences(fallback);
        if (typeof fallback?.experienced === 'boolean') {
          updatedExperiencedFlag = fallback.experienced;
        }
      }

      if (!updatedExperiences) {
        throw new Error('Invalid response from server');
      }

      setExperienceList(updatedExperiences);
      setExperiencedFlag(typeof updatedExperiencedFlag === 'boolean' ? updatedExperiencedFlag : updatedExperiences.length > 0);
      setNotif({
        visible: true,
        type: 'success',
        message: selectedExperience?._id ? 'Experience updated successfully' : 'Experience added successfully'
      });
      closeExperienceModal();
    } catch (err) {
      console.error('Error saving experience:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to save experience' });
    } finally {
      setLoadingExperience(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    const confirmation = await Swal.fire({
      title: 'Delete experience entry?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (!confirmation.isConfirmed) return;

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setNotif({ visible: true, type: 'error', message: 'No authentication token found' });
      return;
    }

    try {
      setLoadingExperience(true);
      await apiService.deleteExperience(experienceId, token);
      const refreshed = await apiService.getExperience(token);
      const extractExperiences = (payload) => Array.isArray(payload?.experiences) ? payload.experiences : Array.isArray(payload) ? payload : null;
      const updatedExperiences = extractExperiences(refreshed) || [];
      setExperienceList(updatedExperiences);
      if (typeof refreshed?.experienced === 'boolean') {
        setExperiencedFlag(refreshed.experienced);
      } else {
        setExperiencedFlag(updatedExperiences.length > 0);
      }
      setNotif({ visible: true, type: 'success', message: 'Experience deleted successfully' });
    } catch (err) {
      console.error('Error deleting experience:', err);
      setNotif({ visible: true, type: 'error', message: err.message || 'Failed to delete experience' });
    } finally {
      setLoadingExperience(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setUploadMessage(null);
    if (!resumeFile) {
      setUploadMessage({ type: 'error', text: 'Please select a resume file.' });
      return;
    }
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setUploadMessage({ type: 'error', text: 'No authentication token found.' });
      return;
    }
    try {
      setUploading(true);
      const isUpdating = Boolean(resumeLink);
      const response = isUpdating
        ? await apiService.updateResume(resumeFile, token)
        : await apiService.uploadResume(resumeFile, token);
      const newUrl = response?.resumeUrl;
      if (!newUrl) {
        throw new Error('Invalid response from server');
      }
      setResumeData({ resumeUrl: newUrl });
      setProfileData((prev) => {
        if (!prev) return prev;
        const next = { ...prev, resumeUrl: newUrl };
        try { localStorage.setItem('userData', JSON.stringify(next)); } catch { }
        return next;
      });
      setUploadMessage({
        type: 'success',
        text: isUpdating ? 'Resume updated successfully.' : 'Resume uploaded successfully.'
      });
      setResumeFile(null);
    } catch (err) {
      console.error('Resume upload error:', err);
      setUploadMessage({ type: 'error', text: err.message || 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePersonalDetails = async (personalData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await apiService.updatePersonalDetails(personalData, token);
    if (response) {
      // Refresh profile data
      const refreshed = await apiService.getUserProfile(token);
      if (refreshed && refreshed.user) {
        setProfileData(refreshed.user);
        // Education is fetched separately via education API
        setSkillsList(refreshed.user.skills || []);
        setCertificationList(refreshed.user.certifications || []);
        setExperienceList(refreshed.user.experiences || []);
        setExperiencedFlag(refreshed.user.experienced ?? ((refreshed.user.experiences || []).length > 0));
        try { localStorage.setItem('userData', JSON.stringify(refreshed.user)); } catch { }
      }
      setNotif({ visible: true, type: 'success', message: 'Personal details updated successfully' });
    }
  };

  const renderEducationContent = () => (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Education Timeline</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Academic Journey</h2>
          <p className="text-sm text-gray-500">Track and manage your academic milestones effortlessly.</p>
        </div>
        <button
          onClick={openNewEducationModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>

      {loadingEducation ? (
        <div className="py-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Loading education data…
          </div>
        </div>
      ) : educationList && educationList.length > 0 ? (
        <ol className="relative border-l-2 border-indigo-200 pl-6 space-y-8">
          {educationList.map((edu, index) => (
            <li key={edu._id || index} className="relative ml-3">
              <span className="absolute -left-[48px] top-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-white shadow-lg z-10" />
              <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition overflow-hidden">
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Program</p>
                      <h3 className="text-xl font-bold text-gray-900">{edu.programOrDegree || 'Program / Degree'}</h3>
                      <p className="text-sm text-gray-500">{edu.branchOrSpecialization || 'Specialization not specified'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                        {edu.passedYear || '—'}
                      </span>
                      {edu.percentageOrCGPA && (
                        <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold">
                          {edu.percentageOrCGPA}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Institution</p>
                      <p className="text-base font-semibold text-gray-900">{edu.institution || '—'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Board / University</p>
                      <p className="text-base font-semibold text-gray-900">{edu.boardOrUniversity || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEditEducationModal(edu)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition disabled:opacity-50"
                      disabled={loadingEducation}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                      disabled={loadingEducation}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl border border-dashed border-slate-200">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No education records yet</h3>
          <p className="text-gray-500 mb-6">Add your academic details to complete your profile.</p>
          <button
            onClick={openNewEducationModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Add your first education
          </button>
        </div>
      )}
    </div>
  );

  const renderSkillsContent = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        {loadingSkills && (
          <span className="text-xs text-indigo-500 flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Syncing…
          </span>
        )}
        <div className="flex items-stretch gap-0">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
            placeholder="Type a skill and press Enter"
            disabled={loadingSkills}
            className="px-4 py-2 border border-r-0 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:text-gray-400"
          />
          <button
            onClick={handleAddSkill}
            disabled={loadingSkills}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-r-lg text-sm hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSkills ? 'Saving…' : 'Add'}
          </button>
        </div>
      </div>
      {loadingSkills ? (
        <div className="text-center py-8 text-sm text-gray-500">Loading skills…</div>
      ) : skillsList && skillsList.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skillsList.map((skill, index) => (
            <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-white text-indigo-700 rounded-full text-sm border border-indigo-200 shadow-sm">
              {skill}
              <button aria-label={`Remove ${skill}`} onClick={() => handleDeleteSkill(skill)} disabled={loadingSkills} className="text-indigo-700/80 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed">×</button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500">No skills added yet. Start by adding one above.</p>
        </div>
      )}
    </div>
  );

  const renderCertificationsContent = () => (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-purple-500">Credentials</p>
          <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
          <p className="text-sm text-gray-500">Showcase your professional achievements and proof of learning.</p>
        </div>
        <button
          onClick={openNewCertificationModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Certification
        </button>
      </div>

      {loadingCertifications ? (
        <div className="text-center py-12 text-sm text-gray-500">Loading certifications…</div>
      ) : certificationList && certificationList.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {certificationList.map((cert) => (
            <div
              key={cert._id || cert.certificationName}
              className="rounded-3xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Certificate</p>
                    <h3 className="text-xl font-bold text-gray-900">{cert.certificationName || 'Certification'}</h3>
                    <p className="text-sm text-gray-500">Issued by {cert.issuedBy || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition"
                        title="View certificate"
                        aria-label="Open certificate link"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 16" />
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => openEditCertificationModal(cert)}
                      className="px-3 py-1.5 text-xs rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                      disabled={loadingCertifications}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCertification(cert._id)}
                      className="px-3 py-1.5 text-xs rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      disabled={loadingCertifications}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Issued Date</p>
                    <p className="text-base font-semibold text-gray-900">{cert.issuedDate ? formatDate(cert.issuedDate) : '—'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Expiry Date</p>
                    <p className="text-base font-semibold text-gray-900">{cert.expiryDate ? formatDate(cert.expiryDate) : 'No expiry'}</p>
                  </div>
                </div>

                {cert.description && (
                  <p className="text-sm text-gray-600 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl border border-dashed border-purple-200">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No certifications yet</h3>
          <p className="text-gray-500 mb-6">Add certificates to highlight your expertise and completed courses.</p>
          <button
            onClick={openNewCertificationModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Add your first certification
          </button>
        </div>
      )}
    </div>
  );

  const renderResumeContent = () => (
    <div className="space-y-6">
      {/* <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 012 2v14l-7-3-7 3V6a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Current Resume</p>
              {resumeLoading ? (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Fetching latest link…
                </p>
              ) : resumeLink ? (
                <div className="space-y-1">
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-indigo-700 hover:underline break-all"
                  >
                    View current resume
                  </a>
                  <p className="text-xs text-gray-400">Synced from your last upload.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">You haven’t uploaded a resume yet.</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Accepted format: PDF only up to 5MB.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => resumeLink && window.open(resumeLink, '_blank', 'noopener')}
              disabled={!resumeLink || resumeLoading}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border ${
                resumeLink ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-50' : 'border-slate-200 text-slate-400 cursor-not-allowed'
              } transition`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 16" />
              </svg>
              Open Resume
            </button>
          </div>
        </div>
      </div> */}

      {resumeLink && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Embedded Preview</p>
              <h3 className="text-lg font-semibold text-gray-900">Quick look</h3>
            </div>
            <span className="text-xs text-gray-400">PDF rendering</span>
          </div>
          <div className="h-[520px] bg-slate-50">
            <iframe
              title="Resume Preview"
              src={resumeLink}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleResumeUpload} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <label className="block lg:col-span-2">
            <div className="w-full p-6 border-2 border-dashed border-indigo-200 rounded-3xl bg-gradient-to-br from-white via-indigo-50 to-purple-50 hover:from-indigo-50 hover:to-purple-50 transition cursor-pointer text-center space-y-2 shadow-inner">
              <p className="text-sm text-gray-600">
                Drag & drop your resume here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                {resumeFile ? resumeFile.name : 'PDF only up to 5MB'}
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="hidden"
            />
          </label>
          <div className="flex flex-col gap-3 justify-center">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 rounded-2xl text-white shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              {uploading ? 'Uploading…' : resumeLink ? 'Update Resume' : 'Upload Resume'}
            </button>
            {uploadMessage && (
              <p className={`${uploadMessage.type === 'success' ? 'text-green-600' : 'text-red-600'} text-sm`}>
                {uploadMessage.text}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );

  const renderExperienceContent = () => (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Career Timeline</p>
          <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
          <p className="text-sm text-gray-500">Document your professional journey and key contributions.</p>
        </div>
        <button
          onClick={openNewExperienceModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {loadingExperience ? (
        <div className="text-center py-16 text-sm text-gray-500">Loading experience…</div>
      ) : experiencedFlag === false && (!experienceList || experienceList.length === 0) ? (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl border border-dashed border-slate-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No work experience yet</h3>
          <p className="text-gray-500">Add your first role to showcase your professional growth.</p>
          <button
            onClick={openNewExperienceModal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Add experience
          </button>
        </div>
      ) : experienceList && experienceList.length > 0 ? (
        <ol className="relative border-l border-slate-200 pl-6 space-y-8">
          {experienceList.map((exp) => (
            <li key={exp._id || `${exp.companyName}-${exp.startDate}`} className="ml-3">
              <span className="absolute -left-3.5 top-2 w-6 h-6 rounded-full bg-gradient-to-br from-slate-900 to-indigo-700 border-4 border-white shadow-lg" />
              <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition overflow-hidden">
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Role</p>
                      <h3 className="text-xl font-bold text-gray-900">{exp.designation || 'Role'}</h3>
                      <p className="text-sm text-gray-500">{exp.companyName || 'Company'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditExperienceModal(exp)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                        disabled={loadingExperience}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp._id)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        disabled={loadingExperience}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {exp.responsibilities && (
                    <p className="text-sm text-gray-600 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                      {exp.responsibilities}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-16 text-sm text-gray-500">No experience entries found.</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {notif.visible && (
        <Notification
          type={notif.type}
          message={notif.message}
          duration={3000}
          onClose={() => setNotif((n) => ({ ...n, visible: false }))}
          isVisible={notif.visible}
        />
      )}
      <EditPersonalDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        onSave={handleSavePersonalDetails}
      />
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={closeEducationModal}
        onSave={handleSaveEducation}
        initialData={selectedEducation}
        loading={loadingEducation}
      />
      <CertificationModal
        isOpen={isCertificationModalOpen}
        onClose={closeCertificationModal}
        onSave={handleSaveCertification}
        initialData={selectedCertification}
        loading={loadingCertifications}
      />
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={closeExperienceModal}
        onSave={handleSaveExperience}
        initialData={selectedExperience}
        loading={loadingExperience}
      />

      <div className="max-w-7xl mx-auto">
        {/* MOBILE LAYOUT: stacked, no sidebar, horizontal tabs at top */}
        <div className="block md:hidden bg-white rounded-2xl shadow-xl min-h-screen min-h-[100vh] overflow-hidden">
          {/* Profile Top */}
          <div className="flex flex-col items-center py-8 border-b border-gray-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 w-full">
            {profileData.profileImage ? (
              <img src={profileData.profileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-3 ring-4 ring-white/50 shadow-xl" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 ring-4 ring-white/50 shadow-xl">
                <span className="text-white text-4xl font-bold">
                  {profileData.firstName?.charAt(0) || profileData.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-white text-center mb-1 drop-shadow-lg">
              {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
            </h2>
            <p className="text-sm text-white/90 mb-2">ID: {profileData._id}</p>
            <div className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl mb-3 flex justify-center border border-white/30">
              <p className="text-sm text-white font-medium text-center">
                {profileData.role === 'candidate' ? '👤 Candidate Profile' : '👤 User Profile'}
              </p>
            </div>
          </div>
          {/* Tabs Horizontal Bar */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 px-4 py-4 text-sm whitespace-nowrap font-medium transition-all border-b-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="p-4 bg-gradient-to-br from-white to-gray-50 min-h-[calc(100vh-14rem)]">
            {/* The following blocks should basically match the right column of the desktop layout but stacked */}
            {/* Only show details for selected tab - copy logic from below, adjust paddings etc for mobile readability */}
            {/* COPY TAB CONTENT FROM EXISTING - adjust grid to single-col when mobile */}
              {activeTab === 'resume' && renderResumeContent()}
              {activeTab === 'personal' && (
                <div>
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name:</label>
                        <p className="text-gray-900">{profileData.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth:</label>
                        <p className="text-gray-900">{formatDate(profileData.DOB)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Gender:</label>
                        <p className="text-gray-900 capitalize">{profileData.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email:</label>
                        <p className="text-gray-900">{profileData.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number:</label>
                        <p className="text-gray-900">{profileData.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">PAN:</label>
                        <p className="text-gray-900">{profileData.pan || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Address</h2>
                      <button className="px-4 py-2 bg-indigo-600/10 text-indigo-700 rounded-lg hover:bg-indigo-600/20 transition-colors">
                        Edit Info
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Current Address:</label>
                        <p className="text-gray-900">{profileData.currentAddress || 'Not provided'}</p>
          </div>
            <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Permanent Address:</label>
                        <p className="text-gray-900">{profileData.permanentAddress || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  {profileData.socialLinks && Object.keys(profileData.socialLinks).length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Social Links</h2>
                      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex flex-wrap gap-4">
                          {Object.entries(profileData.socialLinks).map(([type, url]) => {
                            if (!url) return null;
                            return (
                              <a
                                key={type}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-110 hover:shadow-lg ${getSocialBgColor(type)}`}
                                title={getSocialLabel(type)}
                                aria-label={`Visit ${getSocialLabel(type)} profile`}
                              >
                                {getSocialIcon(type)}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'education' && renderEducationContent()}
              {activeTab === 'certs_skills' && (
                <div className="space-y-10">
                  {renderSkillsContent()}
                  {renderCertificationsContent()}
                </div>
              )}
              {activeTab === 'experience' && renderExperienceContent()}
              </div>
          </div>
        </div>
        {/* DESKTOP/TABLET LAYOUT (unchanged): sidebar + details grid */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl min-h-[calc(100vh)] overflow-hidden">
          <div className="flex items-start">
            <div className="w-80 bg-gradient-to-b from-gray-50 to-indigo-50/30 border-r border-gray-200 flex flex-col sticky h-[calc(100vh)] overflow-y-hidden hover:overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <div className="flex flex-col items-center">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-4 ring-4 ring-white/50 shadow-xl" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 ring-4 ring-white/50 shadow-xl">
                      <span className="text-white text-4xl font-bold">
                        {profileData.firstName?.charAt(0) || profileData.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white text-center mb-1 drop-shadow-lg">
                    {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
                  </h2>
                  <p className="text-sm text-white/90 mb-3">ID: {profileData._id}</p>
                  <div className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <p className="text-sm text-white font-medium text-center">
                      {profileData.role === 'candidate' ? '👤 Candidate Profile' : '👤 User Profile'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <nav className="p-4 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-purple-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
                {/* Left column now only shows tabs; resume upload moved to right column under the Resume tab */}
              </div>
            </div>

            {/* Right Column - independent scroll on hover */}
            <div className="flex-1 h-[calc(100vh)] flex flex-col">
              <div className="px-8 py-4 bg-white/95 border-b border-gray-200">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{activeTab === 'personal' ? 'Personal Details' : activeTab === 'education' ? 'Education Details' : activeTab === 'certs_skills' ? 'Skills & Certifications' : activeTab === 'experience' ? 'Experience' : 'Resume'}</h1>
              </div>
              <div className="p-8 flex-1 bg-gradient-to-br from-white to-gray-50 overflow-y-hidden hover:overflow-y-auto">
              {activeTab === 'resume' && (
                <div>{renderResumeContent()}</div>
              )}
              {activeTab === 'personal' && (
                <div>
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Personal Information</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                          <p className="text-base font-medium text-gray-900">{profileData.name || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date of Birth</label>
                          <p className="text-base font-medium text-gray-900">{formatDate(profileData.DOB)}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gender</label>
                          <p className="text-base font-medium text-gray-900 capitalize">{profileData.gender || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                          <p className="text-base font-medium text-gray-900 break-all">{profileData.email || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                          <p className="text-base font-medium text-gray-900">{profileData.phoneNumber || 'Not provided'}</p>
                        </div>
                        {profileData.pan && (
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PAN</label>
                            <p className="text-base font-medium text-gray-900">{profileData.pan}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Address</h2>
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Info
                      </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Address</label>
                          <p className="text-base text-gray-900 leading-relaxed">{profileData.currentAddress || 'Not provided'}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-6">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Permanent Address</label>
                          <p className="text-base text-gray-900 leading-relaxed">{profileData.permanentAddress || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {profileData.socialLinks && Object.keys(profileData.socialLinks).length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Social Links</h2>
                      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex flex-wrap gap-4">
                          {Object.entries(profileData.socialLinks).map(([type, url]) => {
                            if (!url) return null;
                            return (
                              <a
                                key={type}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-110 hover:shadow-lg ${getSocialBgColor(type)}`}
                                title={getSocialLabel(type)}
                                aria-label={`Visit ${getSocialLabel(type)} profile`}
                              >
                                {getSocialIcon(type)}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'education' && (
                <div>{renderEducationContent()}</div>
              )}
              {activeTab === 'certs_skills' && (
                <div className="space-y-10">
                  {renderSkillsContent()}
                  {renderCertificationsContent()}
                </div>
              )}
              {activeTab === 'experience' && renderExperienceContent()}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

