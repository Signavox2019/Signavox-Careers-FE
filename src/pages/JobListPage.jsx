import { useState, useMemo, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api';
import { formatLocation } from '../utils/helpers';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import JobCard from '../components/job/JobCard';
import JobDetails from '../components/job/JobDetails';
import JobApplicationModal from '../components/job/JobApplicationModal';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'applied'
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [authRedirecting, setAuthRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'details'
  const [jobDetailsTabs, setJobDetailsTabs] = useState({});
  const [thankYouModal, setThankYouModal] = useState({
    visible: false,
    message: '',
    application: null,
  });
  
  // Ref to track selected job ID to preserve it when applications load
  const selectedJobIdRef = useRef(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('authToken');
  
  // Update ref whenever selectedJob changes
  useEffect(() => {
    if (selectedJob?._id) {
      selectedJobIdRef.current = selectedJob._id;
    }
  }, [selectedJob]);

  // Get unique filter options from API data
  const departments = [...new Set(jobs.map(job => job.jobDescription?.category || 'Other'))];
  const types = [...new Set(jobs.map(job => job.type))];
  const locations = [...new Set(jobs.map(job => job.location))];

  // Detect mobile viewport (Tailwind md breakpoint ~ 768px)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange);
    };
  }, []);

  // Reset mobile view when leaving mobile
  useEffect(() => {
    if (!isMobile) {
      setMobileView('list');
    }
  }, [isMobile]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getAuthToken();
        if (!token) {
          setError('Please log in to view available jobs.');
          return;
        }
        const response = await apiService.getJobs(token);
        setJobs(response.jobs || []);
        if (response.jobs && response.jobs.length > 0) {
          setSelectedJob(response.jobs[0]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated]);

  // Load applied jobs from localStorage on component mount
  useEffect(() => {
    const savedAppliedJobs = localStorage.getItem('appliedJobs');
    if (savedAppliedJobs) {
      setAppliedJobIds(JSON.parse(savedAppliedJobs));
    }
  }, []);

  // Save applied jobs to localStorage whenever appliedJobIds changes
  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobIds));
  }, [appliedJobIds]);

  // Fetch user applications from API when authenticated
  useEffect(() => {
    const fetchUserApplications = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          const response = await apiService.getMyApplications(token);
          if (response.applications) {
            const appliedIds = response.applications
              .filter(app => app.job && app.job._id)
              .map(app => app.job._id);
            setAppliedJobIds(appliedIds);
          }
        } catch (err) {
          console.error('Error fetching user applications:', err);
        }
      }
    };

    fetchUserApplications();
  }, [isAuthenticated]);

  // Function to handle job application
  const handleJobApplication = (job) => {
    // Check if user is authenticated before allowing application
    if (!isAuthenticated) {
      setShowAuthRequired(true);
      setAuthRedirecting(true);
      // Wait briefly with spinner, then navigate
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      // Hide toast a little after navigation
      setTimeout(() => {
        setShowAuthRequired(false);
        setAuthRedirecting(false);
      }, 3000);
      return;
    }
    
    // Open application modal
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
  };

  const currentDetailsTab = selectedJob ? (jobDetailsTabs[selectedJob._id] || 'summary') : 'summary';

  const handleApplicationSuccess = (jobId, response) => {
    setAppliedJobIds(prev => (prev.includes(jobId) ? prev : [...prev, jobId]));
    setThankYouModal({
      visible: true,
      message: response?.message || 'Application submitted successfully!',
      application: response?.application || null,
    });
  };

  const closeThankYouModal = () => {
    setThankYouModal({
      visible: false,
      message: '',
      application: null,
    });
  };

  const handleDetailsTabChange = (tabId) => {
    if (!selectedJob?._id) return;
    setJobDetailsTabs(prev => ({
      ...prev,
      [selectedJob._id]: tabId,
    }));
  };

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    let filteredJobs = jobs;
    
    // Filter by tab (all or applied)
    if (activeTab === 'applied') {
      filteredJobs = filteredJobs.filter(job => appliedJobIds.includes(job._id));
    }
    
    // Apply search and filter criteria
    return filteredJobs.filter(job => {
      const jobCategory = job.jobDescription?.category || 'Other';
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           jobCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.jobDescription?.summary?.overview?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !departmentFilter || jobCategory === departmentFilter;
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesLocation = !locationFilter || job.location === locationFilter;

      return matchesSearch && matchesDepartment && matchesType && matchesLocation;
    });
  }, [jobs, searchQuery, departmentFilter, typeFilter, locationFilter, activeTab, appliedJobIds]);

  // Update selected job when filters change
  useEffect(() => {
    if (filteredJobs.length === 0) {
      if (selectedJob !== null) {
        setSelectedJob(null);
      }
      return;
    }

    const currentSelectedId = selectedJob?._id;
    const matchingJob = filteredJobs.find(job => job._id === currentSelectedId);

    if (matchingJob) {
      // Update to the matching job from filteredJobs to ensure it has the latest data
      if (selectedJob !== matchingJob) {
        setSelectedJob(matchingJob);
      }
      return;
    }

    // Only change selectedJob if there's no current selection or if current selection is invalid
    // This preserves the selected job when applications load, even if it's not in filteredJobs
    // (e.g., when on "applied" tab but the selected job hasn't been applied to yet)
    if (!selectedJob || !jobs.find(job => job._id === currentSelectedId)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob, jobs]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Authentication Required Notification */}
      {showAuthRequired && (
        <div className="fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-[10000]">
          {authRedirecting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <AlertCircle size={20} />
          )}
          <div className="flex flex-col">
            <span className="font-medium">Login required to apply</span>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm underline hover:no-underline text-white/90"
            >
              {authRedirecting ? 'Redirecting…' : 'Sign in now'}
            </button>
          </div>
        </div>
      )}
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6 text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Career Opportunities
            </h1>
            <p className="text-gray-600 text-xl max-w-full  leading-relaxed">
              Discover your next career move with us. Join a team that values innovation, growth, and excellence.
            </p>
          </div>

          {/* Search and Filters - Enhanced Professional Design */}
          <div className="space-y-4">
            <div className="relative">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by job title, department, or skills..."
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-start">
              <FilterDropdown
                label="Department"
                options={departments}
                value={departmentFilter}
                onChange={setDepartmentFilter}
              />
              <FilterDropdown
                label="Job Type"
                options={types}
                value={typeFilter}
                onChange={setTypeFilter}
              />
              <FilterDropdown
                label="Location"
                options={locations}
                value={locationFilter}
                onChange={setLocationFilter}
                formatOption={formatLocation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Content */}
      <div className="max-w-7xl mx-auto px-2 py-4">
        {isMobile ? (
          <div className="h-[calc(100vh-120px)]">
            {mobileView === 'list' ? (
              <>
                {/* Filter/Search section - VISIBLE ON MOBILE LIST VIEW ONLY */}
                <div className="bg-white px-4 pt-4 pb-2 border-b border-gray-200">
                  <div className="mb-4">
                    <SearchBar 
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search by job title, department, or skills..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 justify-start">
                    <FilterDropdown label="Department" options={departments} value={departmentFilter} onChange={setDepartmentFilter} />
                    <FilterDropdown label="Job Type" options={types} value={typeFilter} onChange={setTypeFilter} />
                    <FilterDropdown 
                      label="Location" 
                      options={locations} 
                      value={locationFilter} 
                      onChange={setLocationFilter} 
                      formatOption={formatLocation} 
                    />
                  </div>
                </div>
                {/* End filter */}
              </>
            ) : null}
            {mobileView === 'list' ? (
              <div className="bg-gradient-to-b from-gray-50 to-white flex flex-col h-full overflow-hidden border border-gray-200 shadow-sm">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white">
                  <button
                    className={`flex-1 px-6 py-5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                      activeTab === 'all'
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Jobs
                  </button>
                  <button
                    className={`flex-1 px-6 py-5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                      activeTab === 'applied'
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('applied')}
                  >
                    Applied Jobs
                  </button>
                </div>

                {/* Job Count */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  </p>
                </div>

                {/* Job List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                      <JobCard
                        key={job._id}
                        job={job}
                        isSelected={selectedJob?._id === job._id}
                        onClick={() => {
                          setSelectedJob(job);
                          setMobileView('details');
                        }}
                        isApplied={appliedJobIds.includes(job._id)}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full p-8">
                      <div className="text-center">
                        <p className="text-gray-500 text-sm">
                          {activeTab === 'applied' 
                            ? 'You haven\'t applied to any jobs yet' 
                            : 'No jobs found matching your criteria'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white to-gray-50 h-full overflow-hidden border border-gray-200 shadow-sm flex flex-col">
                {/* Mobile Back */}
                <div className="px-3 py-3 border-b border-gray-200 bg-white">
                  <button
                    onClick={() => setMobileView('list')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    ← Back to jobs
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <JobDetails 
                    job={selectedJob} 
                    onApply={handleJobApplication}
                    isApplied={selectedJob ? appliedJobIds.includes(selectedJob._id) : false}
                    isAuthenticated={isAuthenticated}
                    onApplicationSuccess={handleApplicationSuccess}
                    activeTab={currentDetailsTab}
                    onTabChange={handleDetailsTabChange}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
            {/* Left Column - Job List */}
            <div className="col-span-4 bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden border border-gray-200 shadow-sm">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white">
                <button
                  className={`flex-1 px-6 py-5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                    activeTab === 'all'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  All Jobs
                </button>
                <button
                  className={`flex-1 px-6 py-5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                    activeTab === 'applied'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('applied')}
                >
                  Applied Jobs
                </button>
              </div>

              {/* Job Count */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
              </div>
              
              {/* Job List */}
              <div className="flex-1 overflow-y-auto">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isSelected={selectedJob?._id === job._id}
                      onClick={() => setSelectedJob(job)}
                      isApplied={appliedJobIds.includes(job._id)}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">
                        {activeTab === 'applied' 
                          ? 'You haven\'t applied to any jobs yet' 
                          : 'No jobs found matching your criteria'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="col-span-8 bg-gradient-to-br from-white to-gray-50 overflow-hidden border border-gray-200 shadow-sm">
              <JobDetails 
                job={selectedJob} 
                onApply={handleJobApplication}
                isApplied={selectedJob ? appliedJobIds.includes(selectedJob._id) : false}
                isAuthenticated={isAuthenticated}
                onApplicationSuccess={handleApplicationSuccess}
                activeTab={currentDetailsTab}
                onTabChange={handleDetailsTabChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJobForApplication}
        onApplicationSuccess={handleApplicationSuccess}
      />

      {thankYouModal.visible && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={closeThankYouModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Thank you for applying!</h3>
            <p className="text-gray-600 text-sm">
              {thankYouModal.message || 'We have received your application and will keep you updated.'}
            </p>
            {thankYouModal.application?.job?.title && (
              <p className="text-sm text-gray-500">
                Role: <span className="font-semibold text-gray-800">{thankYouModal.application.job.title}</span>
              </p>
            )}
            <button
              type="button"
              onClick={closeThankYouModal}
              className="w-full mt-2 rounded-2xl bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;
