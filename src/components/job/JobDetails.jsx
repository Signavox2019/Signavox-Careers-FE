import { useState } from 'react';
import { 
  MapPin, Briefcase, Clock, DollarSign, Users, 
  Calendar, CheckCircle, ArrowRight 
} from 'lucide-react';

const JobDetails = ({ job }) => {
  const [activeTab, setActiveTab] = useState('summary');

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
            {job.title}
          </h1>
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm ml-4">
            Apply Now
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Briefcase size={14} />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock size={14} />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <DollarSign size={14} />
            <span>{job.salary}</span>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{job.applicants} applicants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Posted {new Date(job.postedDate).toLocaleDateString('en-US', { 
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
              <p className="text-sm text-gray-700 leading-relaxed">{job.summary.overview}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
              <ul className="space-y-1.5">
                {job.summary.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Required Qualifications</h3>
              <ul className="space-y-1.5">
                {job.summary.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <ArrowRight size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="p-5">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Hiring Process Timeline</h3>
              <p className="text-sm text-gray-600">{job.hiringWorkflow.timeline}</p>
            </div>

            <div className="space-y-0">
              {job.hiringWorkflow.stages.map((stage, index) => (
                <div key={index} className="relative flex gap-3 pb-6 last:pb-0">
                  {index < job.hiringWorkflow.stages.length - 1 && (
                    <div className="absolute left-3.5 top-10 w-0.5 h-full bg-gray-300"></div>
                  )}
                  
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-base">
                    {stage.icon}
                  </div>
                  
                  <div className="flex-1 pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{stage.stage}</h4>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {stage.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Required Qualifications</h3>
              <ul className="space-y-1.5">
                {job.eligibilityCriteria.required.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Preferred Qualifications</h3>
              <ul className="space-y-1.5">
                {job.eligibilityCriteria.preferred.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.eligibilityCriteria.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
