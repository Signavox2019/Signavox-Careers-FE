import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/common/Notification';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api';

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
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [notif, setNotif] = useState({ visible: false, type: 'info', message: '' });

  // Local editable copies and form state for CRUD sections
  const [educationList, setEducationList] = useState(() => profileData?.education || []);
  const [skillsList, setSkillsList] = useState(() => profileData?.skills || []);
  const [certList, setCertList] = useState(() => profileData?.certifications || []);
  const [expList, setExpList] = useState(() => profileData?.experiences || []);
  const [experiencedFlag, setExperiencedFlag] = useState(() => profileData?.experienced ?? ((profileData?.experiences || []).length > 0));

  const emptyEdu = { programOrDegree: '', branchOrSpecialization: '', institution: '', boardOrUniversity: '', passedYear: '', percentageOrCGPA: '' };
  const [eduForm, setEduForm] = useState(emptyEdu);
  const [editingEduIndex, setEditingEduIndex] = useState(-1);

  const emptyCert = { certificationName: '', issuedBy: '' };
  const [certForm, setCertForm] = useState(emptyCert);
  const [editingCertIndex, setEditingCertIndex] = useState(-1);

  const [newSkill, setNewSkill] = useState('');

  const emptyExp = { jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' };
  const [expForm, setExpForm] = useState(emptyExp);
  const [editingExpIndex, setEditingExpIndex] = useState(-1);

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
          setEducationList(sortEducation(response.user.education || []));
          setSkillsList(response.user.skills || []);
          setCertList(response.user.certifications || []);
          setExpList(response.user.experiences || []);
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
  const resumeLinkCandidate = profileData.resumeUrl ?? profileData.resume?.url ?? profileData.resume?.link;
  const resumeLink = typeof resumeLinkCandidate === 'string' && resumeLinkCandidate.trim().length > 0
    ? resumeLinkCandidate
    : null;

  // Sort helpers defined above (hoisted)

  // Persist helper
  const persistProfile = (updated) => {
    setProfileData(updated);
    try { localStorage.setItem('userData', JSON.stringify(updated)); } catch { }
  };

  // Education handlers
  const handleAddOrUpdateEducation = () => {
    const list = [...educationList];
    if (editingEduIndex >= 0) {
      list[editingEduIndex] = { ...eduForm };
    } else {
      list.push({ ...eduForm });
    }
    const sorted = sortEducation(list);
    setEducationList(sorted);
    setEduForm(emptyEdu);
    setEditingEduIndex(-1);
    const updated = { ...profileData, education: sorted };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Education saved' });
  };
  const handleEditEducation = (index) => {
    setEditingEduIndex(index);
    setEduForm(educationList[index]);
  };
  const handleDeleteEducation = (index) => {
    const list = educationList.filter((_, i) => i !== index);
    const sorted = sortEducation(list);
    setEducationList(sorted);
    const updated = { ...profileData, education: sorted };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Education deleted' });
  };

  // Certification handlers
  const handleAddOrUpdateCert = () => {
    const list = [...certList];
    if (editingCertIndex >= 0) {
      list[editingCertIndex] = { ...certForm };
    } else {
      list.push({ ...certForm });
    }
    setCertList(list);
    setCertForm(emptyCert);
    setEditingCertIndex(-1);
    const updated = { ...profileData, certifications: list };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Certification saved' });
  };
  const handleEditCert = (index) => {
    setEditingCertIndex(index);
    setCertForm(certList[index]);
  };
  const handleDeleteCert = (index) => {
    const list = certList.filter((_, i) => i !== index);
    setCertList(list);
    const updated = { ...profileData, certifications: list };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Certification deleted' });
  };

  // Skills handlers
  const handleAddSkill = () => {
    const s = (newSkill || '').trim();
    if (!s) return;
    if (skillsList.includes(s)) return;
    const list = [...skillsList, s];
    setSkillsList(list);
    setNewSkill('');
    const updated = { ...profileData, skills: list };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Skill added' });
  };
  const handleDeleteSkill = (skill) => {
    const list = skillsList.filter((x) => x !== skill);
    setSkillsList(list);
    const updated = { ...profileData, skills: list };
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Skill removed' });
  };

  // Experience handlers
  const handleAddOrUpdateExp = () => {
    const list = [...expList];
    if (editingExpIndex >= 0) {
      list[editingExpIndex] = { ...expForm };
    } else {
      list.push({ ...expForm });
    }
    setExpList(list);
    setExpForm(emptyExp);
    setEditingExpIndex(-1);
    const updated = { ...profileData, experiences: list, experienced: list.length > 0 };
    setExperiencedFlag(updated.experienced);
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Experience saved' });
  };
  const handleEditExp = (index) => {
    setEditingExpIndex(index);
    setExpForm(expList[index]);
  };
  const handleDeleteExp = (index) => {
    const list = expList.filter((_, i) => i !== index);
    setExpList(list);
    const updated = { ...profileData, experiences: list, experienced: list.length > 0 };
    setExperiencedFlag(updated.experienced);
    persistProfile(updated);
    setNotif({ visible: true, type: 'success', message: 'Experience deleted' });
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setUploadMessage(null);
    if (!resumeFile) {
      setUploadMessage({ type: 'error', text: 'Please select a resume file.' });
      return;
    }
    try {
      setUploading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      await apiService.uploadResume(resumeFile, token);
      setUploadMessage({ type: 'success', text: 'Resume uploaded successfully.' });
      // refresh profile to reflect latest resume info
      try {
        const refreshed = await apiService.getUserProfile(token);
        if (refreshed && refreshed.user) {
          setProfileData(refreshed.user);
          setEducationList(sortEducation(refreshed.user.education || []));
          setSkillsList(refreshed.user.skills || []);
          setCertList(refreshed.user.certifications || []);
          setExpList(refreshed.user.experiences || []);
          setExperiencedFlag(refreshed.user.experienced ?? ((refreshed.user.experiences || []).length > 0));
          try { localStorage.setItem('userData', JSON.stringify(refreshed.user)); } catch { }
        }
      } catch { }
      setResumeFile(null);
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notif.visible && (
        <Notification
          type={notif.type}
          message={notif.message}
          duration={3000}
          onClose={() => setNotif((n) => ({ ...n, visible: false }))}
          isVisible={notif.visible}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* MOBILE LAYOUT: stacked, no sidebar, horizontal tabs at top */}
        <div className="block md:hidden bg-white rounded-lg shadow-sm min-h-[calc(100vh)]">
          {/* Profile Top */}
          <div className="flex flex-col items-center py-8 border-b border-gray-200 bg-purple-50">
            {profileData.profileImage ? (
              <img src={profileData.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-2 ring-4 ring-blue-100">
                <span className="text-white text-3xl font-semibold">
                  {profileData.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
              {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
            </h2>
            <p className="text-sm text-gray-600 mb-1">ID: {profileData._id}</p>
            <div className="w-full px-4 py-1 bg-purple-100 rounded-lg mb-3 flex justify-center">
              <p className="text-xs text-blue-600 text-center">
                {profileData.role === 'candidate' ? 'Candidate Profile' : 'User Profile'}
              </p>
            </div>
          </div>
          {/* Tabs Horizontal Bar */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 text-sm whitespace-nowrap font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-700 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="p-4 bg-gradient-to-br from-white to-gray-50 min-h-[calc(100vh-30vh)]">
            {/* The following blocks should basically match the right column of the desktop layout but stacked */}
            {/* Only show details for selected tab - copy logic from below, adjust paddings etc for mobile readability */}
            {/* COPY TAB CONTENT FROM EXISTING - adjust grid to single-col when mobile */}
              {activeTab === 'resume' && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Resume</h2>
                  {resumeLink ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <a
                        href={resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:underline text-sm truncate"
                      >
                        {profileData.resumeFileName || 'View current resume'}
                      </a>
                      <span className="text-xs text-gray-500">Updated automatically after upload</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No resume on file.</p>
                  )}
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resume</h2>
                  <form onSubmit={handleResumeUpload} className="space-y-4 max-w-xl">
                    <label className="block">
                      <div className="w-full p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30 hover:bg-indigo-50 transition cursor-pointer">
                        <p className="text-sm text-gray-600">Drag and drop your resume here, or click to browse</p>
                        <p className="mt-1 text-xs text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={uploading}
                        className={`px-6 py-2 rounded-lg text-white shadow-sm ${uploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {uploading ? 'Uploading…' : 'Upload Resume'}
                      </button>
                      {resumeFile && (
                        <span className="text-sm text-gray-600 truncate max-w-[240px]">{resumeFile.name}</span>
                      )}
                    </div>
                      {uploadMessage && (
                        <p className={`${uploadMessage.type === 'success' ? 'text-green-600' : 'text-red-600'} text-sm`}>{uploadMessage.text}</p>
                      )}
                    </form>
                  </div>
              )}
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
                  {profileData.socialLinks && (
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
              <div className="space-y-3">
                        {profileData.socialLinks.linkedin && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn:</label>
                            <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">
                              {profileData.socialLinks.linkedin}
                            </a>
                          </div>
                        )}
                        {profileData.socialLinks.github && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">GitHub:</label>
                            <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">
                              {profileData.socialLinks.github}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'education' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Education Timeline</h2>
                    <button onClick={() => { setEditingEduIndex(-1); setEduForm(emptyEdu); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Education</button>
                  </div>
                  {(editingEduIndex >= 0 || Object.values(eduForm).some(v => v)) && (
                    <div className="mb-8 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                      <div className="grid grid-cols-2 gap-4">
                        <input value={eduForm.programOrDegree} onChange={(e) => setEduForm({ ...eduForm, programOrDegree: e.target.value })} placeholder="Program / Degree" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.branchOrSpecialization} onChange={(e) => setEduForm({ ...eduForm, branchOrSpecialization: e.target.value })} placeholder="Branch / Specialization" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} placeholder="Institution" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.boardOrUniversity} onChange={(e) => setEduForm({ ...eduForm, boardOrUniversity: e.target.value })} placeholder="Board / University" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.passedYear} onChange={(e) => setEduForm({ ...eduForm, passedYear: e.target.value })} placeholder="Passed Year" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.percentageOrCGPA} onChange={(e) => setEduForm({ ...eduForm, percentageOrCGPA: e.target.value })} placeholder="Percentage / CGPA" className="px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button onClick={handleAddOrUpdateEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingEduIndex >= 0 ? 'Update' : 'Add'}</button>
                        <button onClick={() => { setEditingEduIndex(-1); setEduForm(emptyEdu); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                      </div>
                    </div>
                  )}

                  {educationList && educationList.length > 0 ? (
                    <ol className="relative border-l border-gray-200 pl-6 space-y-6">
                      {educationList.map((edu, index) => (
                        <li key={index} className="ml-3">
                          <div className="absolute -left-2.5 mt-1 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow" />
                          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{edu.programOrDegree || 'Program / Degree'}</h3>
                                <p className="text-sm text-gray-500">{edu.branchOrSpecialization || 'Specialization'}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditEducation(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                                <button onClick={() => handleDeleteEducation(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Institution</p>
                                <p className="font-medium text-gray-900">{edu.institution || '—'}</p>
                              </div>
                            <div>
                                <p className="text-gray-500">Board / University</p>
                                <p className="font-medium text-gray-900">{edu.boardOrUniversity || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Passed Year</p>
                                <p className="font-medium text-gray-900">{edu.passedYear || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Percentage / CGPA</p>
                                <p className="font-medium text-gray-900">{edu.percentageOrCGPA || '—'}</p>
                            </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No education details added yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'certs_skills' && (
                <div className="space-y-10">
                <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                      <div className="flex items-stretch gap-0">
                        <input 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                          placeholder="Type a skill and press Enter" 
                          className="px-4 py-2 border border-r-0 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button 
                          onClick={handleAddSkill} 
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-r-lg text-sm hover:from-indigo-700 hover:to-indigo-800"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {skillsList && skillsList.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {skillsList.map((skill, index) => (
                          <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-white text-indigo-700 rounded-full text-sm border border-indigo-200 shadow-sm">
                            {skill}
                            <button aria-label={`Remove ${skill}`} onClick={() => handleDeleteSkill(skill)} className="text-indigo-700/80 hover:text-indigo-900">×</button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">No skills added yet. Start by adding one above.</p>
                      </div>
                    )}
                  </div>

                            <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                      <button onClick={() => { setEditingCertIndex(-1); setCertForm(emptyCert); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Certification</button>
                    </div>
                    {(editingCertIndex >= 0 || Object.values(certForm).some(v => v)) && (
                      <div className="mb-6 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                        <div className="grid grid-cols-2 gap-4">
                          <input value={certForm.certificationName} onChange={(e) => setCertForm({ ...certForm, certificationName: e.target.value })} placeholder="Certification Name" className="px-3 py-2 border rounded-lg" />
                          <input value={certForm.issuedBy} onChange={(e) => setCertForm({ ...certForm, issuedBy: e.target.value })} placeholder="Issued By" className="px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button onClick={handleAddOrUpdateCert} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingCertIndex >= 0 ? 'Update' : 'Add'}</button>
                          <button onClick={() => { setEditingCertIndex(-1); setCertForm(emptyCert); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                        </div>
                            </div>
                    )}
                    {certList && certList.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {certList.map((cert, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{cert.certificationName || 'Certification'}</h3>
                                <p className="text-sm text-gray-500">Issued by {cert.issuedBy || '—'}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditCert(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                                <button onClick={() => handleDeleteCert(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No certifications added yet.</p>
                    </div>
                  )}
                </div>
                </div>
              )}
              {activeTab === 'experience' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                    <button onClick={() => { setEditingExpIndex(-1); setExpForm(emptyExp); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Experience</button>
                  </div>

                  {(editingExpIndex >= 0 || Object.values(expForm).some(v => v)) && (
                    <div className="mb-8 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                      <div className="grid grid-cols-2 gap-4">
                        <input value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} placeholder="Job Title" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} placeholder="Company" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} placeholder="Start Date (YYYY-MM)" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} placeholder="End Date (YYYY-MM or Present)" className="px-3 py-2 border rounded-lg" />
                        <textarea value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} placeholder="Short description" className="col-span-2 px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button onClick={handleAddOrUpdateExp} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingExpIndex >= 0 ? 'Update' : 'Add'}</button>
                        <button onClick={() => { setEditingExpIndex(-1); setExpForm(emptyExp); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                      </div>
                    </div>
                  )}

                  {experiencedFlag === false && (!expList || expList.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-2">No work experience yet.</p>
                      <p className="text-sm text-gray-400">Fresher</p>
                    </div>
                  ) : expList && expList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {expList.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle || 'Role'}</h3>
                              <p className="text-sm text-gray-500">{exp.companyName || 'Company'} • {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditExp(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                              <button onClick={() => handleDeleteExp(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                            </div>
                          </div>
                          {exp.description && <p className="mt-3 text-sm text-gray-700">{exp.description}</p>}
              </div>
                      ))}
            </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No work experience added yet.</p>
              </div>
                  )}
                </div>
              )}
              </div>
          </div>
        </div>
        {/* DESKTOP/TABLET LAYOUT (unchanged): sidebar + details grid */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm min-h-[calc(100vh)]">
          <div className="flex items-start">
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col sticky h-[calc(100vh)] overflow-y-hidden hover:overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 ring-4 ring-blue-100">
                      <span className="text-white text-3xl font-semibold">
                        {profileData.firstName?.charAt(0) || 'U'}
              </span>
            </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
              </h2>
                  <p className="text-sm text-gray-600 mb-3">ID: {profileData._id}</p>
                  <div className="w-full px-3 py-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-blue-600 text-center">
                      {profileData.role === 'candidate' ? 'Candidate Profile' : 'User Profile'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <nav className="p-4 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Resume</h2>
                  {resumeLink ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <a
                        href={resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:underline text-sm truncate"
                      >
                        {profileData.resumeFileName || 'View current resume'}
                      </a>
                      <span className="text-xs text-gray-500">Updated automatically after upload</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No resume on file.</p>
                  )}
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resume</h2>
                  <form onSubmit={handleResumeUpload} className="space-y-4 max-w-xl">
                    <label className="block">
                      <div className="w-full p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30 hover:bg-indigo-50 transition cursor-pointer">
                        <p className="text-sm text-gray-600">Drag and drop your resume here, or click to browse</p>
                        <p className="mt-1 text-xs text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={uploading}
                        className={`px-6 py-2 rounded-lg text-white shadow-sm ${uploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {uploading ? 'Uploading…' : 'Upload Resume'}
                      </button>
                      {resumeFile && (
                        <span className="text-sm text-gray-600 truncate max-w-[240px]">{resumeFile.name}</span>
                      )}
                    </div>
                      {uploadMessage && (
                        <p className={`${uploadMessage.type === 'success' ? 'text-green-600' : 'text-red-600'} text-sm`}>{uploadMessage.text}</p>
                      )}
                    </form>
                  </div>
              )}
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
                  {profileData.socialLinks && (
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
              <div className="space-y-3">
                        {profileData.socialLinks.linkedin && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn:</label>
                            <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">
                              {profileData.socialLinks.linkedin}
                            </a>
                          </div>
                        )}
                        {profileData.socialLinks.github && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">GitHub:</label>
                            <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">
                              {profileData.socialLinks.github}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'education' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Education Timeline</h2>
                    <button onClick={() => { setEditingEduIndex(-1); setEduForm(emptyEdu); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Education</button>
                  </div>
                  {(editingEduIndex >= 0 || Object.values(eduForm).some(v => v)) && (
                    <div className="mb-8 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                      <div className="grid grid-cols-2 gap-4">
                        <input value={eduForm.programOrDegree} onChange={(e) => setEduForm({ ...eduForm, programOrDegree: e.target.value })} placeholder="Program / Degree" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.branchOrSpecialization} onChange={(e) => setEduForm({ ...eduForm, branchOrSpecialization: e.target.value })} placeholder="Branch / Specialization" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} placeholder="Institution" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.boardOrUniversity} onChange={(e) => setEduForm({ ...eduForm, boardOrUniversity: e.target.value })} placeholder="Board / University" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.passedYear} onChange={(e) => setEduForm({ ...eduForm, passedYear: e.target.value })} placeholder="Passed Year" className="px-3 py-2 border rounded-lg" />
                        <input value={eduForm.percentageOrCGPA} onChange={(e) => setEduForm({ ...eduForm, percentageOrCGPA: e.target.value })} placeholder="Percentage / CGPA" className="px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button onClick={handleAddOrUpdateEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingEduIndex >= 0 ? 'Update' : 'Add'}</button>
                        <button onClick={() => { setEditingEduIndex(-1); setEduForm(emptyEdu); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                      </div>
                    </div>
                  )}

                  {educationList && educationList.length > 0 ? (
                    <ol className="relative border-l border-gray-200 pl-6 space-y-6">
                      {educationList.map((edu, index) => (
                        <li key={index} className="ml-3">
                          <div className="absolute -left-2.5 mt-1 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow" />
                          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{edu.programOrDegree || 'Program / Degree'}</h3>
                                <p className="text-sm text-gray-500">{edu.branchOrSpecialization || 'Specialization'}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditEducation(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                                <button onClick={() => handleDeleteEducation(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Institution</p>
                                <p className="font-medium text-gray-900">{edu.institution || '—'}</p>
                              </div>
                            <div>
                                <p className="text-gray-500">Board / University</p>
                                <p className="font-medium text-gray-900">{edu.boardOrUniversity || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Passed Year</p>
                                <p className="font-medium text-gray-900">{edu.passedYear || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Percentage / CGPA</p>
                                <p className="font-medium text-gray-900">{edu.percentageOrCGPA || '—'}</p>
                            </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No education details added yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'certs_skills' && (
                <div className="space-y-10">
                <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                      <div className="flex items-stretch gap-0">
                        <input 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                          placeholder="Type a skill and press Enter" 
                          className="px-4 py-2 border border-r-0 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button 
                          onClick={handleAddSkill} 
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-r-lg text-sm hover:from-indigo-700 hover:to-indigo-800"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {skillsList && skillsList.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {skillsList.map((skill, index) => (
                          <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-white text-indigo-700 rounded-full text-sm border border-indigo-200 shadow-sm">
                            {skill}
                            <button aria-label={`Remove ${skill}`} onClick={() => handleDeleteSkill(skill)} className="text-indigo-700/80 hover:text-indigo-900">×</button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">No skills added yet. Start by adding one above.</p>
                      </div>
                    )}
                  </div>

                            <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                      <button onClick={() => { setEditingCertIndex(-1); setCertForm(emptyCert); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Certification</button>
                    </div>
                    {(editingCertIndex >= 0 || Object.values(certForm).some(v => v)) && (
                      <div className="mb-6 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                        <div className="grid grid-cols-2 gap-4">
                          <input value={certForm.certificationName} onChange={(e) => setCertForm({ ...certForm, certificationName: e.target.value })} placeholder="Certification Name" className="px-3 py-2 border rounded-lg" />
                          <input value={certForm.issuedBy} onChange={(e) => setCertForm({ ...certForm, issuedBy: e.target.value })} placeholder="Issued By" className="px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button onClick={handleAddOrUpdateCert} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingCertIndex >= 0 ? 'Update' : 'Add'}</button>
                          <button onClick={() => { setEditingCertIndex(-1); setCertForm(emptyCert); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                        </div>
                            </div>
                    )}
                    {certList && certList.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {certList.map((cert, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{cert.certificationName || 'Certification'}</h3>
                                <p className="text-sm text-gray-500">Issued by {cert.issuedBy || '—'}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditCert(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                                <button onClick={() => handleDeleteCert(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No certifications added yet.</p>
                    </div>
                  )}
                </div>
                </div>
              )}
              {activeTab === 'experience' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                    <button onClick={() => { setEditingExpIndex(-1); setExpForm(emptyExp); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Experience</button>
                  </div>

                  {(editingExpIndex >= 0 || Object.values(expForm).some(v => v)) && (
                    <div className="mb-8 p-5 border border-indigo-100 rounded-xl bg-indigo-50/30">
                      <div className="grid grid-cols-2 gap-4">
                        <input value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} placeholder="Job Title" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} placeholder="Company" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} placeholder="Start Date (YYYY-MM)" className="px-3 py-2 border rounded-lg" />
                        <input value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} placeholder="End Date (YYYY-MM or Present)" className="px-3 py-2 border rounded-lg" />
                        <textarea value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} placeholder="Short description" className="col-span-2 px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button onClick={handleAddOrUpdateExp} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingExpIndex >= 0 ? 'Update' : 'Add'}</button>
                        <button onClick={() => { setEditingExpIndex(-1); setExpForm(emptyExp); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                      </div>
                    </div>
                  )}

                  {experiencedFlag === false && (!expList || expList.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-2">No work experience yet.</p>
                      <p className="text-sm text-gray-400">Fresher</p>
                    </div>
                  ) : expList && expList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {expList.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle || 'Role'}</h3>
                              <p className="text-sm text-gray-500">{exp.companyName || 'Company'} • {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditExp(index)} className="px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Edit</button>
                              <button onClick={() => handleDeleteExp(index)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                            </div>
                          </div>
                          {exp.description && <p className="mt-3 text-sm text-gray-700">{exp.description}</p>}
              </div>
                      ))}
            </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No work experience added yet.</p>
              </div>
                  )}
                </div>
              )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

