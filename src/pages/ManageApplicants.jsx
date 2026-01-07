// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../assets/lib/api";

// export default function ManageApplicants() {
//   const { id } = useParams(); // job id
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const res = await api.fetchJob(id);
//       setJob(res.data);
//       setApplicants(res.data.applicants || []);
//     } catch (err) {
//       console.error("Error loading applicants:", err);
//       alert("Failed to load applicants");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line
//   }, [id]);

//   const updateStatus = async (applicationId, payload) => {
//     try {
//       await api.post(`/applications/${applicationId}/status`, payload);
//       alert("Updated");
//       load();
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (!job) return <div className="p-8 text-center text-red-600">Job not found</div>;

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-6">Applicants for: {job.title}</h2>
//       <div className="bg-white shadow rounded-lg p-6">
//         {applicants.length === 0 ? (
//           <div className="text-gray-500 text-center py-8">No applicants yet.</div>
//         ) : (
//           <ul className="space-y-4">
//             {applicants.map((app) => {
//               const name =
//                 app.candidate?.name ||
//                 `${app.candidate?.firstName || ""} ${app.candidate?.lastName || ""}`.trim() ||
//                 app.candidateEmail ||
//                 "Unknown";
//               const email = app.candidate?.email || app.candidateEmail || "—";
//               const stage =
//                 app.stage ||
//                 app.stageWiseStatus?.find((s) => s.status === "in_review")?.stageName ||
//                 "applied";

//               return (
//                 <li
//                   key={app._id}
//                   className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
//                 >
//                   <div>
//                     <div className="font-semibold text-lg">{name}</div>
//                     <div className="text-sm text-gray-500">
//                       {email} • Applied:{" "}
//                       {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}
//                     </div>
//                     <div className="text-sm text-gray-600 mt-1">
//                       Stage: <span className="font-medium capitalize">{stage}</span>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 items-center mt-3 sm:mt-0">
//                     <button
//                       onClick={() => navigate(`/admin/applicants/${app.candidate?._id}`)}
//                       className="px-3 py-2 border rounded hover:bg-gray-100"
//                       title="View applicant details"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() =>
//                         updateStatus(app._id, {
//                           stageName: stage,
//                           action: "reject",
//                           notes: "Rejected by recruiter",
//                         })
//                       }
//                       className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/ManageApplicants.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../assets/lib/api";

// export default function ManageApplicants() {
//   const { id } = useParams(); // job id
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [workflow, setWorkflow] = useState([]); // hiring workflow stages

//   // Load job + applicants
//   const load = async () => {
//     try {
//       setLoading(true);
//       const res = await api.fetchJob(id);
//       setJob(res.data);
//       setApplicants(res.data.applicants || []);
//       setWorkflow(res.data.hiringWorkflow?.stages || []);
//     } catch (err) {
//       console.error("Error loading applicants:", err);
//       alert("Failed to load applicants");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line
//   }, [id]);

//   // Update application status (accept/reject)
// const updateStatus = async (applicationId, stageName, action, notes = "") => {
//   try {
//     const response = await api.put(`/applications/${applicationId}/stage`, {
//       stageName, // e.g. "hr_interview"
//       action,    // "accept" or "reject"
//       notes,     // optional
//     });

//     console.log("Stage updated successfully:", response.data);

//     // Update state locally (optional)
//     setApplicants((prev) =>
//       prev.map((app) =>
//         app._id === applicationId
//           ? { ...app, stage: response.data.application.stage }
//           : app
//       )
//     );
//   } catch (error) {
//     console.error(
//       "Failed to update application status:",
//       error.response?.data || error
//     );
//   }
// };



//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (!job) return <div className="p-8 text-center text-red-600">Job not found</div>;

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-6">
//         Applicants for: {job.title}
//       </h2>
//       <div className="bg-white shadow rounded-lg p-6">
//         {applicants.length === 0 ? (
//           <div className="text-gray-500 text-center py-8">
//             No applicants yet.
//           </div>
//         ) : (
//           <ul className="space-y-4">
//             {applicants.map((app) => {
//               const name =
//                 app.candidate?.name ||
//                 `${app.candidate?.firstName || ""} ${app.candidate?.lastName || ""}`.trim() ||
//                 app.candidateEmail ||
//                 "Unknown";
//               const email = app.candidate?.email || app.candidateEmail || "—";

