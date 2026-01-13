

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../assets/lib/api";
import { showSuccess, showError } from "../utils/notify";

const STAGE_ORDER_FALLBACK = [
  "applied",
  "resume_shortlisted",
  "screening_test",
  "group_discussion",
  "technical_interview",
  "manager_interview",
  "hr_interview",
  "selected",
  "offered",
  "hired",
];

const formatStage = (value) =>
  value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

const formatLabel = (value) =>
  value
    ? value
        .toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

export default function RecruiterManageApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [workflow, setWorkflow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({}); // Track processing state per applicant

  // Load job + applicants
  const load = async () => {
    try {
      setLoading(true);
      const res = await api.fetchJob(id);

      setJob(res.data);
      setApplicants(res.data.applicants || []);
      setWorkflow(res.data.hiringWorkflow?.stages || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Update application status
  const updateStatus = async (applicationId, stageName, action, notes = "") => {
    try {
      setProcessing((prev) => ({ ...prev, [applicationId]: true }));
      const normalizedStage = stageName?.toLowerCase();

      const res = await api.put(`/applications/${applicationId}/stage`, {
        stageName: normalizedStage,
        action,
        notes,
      });

      // ✅ SHOW SUCCESS TOAST
      if (action === "accept") {
        const formattedStage = formatLabel(res.data.currentStage || normalizedStage);
        // If backend message exists, use it; otherwise create formatted message
        const message = res.data.message 
          ? res.data.message.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : `Stage cleared: ${formattedStage}`;
        showSuccess(message);
      } else {
        const formattedStage = formatLabel(normalizedStage);
        const message = res.data.message 
          ? res.data.message.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : `Applicant rejected at ${formattedStage}`;
        showSuccess(message);
      }

      // Update state
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? {
                ...app,
                stage: res.data.currentStage,
                stageWiseStatus: res.data.stageDetails,
              }
            : app
        )
      );
    } catch (error) {
      console.error(error);

      // ✅ SHOW ERROR TOAST
      showError(error.response?.data?.message || "Failed to update stage");
    } finally {
      setProcessing((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!job)
    return <div className="p-8 text-center text-red-600">Job not found</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Applicants for: {job.title}</h2>

      <div className="bg-white shadow rounded-lg p-6">
        {applicants.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No applicants yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {applicants.map((app) => {
              const name =
                app.candidate?.name ||
                `${app.candidate?.firstName || ""} ${
                  app.candidate?.lastName || ""
                }`.trim() ||
                app.candidateEmail ||
                "Unknown";

              const email = app.candidate?.email || app.candidateEmail || "—";

              // Workflow source (backend > fallback)
              const workflowStages = workflow
                .map((s) => s?.stage)
                .filter(Boolean);

              const stagesSource =
                workflowStages.length > 0
                  ? workflowStages
                  : STAGE_ORDER_FALLBACK;

              // Determine current stage
              let currentStage = app.stage?.toLowerCase();

              if (!currentStage) {
                const completedStages = (app.stageWiseStatus || [])
                  .filter(
                    (s) => s.status === "completed" && s.action === "accept"
                  )
                  .map((s) => s.stageName?.toLowerCase());

                for (let i = stagesSource.length - 1; i >= 0; i--) {
                  if (completedStages.includes(stagesSource[i])) {
                    currentStage = stagesSource[i];
                    break;
                  }
                }

                if (!currentStage) {
                  currentStage = stagesSource[0];
                }
              }

              const currentIndex = Math.max(
                0,
                stagesSource.findIndex((s) => s.toLowerCase() === currentStage)
              );

              const nextStage = stagesSource[currentIndex + 1];
              const isFinalStage = !nextStage;

              return (
                <li
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  {/* Candidate Info */}
                  <div>
                    <div className="font-semibold text-lg">{name}</div>
                    <div className="text-sm text-gray-500">
                      {email} • Applied:{" "}
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Current Stage:{" "}
                      <span className="font-medium">
                        {formatStage(currentStage)}
                      </span>
                    </div>

                    {app.stage === "rejected" && (
                      <div className="text-red-600 font-medium mt-1">
                        Status: Rejected
                      </div>
                    )}

                    {app.stage === "hired" && (
                      <div className="text-green-600 font-medium mt-1">
                        Status: Hired
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 items-center mt-3 sm:mt-0">
                    <button
                      onClick={() =>
                        navigate(`/recruiter/applicants/${app.candidate?._id}`, {
                          state: { jobId: id }
                        })
                      }
                      className="px-3 py-2 border rounded hover:bg-gray-100"
                    >
                      View
                    </button>

                    {app.stage !== "rejected" && app.stage !== "hired" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            currentStage,
                            "accept",
                            isFinalStage
                              ? "Final stage cleared"
                              : `Cleared ${formatStage(currentStage)}`
                          )
                        }
                        disabled={processing[app._id]}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing[app._id] ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>{formatLabel(currentStage)}</span>
                            <span
                              className="inline-flex items-center justify-center text-green-600 bg-green-100 rounded-full w-6 h-6"
                              title="Cleared"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 6.293a1 1 0 00-1.414 0l-5.293 5.293-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </span>
                        )}
                      </button>
                    )}

                    {app.stage !== "rejected" && app.stage !== "hired" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            currentStage,
                            "reject",
                            `Rejected at ${currentStage}`
                          )
                        }
                        disabled={processing[app._id]}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing[app._id] ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
