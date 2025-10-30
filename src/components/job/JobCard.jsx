import { MapPin, Briefcase, Clock, CheckCircle, Calendar } from 'lucide-react';

const JobCard = ({ job, isSelected, onClick, isApplied = false }) => {
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

  // Get job category from API data structure
  const jobCategory = job.jobDescription?.category || 'Other';
  const jobOverview = job.jobDescription?.summary?.overview || 'No overview available for this position.';
  const jobStatus = job.status === 'open' ? 'Active' : 'Closed';

  return (
    <div 
      className={`job-card px-4 py-6 border-b border-gray-200 cursor-pointer transition-all duration-300 group ${
        isSelected 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm' 
          : 'bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-l-4 border-l-transparent hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {job.title}
              </h3>
              {isApplied && (
                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
              )}
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded flex-shrink-0 ${
              jobStatus === 'Active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {jobStatus}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} />
              {jobCategory}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {job.type}
            </span>
          </div>

          {/* Job Overview */}
          <div className="mb-2">
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {jobOverview}
            </p>
          </div>

          {/* Posted Duration */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} />
              Posted {getTimeSincePosted(job.postedDate)}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium">
                {job.experience}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