//               // Determine current stage
//               const currentStage =
//                 app.stage ||
//                 app.stageWiseStatus?.find((s) => s.status === "in_review")?.stageName ||
//                 "Screening";

//               // Find index of current stage in workflow
//               const currentIndex = workflow.findIndex(
//                 (stg) =>
//                   stg.stage.toLowerCase() === currentStage.toLowerCase()
//               );

//               const isFinalStage = currentIndex === workflow.length - 1;
//               const nextStage = workflow[currentIndex + 1];

//               const nextButtonLabel = isFinalStage
//                 ? "Generate Offer Letter"
//                 : `Move to ${nextStage?.stage || "Next Stage"}`;

//               return (
//                 <li
//                   key={app._id}
//                   className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all"
//                 >
//                   {/* Candidate Info */}
//                   <div>
//                     <div className="font-semibold text-lg">{name}</div>
//                     <div className="text-sm text-gray-500">
//                       {email} • Applied:{" "}
//                       {app.appliedAt
//                         ? new Date(app.appliedAt).toLocaleDateString()
//                         : "N/A"}
//                     </div>
//                     <div className="text-sm text-gray-600 mt-1">
//                       Current Stage:{" "}
//                       <span className="font-medium capitalize">
//                         {currentStage}
//                       </span>
//                     </div>
//                     {app.stage === "rejected" && (
//                       <div className="text-red-600 font-medium mt-1">
//                         Status: Rejected
//                       </div>
//                     )}
//                     {app.stage === "hired" && (
//                       <div className="text-green-600 font-medium mt-1">
//                         Status: Hired
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2 items-center mt-3 sm:mt-0">
//                     <button
//                       onClick={() =>
//                         navigate(`/admin/applicants/${app.candidate?._id}`)
//                       }
//                       className="px-3 py-2 border rounded hover:bg-gray-100"
//                     >
//                       View
//                     </button>

//                     {/* Move to Next Stage */}
//                     {app.stage !== "rejected" && app.stage !== "hired" && (
//                       <button
//                         onClick={() =>
//                           updateStatus(app._id, {
//                             stageName: currentStage,
//                             action: "accept",
//                             notes: isFinalStage
//                               ? "Offer letter generated"
//                               : `Moved to next stage: ${nextStage?.stage}`,
//                           })
//                         }
//                         className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                       >
//                         {nextButtonLabel}
//                       </button>
//                     )}

