import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../assets/lib/api";
import { showError, showSuccess } from "../utils/notify";

const STAGE_ORDER = [
  "applied",
  "resume_shortlisted",
  "screening_test",
  "group_discussion",
  "technical_interview",
  "manager_interview",
  "hr_interview",
  "selected",
  "offered",
  "rejected",
  "hired",
];

const formatLabel = (value) =>
  value
    ? value
        .toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

export default function ApplicantDetails() {
  const { userId } = useParams(); // from /admin/jobs/:id/applicants/:userId
  const nav = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [workflow, setWorkflow] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Get jobId from location state (if navigated from ManageApplicants) or search params
  const jobId = location.state?.jobId || new URLSearchParams(location.search).get('jobId');

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}`);
      setUser(res.data.user); // backend returns { user: { ... } }

      // If jobId is available, fetch job and application data
      if (jobId) {
        try {
          const jobRes = await api.fetchJob(jobId);
          setJob(jobRes.data);
          setWorkflow(jobRes.data.hiringWorkflow?.stages || []);
          
          // Find the application for this user
          const userApplication = jobRes.data.applicants?.find(
            (app) => app.candidate?._id === userId || app.candidate?._id === user._id
          );
          if (userApplication) {
            setApplication(userApplication);
          }
        } catch (err) {
          console.error("Failed to fetch job/application data:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant details:", err);
      showError("Failed to load applicant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId, jobId]);

  // Update application status (move to next stage or reject)
  const updateStatus = async (nextStageName, action, notes = "") => {
    if (!application?._id) {
      showError("Application not found. Please navigate from the applicants list.");
      return;
    }

    // Guard: if this job has no configured workflow, avoid calling the API
    if (!workflow || workflow.length === 0) {
      showError(
        "No stages configured for this job. Please add stages in the job workflow before moving applicants."
      );
      return;
    }

    try {
      setProcessing(true);
      const normalizedStage = nextStageName?.toLowerCase();

      // Backend expects { stageName, action }
      const payload = {
        stageName: normalizedStage,
        action,
      };

      const response = await api.put(
        `/applications/${application._id}/stage`,
        payload
      );

      // Update local state
      setApplication((prev) => ({
        ...prev,
        stage: response.data.application.stage,
      }));

      showSuccess(
        action === "accept"
          ? `Moved to ${formatLabel(nextStageName)}`
          : "Applicant rejected"
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
      showError(error.response?.data?.message || "Failed to update stage");
    } finally {
      setProcessing(false);
    }
  };

  // Calculate next stage based on last accepted/completed stage
  const getNextStageInfo = () => {
    if (!application || !job) return null;

    const customStages = (Array.isArray(workflow) ? workflow : [])
      .map((s) => s?.stage)
      .filter(Boolean);

    const orderedStages = [
      ...STAGE_ORDER.filter((stage) =>
        customStages.some((s) => s?.toLowerCase() === stage)
      ),
      ...customStages.filter(
        (s) => !STAGE_ORDER.includes(s?.toLowerCase?.())
      ),
    ];

    const stagesSource = orderedStages.length ? orderedStages : STAGE_ORDER;

    // Last accepted/completed stage from stageWiseStatus
    const acceptedStageNames = (application.stageWiseStatus || [])
      .filter((s) => s.status === "completed" && s.action === "accept")
      .map((s) => s.stageName?.toLowerCase())
      .filter(Boolean);

    let lastAcceptedStage = null;
    stagesSource.forEach((stageCode) => {
      if (acceptedStageNames.includes(stageCode.toLowerCase())) {
        lastAcceptedStage = stageCode;
      }
    });

    const currentStageRaw =
      lastAcceptedStage ||
      stagesSource[0] ||
      "applied";

    const currentStage = currentStageRaw.toLowerCase();
    const currentIndex = Math.max(
      0,
      stagesSource.findIndex((s) => s?.toLowerCase() === currentStage)
    );

    const isFinalStage = currentIndex === stagesSource.length - 1;
    const nextStageCode = stagesSource[currentIndex + 1];

    return {
      currentStage,
      currentIndex,
      isFinalStage,
      nextStageCode,
      stagesSource,
    };
  };

  const stageInfo = getNextStageInfo();

  if (loading) return <div className="p-8">Loading applicant details...</div>;
  if (!user) return <div className="p-8 text-red-600">Applicant not found</div>;

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => nav(-1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Back
        </button>

        {/* Action Buttons - Only show if application and job data are available */}
        {application && job && stageInfo && (
          <div className="flex gap-2">
            {application.stage !== "rejected" && application.stage !== "hired" && (
              <>
                <button
                  onClick={() =>
                    stageInfo.isFinalStage
                      ? updateStatus(
                          "hired",
                          "accept",
                          "Offer letter generated and applicant hired"
                        )
                      : updateStatus(
                          stageInfo.nextStageCode,
                          "accept",
                          `Moved to next stage: ${formatLabel(stageInfo.nextStageCode)}`
                        )
                  }
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing
                    ? "Processing..."
                    : stageInfo.isFinalStage
                    ? "Generate Offer Letter"
                    : `Move to ${formatLabel(stageInfo.nextStageCode) || "Next Stage"}`}
                </button>
                <button
                  onClick={() =>
                    updateStatus(
                      stageInfo.currentStage,
                      "reject",
                      `Rejected at stage ${stageInfo.currentStage}`
                    )
                  }
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </>
            )}
            {application.stage === "rejected" && (
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-md">
                Status: Rejected
              </span>
            )}
            {application.stage === "hired" && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-md">
                Status: Hired
              </span>
            )}
          </div>
        )}
      </div>

      {/* Current Stage Display */}
      {application && stageInfo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Current Stage:{" "}
            <span className="font-semibold text-gray-800">
              {formatLabel(stageInfo.currentStage)}
            </span>
          </p>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 w-full md:max-w-xs flex flex-col items-center">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover mb-3 border"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-1">{formatLabel(user.role)}</p>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <a
            href={user.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 mt-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Resume
          </a>
          <div className="flex gap-3 mt-1">
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                LinkedIn
              </a>
            )}
            {user.socialLinks?.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Main Details */}
        <div className="flex-1">
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">{user.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">DOB</p>
                <p className="font-medium">
                  {user.DOB ? new Date(user.DOB).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{user.phoneNumber || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">PAN</p>
                <p className="font-medium">{user.pan || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Permanent Address</p>
                <p className="font-medium">{user.permanentAddress || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Address</p>
                <p className="font-medium">{user.currentAddress || "—"}</p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Education</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">Degree</th>
                    <th className="px-4 py-3 text-sm font-semibold">Institution</th>
                    <th className="px-4 py-3 text-sm font-semibold">Board / University</th>
                    <th className="px-4 py-3 text-sm font-semibold text-center">Year</th>
                    <th className="px-4 py-3 text-sm font-semibold text-center">CGPA / %</th>
                    <th className="px-4 py-3 text-sm font-semibold">Specialization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                  {user.education.map((edu, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{formatLabel(edu.programOrDegree)}</td>
                      <td className="px-4 py-3">{formatLabel(edu.institution)}</td>
                      <td className="px-4 py-3">{formatLabel(edu.boardOrUniversity)}</td>
                      <td className="px-4 py-3 text-center">{formatLabel(edu.passedYear)}</td>
                      <td className="px-4 py-3 text-center">{formatLabel(edu.percentageOrCGPA)}</td>
                      <td className="px-4 py-3">{formatLabel(edu.branchOrSpecialization)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(user.educationGapFlags && user.educationGapFlags.length > 0) || 
             (user.educationGaps && user.educationGaps.length > 0) ? (
              <ul className="mt-4 ml-3 text-yellow-700 text-base list-disc">
                {(user.educationGapFlags || user.educationGaps || []).map((flag, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Experience Section */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Experience</h3>
            {user.experiences && user.experiences.length > 0 ? (
              <div className="space-y-4">
                {user.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-800 mb-1">
                          {formatLabel(exp.designation)}
                        </div>
                        <div className="text-gray-600 font-medium mb-2">
                          {formatLabel(exp.companyName)}
                        </div>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {exp.startDate && (
                          <span>
                            {new Date(exp.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                        {exp.startDate && (exp.endDate || !exp.endDate) && (
                          <span className="mx-1">-</span>
                        )}
                        {exp.endDate ? (
                          <span>
                            {new Date(exp.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">Present</span>
                        )}
                      </div>
                    </div>
                    {exp.responsibilities && (
                      <div className="text-gray-700 text-sm mt-3 pt-3 border-t border-gray-200">
                        <p className="font-medium text-gray-600 mb-1">Key Responsibilities:</p>
                        <p className="whitespace-pre-line">{exp.responsibilities}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No work experience added.</p>
            )}
            {user.careerGapFlags && user.careerGapFlags.length > 0 && (
              <ul className="mt-4 ml-3 text-yellow-700 text-base list-disc">
                {user.careerGapFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Skills</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                  >
                    {formatLabel(skill)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills listed.</p>
            )}
          </div>

          {/* Certifications Section */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Certifications
            </h3>
            {user.certifications && user.certifications.length > 0 ? (
              <ul className="space-y-3">
                {user.certifications.map((cert, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg p-3 bg-gray-50 hover:bg-white transition"
                  >
                    <div className="font-semibold text-gray-800">
                      {formatLabel(cert.certificationName)}
                    </div>
                    <div className="text-gray-600 text-xs mb-1 flex flex-wrap gap-2">
                      <span>{formatLabel(cert.issuedBy)}</span>
                      {cert.issuedDate && (
                        <span>• {new Date(cert.issuedDate).toLocaleDateString()}</span>
                      )}
                      {cert.expiryDate && (
                        <span>
                          • Expiry: {new Date(cert.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {formatLabel(cert.description)}
                    </div>
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        className="text-blue-700 underline text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Certificate
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No certifications added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
