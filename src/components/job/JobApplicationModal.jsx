import { useState, useEffect } from 'react';
import { 
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Award,
  BookOpen,
  Link2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const JobApplicationModal = ({ isOpen, onClose, job, onApplicationSuccess }) => {
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);
  const [openEduIndex, setOpenEduIndex] = useState(0);
  const [singleEduOpen, setSingleEduOpen] = useState(true);
  const [openExperienceIndex, setOpenExperienceIndex] = useState(-1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStoredToken = () => localStorage.getItem('token') || localStorage.getItem('authToken');

  const getCandidateName = (candidate) => {
    if (!candidate) return 'N/A';
    if (candidate.name) return candidate.name;
    const parts = [candidate.firstName, candidate.middleName, candidate.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return parts || 'N/A';
  };

  const getFullAddress = (candidate) => {
    const permanent = candidate?.permanentAddress;
    const current = candidate?.currentAddress;
    if (permanent && current && permanent !== current) {
      return [
        { label: 'Current', value: current },
        { label: 'Permanent', value: permanent },
      ];
    }
    if (current || permanent) {
      return [{ label: 'Address', value: current || permanent }];
    }
    return [];
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const canPreviewResume = (url) => {
    if (!url) return false;
    return /\.pdf($|\?)/i.test(url);
  };

  useEffect(() => {
    if (isOpen) {
      setCandidateProfile((prev) => prev || user);
      const activeToken = getStoredToken();
      if (!activeToken) {
        setError('Please log in to view your profile details.');
        return;
      }

      let isActive = true;

      const fetchProfile = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
          const [profileResponse, resumeResponse] = await Promise.allSettled([
            apiService.getUserProfile(activeToken),
            apiService.getResume(activeToken),
          ]);

          let profileData = user || null;
          if (profileResponse.status === 'fulfilled') {
            profileData = profileResponse.value?.user || profileResponse.value || profileData;
          }

          if (!isActive) return;
          setCandidateProfile(profileData);

          const resumeUrl =
            (profileData && (profileData.resumeUrl || profileData.resume)) ||
            (resumeResponse.status === 'fulfilled' ? resumeResponse.value?.resumeUrl : null) ||
            null;

          setResumePreviewUrl(resumeUrl);
        } catch (err) {
          console.error('Failed to load candidate profile:', err);
          if (isActive) {
            setError('Unable to load your profile details. Please update your profile and try again.');
          }
        } finally {
          if (isActive) {
            setLoadingProfile(false);
          }
        }
      };

      fetchProfile();

      return () => {
        isActive = false;
      };
    } else {
      setCandidateProfile(null);
      setResumePreviewUrl(null);
      setError(null);
      setIsSubmitting(false);
      setLoadingProfile(false);
      setOpenEduIndex(0);
      setSingleEduOpen(true);
      setOpenExperienceIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!job?._id) {
      setError('Select a job before applying.');
      return;
    }
    const activeToken = getStoredToken();
    if (!activeToken) {
      setError('Please log in to apply for this job.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiService.applyForJob(job._id, activeToken);
      if (response?.message) {
        onClose?.();
        onApplicationSuccess?.(job._id, response);
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
    }
  };

  if (!isOpen) return null;

  const profile = candidateProfile;
  const resumeUrl = resumePreviewUrl;
  const experiences = profile?.experiences || profile?.experience || [];
  const educationList = Array.isArray(profile?.education)
    ? profile.education
    : profile?.education
      ? [profile.education]
      : [];
  const certifications = Array.isArray(profile?.certifications)
    ? profile.certifications
    : [];
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const addressList = getFullAddress(profile);
  const hasProfileData = Boolean(profile);

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

      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-300/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-8 -left-6 w-72 h-72 bg-purple-300/20 blur-3xl rounded-full" />
      </div>

      {/* Modal */}
      <div className="relative max-w-4xl w-full mx-4 md:mx-0">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] shadow-[0_25px_80px_rgba(15,23,42,0.25)] ring-1 ring-white/40 border border-white/30 overflow-hidden animate-[fadeIn_200ms_ease-out] flex flex-col max-h-[92vh]">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-white/90">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Final Review
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Application Preview</h2>
              {job?.title && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Review your profile before applying for{' '}
                  <span className="font-semibold text-gray-900">{job.title}</span>.
                </p>
              )}
            </div>
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
          <div className="p-6 lg:p-8 overflow-y-auto space-y-7 bg-gradient-to-b from-white/90 via-white/70 to-white/90">
            {loadingProfile && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="ml-2 text-sm text-gray-600">Loading your profile details…</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
                <AlertCircle size={18} className="mt-0.5" />
                <div>
                  <p className="font-semibold">Heads up</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loadingProfile && !hasProfileData && !error && (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">We couldn&apos;t find your profile details. Please complete your candidate profile before applying.</p>
                <button
                  type="button"
                  onClick={() => { handleClose(); navigate('/profile'); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to My Profile
                </button>
              </div>
            )}

            {hasProfileData && (
              <>
                {/* Primary profile card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 lg:p-7 grid gap-6 md:grid-cols-[1fr_2fr]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-white shadow-md mb-3 bg-gradient-to-br from-blue-50 to-purple-50">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={getCandidateName(profile)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-lg">
                          {getCandidateName(profile).charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{getCandidateName(profile)}</h3>
                    <p className="text-sm text-gray-500">{profile?.designation || 'Aspiring Candidate'}</p>
                    <div className="mt-4 space-y-2 text-sm text-gray-600 w-full">
                      <div className="flex items-center justify-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="break-all">{profile?.email || 'N/A'}</span>
                      </div>
                      {profile?.phoneNumber && (
                        <div className="flex items-center justify-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>{profile.phoneNumber}</span>
                        </div>
                      )}
                      {profile?.location && (
                        <div className="flex items-start justify-center gap-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                          <User size={14} />
                          Personal Info
                        </div>
                        <p><span className="text-gray-500">Gender:</span> {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '—'}</p>
                        <p><span className="text-gray-500">DOB:</span> {formatDate(profile?.DOB)}</p>
                        {profile?.experienceSummary && (
                          <p><span className="text-gray-500">Experience:</span> {profile.experienceSummary}</p>
                        )}
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50/60 to-white rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                          <Briefcase size={14} />
                          Professional Summary
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {profile?.bio || profile?.summary || 'Add a short professional summary from your profile page.'}
                        </p>
                      </div>
                    </div>

                    {addressList.length > 0 && (
                      <div className="p-4 bg-gradient-to-br from-purple-50/60 to-white rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                          <MapPin size={14} />
                          Addresses
                        </div>
                        <div className="space-y-1.5">
                          {addressList.map((item) => (
                            <p key={item.label} className="text-sm text-gray-700">
                              <span className="text-gray-500">{item.label}:</span> {item.value}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      <CheckCircle size={16} className="text-green-500" />
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={`${skill}-${idx}`}
                          className="px-3 py-1 text-xs font-semibold rounded-full border border-blue-100 text-blue-700 bg-blue-50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {educationList.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      <BookOpen size={16} />
                      Education
                    </div>
                    <div className="space-y-3">
                      {educationList.map((edu, idx) => {
                        const isOpen = openEduIndex === idx;
                        return (
                          <div key={`${edu._id || idx}`} className="border border-gray-100 rounded-xl">
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
                              onClick={() => setOpenEduIndex(isOpen ? -1 : idx)}
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{edu.programOrDegree || edu.degree || 'Program'}</p>
                                <p className="text-xs text-gray-500">{edu.institution || edu.boardOrUniversity || 'Institution'}</p>
                              </div>
                              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-3 text-sm text-gray-700 space-y-1">
                                {edu.branchOrSpecialization && <p><span className="text-gray-500">Specialization:</span> {edu.branchOrSpecialization}</p>}
                                {edu.passedYear && <p><span className="text-gray-500">Year:</span> {edu.passedYear}</p>}
                                {edu.percentageOrCGPA && <p><span className="text-gray-500">Score:</span> {edu.percentageOrCGPA}</p>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {Array.isArray(experiences) && experiences.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      <Briefcase size={16} />
                      Experience
                    </div>
                    <div className="space-y-3">
                      {experiences.map((exp, idx) => {
                        const isOpen = openExperienceIndex === idx;
                        const start = formatDate(exp.startDate || exp.start);
                        const end = exp.endDate ? formatDate(exp.endDate) : 'Present';
                        return (
                          <div key={`${exp._id || idx}`} className="border border-gray-100 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
                              onClick={() => setOpenExperienceIndex(isOpen ? -1 : idx)}
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{exp.designation || exp.role || 'Role'}</p>
                                <p className="text-xs text-gray-500">{exp.companyName || exp.company || 'Company'} · {start} - {end}</p>
                              </div>
                              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-3 text-sm text-gray-700 space-y-1">
                                {exp.responsibilities && <p>{exp.responsibilities}</p>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      <Award size={16} className="text-amber-500" />
                      Certifications
                    </div>
                    <div className="space-y-2">
                      {certifications.map((cert, idx) => (
                        <div key={`${cert._id || idx}`} className="flex items-start justify-between border border-gray-100 rounded-xl px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{cert.certificationName || cert.name}</p>
                            <p className="text-xs text-gray-500">
                              {cert.issuedBy && `Issued by ${cert.issuedBy}`}
                              {cert.issuedDate && ` · ${formatDate(cert.issuedDate)}`}
                            </p>
                            {cert.description && <p className="text-xs text-gray-600 mt-1">{cert.description}</p>}
                          </div>
                          {cert.certificateUrl && (
                            <a
                              href={cert.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1"
                            >
                              <Link2 size={14} />
                              View
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume preview */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_40px_rgba(15,23,42,0.09)] p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      <FileText size={16} />
                      Resume Preview
                    </div>
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 hover:bg-blue-100 transition"
                      >
                        <Link2 size={15} />
                        Open in new tab
                      </a>
                    )}
                  </div>
                  {resumeUrl ? (
                    <div className="rounded-2xl border border-gray-200 overflow-hidden h-72 bg-gray-50">
                      {canPreviewResume(resumeUrl) ? (
                        <iframe
                          src={`${resumeUrl}#toolbar=0`}
                          title="Resume preview"
                          className="w-full h-full bg-white"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-500">
                          Resume preview is available only for PDF files. Use the link above to view it.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No resume found. Please upload your resume on the profile page.
                    </div>
                  )}
                </div>

                {/* Callout */}
                <p className="text-xs text-gray-600">
                  Need to update anything?{' '}
                  <button
                    type="button"
                    onClick={() => { handleClose(); navigate('/profile'); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit profile details
                  </button>.
                </p>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-white transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !hasProfileData}
                    className="flex-1 px-4 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
