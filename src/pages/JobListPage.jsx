import { useState, useMemo, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api';
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
  const [showNotification, setShowNotification] = useState(false);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [authRedirecting, setAuthRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get unique filter options from API data
  const departments = [...new Set(jobs.map(job => job.jobDescription?.category || 'Other'))];
  const types = [...new Set(jobs.map(job => job.type))];
  const locations = [...new Set(jobs.map(job => job.location))];

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getJobs();
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
  }, []);

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

  const handleApplicationSuccess = (jobId) => {
    setAppliedJobIds(prev => [...prev, jobId]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
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
    if (filteredJobs.length > 0 && !filteredJobs.includes(selectedJob)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);

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
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-[10000]">
          <CheckCircle size={20} />
          <span className="font-medium">Application submitted successfully!</span>
        </div>
      )}
      
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-2 py-4">
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
            />
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJobForApplication}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobListPage;