//                     {/* Reject */}
//                     {app.stage !== "rejected" && app.stage !== "hired" && (
//                       <button
//                         onClick={() =>
//                           updateStatus(app._id, {
//                             stageName: currentStage,
//                             action: "reject",
//                             notes: `Rejected at stage ${currentStage}`,
//                           })
//                         }
//                         className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                       >
//                         Reject
//                       </button>
//                     )}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function ManageApplicants() {
    const { id } = useParams(); // job id
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState([]); // hiring workflow stages

    // Load job + applicants
    const load = async () => {
        try {
            setLoading(true);
            const res = await api.fetchJob(id);
            setJob(res.data);
            setApplicants(res.data.applicants || []);
            setWorkflow(res.data.hiringWorkflow?.stages || []);
        } catch (err) {
            console.error("Error loading applicants:", err);
            showError("Failed to load applicants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    // ✅ Update application status (accept/reject)
    const updateStatus = async (applicationId, stageName, action) => {
        try {
            // Normalize stage to lowercase to match backend naming / enums
            const normalizedStage = stageName?.toLowerCase();

            // Backend expects { stageName, action }
            const payload = {
                stageName: normalizedStage,
                action,
            };

            console.log("📤 Sending payload:", payload);

            const response = await api.put(
                `/applications/${applicationId}/stage`,
                payload
            );

            console.log("✅ Stage updated successfully:", response.data);

            const responseData = response.data;

            // Show success toast notification
            if (action === "accept") {
                showSuccess(responseData.message || `Moved to ${formatLabel(responseData.currentStage)}`);
            } else {
                showSuccess(responseData.message || "Applicant rejected");
            }

            // ✅ Update frontend state after successful update
            // Update the applicant with new currentStage and stageDetails from response
            setApplicants((prev) =>
                prev.map((app) =>
                    app._id === applicationId
                        ? {
                              ...app,
                              stage: responseData.currentStage,
                              stageWiseStatus: responseData.stageDetails || app.stageWiseStatus,
                          }
                        : app
                )
            );
        } catch (error) {
            console.error(
                "❌ Failed to update application status:",
                error.response?.data || error
            );
            showError(error.response?.data?.message || "Failed to update stage");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!job) return <div className="p-8 text-center text-red-600">Job not found</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
                Applicants for: {job.title}
            </h2>
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
                                `${app.candidate?.firstName || ""} ${app.candidate?.lastName || ""}`.trim() ||
                                app.candidateEmail ||
                                "Unknown";
                            const email = app.candidate?.email || app.candidateEmail || "—";

                            // Get workflow stages order (this is the actual order for this job)
                            const workflowStages = (Array.isArray(workflow) ? workflow : [])
                                .map((s) => s?.stage)
                                .filter(Boolean);

                            // Use workflow stages order if available, otherwise fallback to STAGE_ORDER
                            // STAGE_ORDER is just for reference/validation, not the actual order
                            const stagesSource = workflowStages.length > 0 ? workflowStages : STAGE_ORDER;

                            // Determine current stage from response or stageWiseStatus
                            // Priority: app.stage (from API response) > stageWiseStatus > first stage
                            let currentStage = null;
                            
                            if (app.stage) {
                                // Use the stage from the application (updated by API)
                                currentStage = app.stage.toLowerCase();
                            } else {
                                // Fallback: find last completed stage from stageWiseStatus
                                const completedStages = (app.stageWiseStatus || [])
                                    .filter((s) => s.status === "completed" && s.action === "accept")
                                    .map((s) => s.stageName?.toLowerCase())
                                    .filter(Boolean);

                                // Find the last completed stage in the workflow order
                                for (let i = stagesSource.length - 1; i >= 0; i--) {
                                    const stageCode = stagesSource[i]?.toLowerCase();
                                    if (completedStages.includes(stageCode)) {
                                        currentStage = stageCode;
                                        break;
                                    }
                                }

                                // If no completed stage found, use the first stage
                                if (!currentStage) {
                                    currentStage = stagesSource[0]?.toLowerCase() || "applied";
                                }
                            }

                            // Find current stage index in workflow
                            const currentIndex = Math.max(
                                0,
                                stagesSource.findIndex(
                                    (s) => s?.toLowerCase() === currentStage
                                )
                            );

                            // Determine next / final stage info
                            const isFinalStage = currentIndex === stagesSource.length - 1;
                            const nextStageCode = stagesSource[currentIndex + 1];

                            // Check if the last stage in the workflow is already completed
                            const lastStageCode = stagesSource[stagesSource.length - 1]?.toLowerCase();
                            const lastStageStatus = (app.stageWiseStatus || []).find(
                                (s) => s.stageName?.toLowerCase() === lastStageCode
                            );
                            const isLastStageCompleted =
                                !!lastStageStatus &&
                                lastStageStatus.status === "completed" &&
                                lastStageStatus.action === "accept";

                            const nextButtonLabel = `${formatLabel(currentStage)} - Cleared`;

                            return (
                                <li
                                    key={app._id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all"
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
                                            <span className="font-medium capitalize">
                                                {formatLabel(currentStage)}
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

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 items-center mt-3 sm:mt-0">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/applicants/${app.candidate?._id}`, {
                                                    state: { jobId: id }
                                                })
                                            }
                                            className="px-3 py-2 border rounded hover:bg-gray-100"
                                        >
                                            View
                                        </button>

                                        {/* Move to Next Stage (hide after final stage is fully completed) */}
                                        {app.stage !== "rejected" && !isLastStageCompleted && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        app._id,
                                                        currentStage,
                                                        "accept"
                                                    )
                                                }
                                                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                {nextButtonLabel}
                                            </button>
                                        )}

                                        {/* Reject */}
                                        {app.stage !== "rejected" && app.stage !== "hired" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        app._id,
                                                        currentStage,
                                                        "reject"
                                                    )
                                                }
                                                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Reject
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
