import { useState, useEffect } from 'react';
import { 
  MapPin, Briefcase, Clock, Banknote, Users, 
  Calendar, CheckCircle, ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import { apiService } from '../../api';

const JobDetails = ({ job, onApply, isApplied, isAuthenticated, onApplicationSuccess }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [detailedJob, setDetailedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isJobLoading, setIsJobLoading] = useState(false);

  // Fetch detailed job data when job changes
  useEffect(() => {
    if (job && job._id) {
      setIsJobLoading(true);
      fetchDetailedJob(job._id);
    }
  }, [job]);

  const fetchDetailedJob = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getJobById(jobId);
      setDetailedJob(response);
    } catch (err) {
      console.error('Error fetching detailed job:', err);
      setError('Failed to load job details');
      // Fallback to basic job data
      setDetailedJob(job);
    } finally {
      setLoading(false);
      setIsJobLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Select a job to view details
          </h2>
          <p className="text-gray-500">
            Choose a position from the list to see more information
          </p>
        </div>
      </div>
    );
  }

  if (loading || isJobLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchDetailedJob(job._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use detailed job data if available, otherwise fallback to basic job data
  const currentJob = detailedJob || job;

  // Extract data from API structure
  const jobDescription = currentJob.jobDescription || {};
  const summary = jobDescription.summary || {};
  const ctc = jobDescription.ctc || {};
  const hiringWorkflow = currentJob.hiringWorkflow || {};
  const eligibilityCriteria = currentJob.eligibilityCriteria || {};
  const jobCategory = jobDescription.category || 'Other';
  
  // Check if the job application is closed
  const isApplicationClosed = currentJob.status !== 'open';

  // Calculate precise time since posted
  const getTimeSincePosted = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffTime = now - posted;
    
    // If the date is in the future, return "Just now"
    if (diffTime < 0) return 'Just now';
    
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'workflow', label: 'Hiring Workflow' },
    { id: 'eligibility', label: 'Eligibility Criteria' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-xl font-bold text-gray-900 flex-1">
            {currentJob.title}
          </h1>
          {isApplicationClosed ? (
            isApplied ? (
              <span className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg ml-4">
                Applied
              </span>
            ) : (
              <span className="px-5 py-2 text-sm font-semibold text-red-600 ml-4">
                Application Closed
              </span>
            )
          ) : (
            <button 
              onClick={() => onApply && onApply(currentJob)}
              disabled={isApplied}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ml-4 ${
                isApplied 
                  ? 'bg-green-600 text-white cursor-not-allowed' 
                  : isAuthenticated 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Briefcase size={14} />
            <span>{jobCategory}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin size={14} />
            <span>{currentJob.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock size={14} />
            <span>{currentJob.type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Banknote size={14} />
            <span>{ctc.min && ctc.max ? `₹ ${ctc.min} - ₹ ${ctc.max}` : 'Salary not specified'}</span>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Posted {getTimeSincePosted(currentJob.postedDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Closing On:</span>
            <span>{new Date(currentJob.closingDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{summary.overview || 'No overview available.'}</p>
            </div>

            {summary.responsibilities && summary.responsibilities.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                <ul className="space-y-1.5">
                  {summary.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.qualifications && summary.qualifications.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Required Qualifications</h3>
                <ul className="space-y-1.5">
                  {summary.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{qualification}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {jobDescription.aboutRole && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">About the Role</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{jobDescription.aboutRole}</p>
              </div>
            )}

            {jobDescription.responsibilities && jobDescription.responsibilities.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Detailed Responsibilities</h3>
                <ul className="space-y-1.5">
                  {jobDescription.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {jobDescription.requirements && jobDescription.requirements.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {jobDescription.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {jobDescription.benefits && jobDescription.benefits.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Benefits</h3>
                <ul className="space-y-1.5">
                  {jobDescription.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="p-5">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Hiring Process</h3>
              <p className="text-sm text-gray-600">Our structured hiring process ensures we find the right fit for both you and our team.</p>
            </div>

            <div className="space-y-0">
              {hiringWorkflow.stages && hiringWorkflow.stages.length > 0 ? (
                hiringWorkflow.stages.map((stage, index) => (
                  <div key={stage._id || index} className="relative flex gap-3 pb-6 last:pb-0">
                    {index < hiringWorkflow.stages.length - 1 && (
                      <div className="absolute left-3.5 top-10 w-0.5 h-full bg-gray-300"></div>
                    )}
                    
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 pb-3">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{stage.stage}</h4>
                      </div>
                      <p className="text-xs text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No hiring workflow information available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="p-5 space-y-5">
            {eligibilityCriteria.required && eligibilityCriteria.required.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Required Qualifications</h3>
                <ul className="space-y-1.5">
                  {eligibilityCriteria.required.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {eligibilityCriteria.preferred && eligibilityCriteria.preferred.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Preferred Qualifications</h3>
                <ul className="space-y-1.5">
                  {eligibilityCriteria.preferred.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {eligibilityCriteria.skills && eligibilityCriteria.skills.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {eligibilityCriteria.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(!eligibilityCriteria.required || eligibilityCriteria.required.length === 0) && 
             (!eligibilityCriteria.preferred || eligibilityCriteria.preferred.length === 0) && 
             (!eligibilityCriteria.skills || eligibilityCriteria.skills.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No eligibility criteria information available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
