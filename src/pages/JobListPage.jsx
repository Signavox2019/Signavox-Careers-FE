import { useState, useMemo, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { jobListings } from '../data/jobData';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import JobCard from '../components/job/JobCard';
import JobDetails from '../components/job/JobDetails';

const JobListPage = () => {
  const [selectedJob, setSelectedJob] = useState(jobListings[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'applied'
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Get unique filter options
  const departments = [...new Set(jobListings.map(job => job.department))];
  const types = [...new Set(jobListings.map(job => job.type))];
  const locations = [...new Set(jobListings.map(job => job.location))];

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

  // Function to handle job application
  const handleJobApplication = (jobId) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    let jobs = jobListings;
    
    // Filter by tab (all or applied)
    if (activeTab === 'applied') {
      jobs = jobs.filter(job => appliedJobIds.includes(job.id));
    }
    
    // Apply search and filter criteria
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !departmentFilter || job.department === departmentFilter;
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesLocation = !locationFilter || job.location === locationFilter;

      return matchesSearch && matchesDepartment && matchesType && matchesLocation;
    });
  }, [searchQuery, departmentFilter, typeFilter, locationFilter, activeTab]);

  // Update selected job when filters change
  useMemo(() => {
    if (filteredJobs.length > 0 && !filteredJobs.includes(selectedJob)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={20} />
          <span className="font-medium">Application submitted successfully!</span>
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
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                    isApplied={appliedJobIds.includes(job.id)}
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
              isApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
