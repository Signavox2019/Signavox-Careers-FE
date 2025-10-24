import { MapPin, Briefcase, Clock, CheckCircle, Calendar } from 'lucide-react';

const JobCard = ({ job, isSelected, onClick, isApplied = false }) => {
  // Calculate days since posted
  const getDaysSincePosted = (postedDate) => {
    const today = new Date();
    const posted = new Date(postedDate);
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

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
              job.status === 'Active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {job.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} />
              {job.department}
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
              {job.summary?.overview || 'No overview available for this position.'}
            </p>
          </div>

          {/* Posted Duration */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} />
              Posted {getDaysSincePosted(job.postedDate)}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {job.experience}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
