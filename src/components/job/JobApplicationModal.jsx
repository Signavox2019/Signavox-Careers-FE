import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, ChevronDown, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const JobApplicationModal = ({ isOpen, onClose, job, onApplicationSuccess }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openEduIndex, setOpenEduIndex] = useState(0);
  const [singleEduOpen, setSingleEduOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please select a resume file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await apiService.applyForJob(job._id, resumeFile, token);
      
      if (response.message === 'Application submitted successfully') {
        setSuccess(true);
        setTimeout(() => {
          onApplicationSuccess(job._id);
          onClose();
          setSuccess(false);
          setResumeFile(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Application error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setResumeFile(null);
      setError(null);
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/45 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative max-w-3xl w-full mx-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-gray-200 border border-transparent overflow-hidden animate-[fadeIn_180ms_ease-out] flex flex-col max-h-[80vh]">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white/85">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Apply for Job</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/80 transition disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600">Your application has been successfully submitted.</p>
            </div>
          ) : (
            <>
              {/* Applicant Info */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-3">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-gray-200"><User size={14} className="text-gray-600" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-gray-200"><Mail size={14} className="text-gray-600" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  {user?.phoneNumber && (
                    <div className="flex items-start gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-gray-200"><Phone size={14} className="text-gray-600" /></span>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-start gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-gray-200"><MapPin size={14} className="text-gray-600" /></span>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{user.location}</p>
                      </div>
                    </div>
                  )}
                  {user?.experience && (
                    <div className="md:col-span-2 flex items-start gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-gray-200"><Briefcase size={14} className="text-gray-600" /></span>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-medium text-gray-900">
                          {typeof user.experience === 'object' && user.experience !== null ? (
                            <span>
                              {user.experience.years ? `${user.experience.years} year${user.experience.years === 1 ? '' : 's'}` : ''}
                              {user.experience.months ? `${user.experience.years ? ' ' : ''}${user.experience.months} month${user.experience.months === 1 ? '' : 's'}` : ''}
                            </span>
                          ) : (
                            <span>{user.experience}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {user?.education && (
                    <div>
                      <p className="mb-1"><span className="text-gray-600">Education:</span></p>
                      <div className="divide-y divide-gray-100 border border-gray-100 rounded-md bg-white/80">
                        {Array.isArray(user.education) ? (
                          user.education.map((edu, idx) => {
                            const isOpen = openEduIndex === idx;
                            return (
                              <div key={idx} className="">
                                <button
                                  type="button"
                                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition"
                                  onClick={() => setOpenEduIndex(isOpen ? -1 : idx)}
                                >
                                  <span className="font-medium text-gray-900">
                                    {edu.programOrDegree || edu.degree || 'Program'}{edu.branchOrSpecialization || edu.field ? `, ${edu.branchOrSpecialization || edu.field}` : ''}
                                  </span>
                                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isOpen && (
                                  <div className="px-3 pb-3 text-xs text-gray-700 space-x-3">
                                    {edu.institution && <span>Institute: {edu.institution}</span>}
                                    {edu.boardOrUniversity && <span>Board/Univ: {edu.boardOrUniversity}</span>}
                                    {edu.passedYear && <span>Year: {edu.passedYear}</span>}
                                    {edu.percentageOrCGPA && <span>Score: {edu.percentageOrCGPA}</span>}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : typeof user.education === 'object' ? (
                          <div>
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition"
                              onClick={() => setSingleEduOpen(!singleEduOpen)}
                            >
                              <span className="font-medium text-gray-900">
                                {user.education.programOrDegree || user.education.degree || 'Program'}{user.education.branchOrSpecialization || user.education.field ? `, ${user.education.branchOrSpecialization || user.education.field}` : ''}
                              </span>
                              <ChevronDown size={16} className={`text-gray-500 transition-transform ${singleEduOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {singleEduOpen && (
                              <div className="px-3 pb-3 text-xs text-gray-700 space-x-3">
                                {user.education.institution && <span>Institute: {user.education.institution}</span>}
                                {user.education.boardOrUniversity && <span>Board/Univ: {user.education.boardOrUniversity}</span>}
                                {user.education.passedYear && <span>Year: {user.education.passedYear}</span>}
                                {user.education.percentageOrCGPA && <span>Score: {user.education.percentageOrCGPA}</span>}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="px-3 py-2">{user.education}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {user?.linkedin && (
                    <p className="truncate"><span className="text-gray-600">LinkedIn:</span>{' '}<a href={user.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{user.linkedin}</a></p>
                  )}
                  {user?.github && (
                    <p className="truncate"><span className="text-gray-600">GitHub:</span>{' '}<a href={user.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{user.github}</a></p>
                  )}
                  {user?.portfolio && (
                    <p className="truncate"><span className="text-gray-600">Portfolio:</span>{' '}<a href={user.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{user.portfolio}</a></p>
                  )}
                  {user?.skills && Array.isArray(user.skills) && user.skills.length > 0 && (
                    <div>
                      <p className="mb-1"><span className="text-gray-600">Skills:</span></p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-800">
                        {user.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-gray-100">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {user?.bio && (
                    <div>
                      <p className="mb-1"><span className="text-gray-600">Bio:</span></p>
                      <p className="leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-600">
                  To change your details,{' '}
                  <button type="button" onClick={() => { handleClose(); navigate('/profile'); }} className="text-blue-600 hover:underline">
                    click here
                  </button>.
                </p>
              </div>

              {/* File Upload */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume *
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300/80 rounded-2xl p-6 text-center hover:border-blue-300/80 transition-colors bg-white/70">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FileText size={22} />
                          <span className="font-medium">{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-600">
                          <Upload size={28} />
                          <span className="font-medium">Click to upload resume</span>
                          <span className="text-xs">PDF, DOC, DOCX (Max 5MB)</span>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300/70 text-gray-700 rounded-xl hover:bg-white/70 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!resumeFile || isSubmitting}
                    className="flex-1 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
