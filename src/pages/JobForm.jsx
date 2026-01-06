// // src/pages/JobForm.jsx
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../assets/lib/api';

// export default function JobForm() {
//   const { id } = useParams(); // if id exists -> edit
//   const navigate = useNavigate();
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [existing, setExisting] = useState(null);

//   useEffect(() => {
//     if (id) {
//       (async () => {
//         try {
//           const res = await api.fetchJob(id);
//           setExisting(res.data);
//           // prefill certain fields
//           const job = res.data;
//           setValue('title', job.title);
//           setValue('location', job.location);
//           setValue('type', job.type);
//           setValue('experience', job.experience);
//           setValue('closingDate', job.closingDate?.split('T')[0] || job.closingDate);
//           // jobDescription fields can be stringified for editing as JSON block (simple approach)
//           setValue('jobDescription', JSON.stringify(job.jobDescription || {}, null, 2));
//           setValue('hiringWorkflow', JSON.stringify(job.hiringWorkflow || {}, null, 2));
//           setValue('eligibilityCriteria', JSON.stringify(job.eligibilityCriteria || {}, null, 2));
//         } catch (err) {
//           console.error(err);
//           alert('Failed to load job for editing');
//         }
//       })();
//     }
//   }, [id, setValue]);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('title', data.title);
//       formData.append('location', data.location);
//       formData.append('type', data.type);
//       formData.append('experience', data.experience || '');
//       formData.append('closingDate', data.closingDate || '');
//       formData.append('assignedTo', data.assignedTo || '');

//       // pass JSON fields as text so server JSON.parse() works like your controller expects
//       formData.append('jobDescription', data.jobDescription || '{}');
//       formData.append('hiringWorkflow', data.hiringWorkflow || '{}');
//       formData.append('eligibilityCriteria', data.eligibilityCriteria || '{}');

//       // files
//       if (data.documents?.length) {
//         Array.from(data.documents).forEach((file) => formData.append('document', file));
//       }

//       const config = { headers: { 'Content-Type': 'multipart/form-data' } };

//       if (id) {
//         await api.updateJob(id, formData, config);
//         alert('Job updated.');
//       } else {
//         await api.createJob(formData, config);
//         alert('Job created.');
//       }

//       navigate('/admin');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save job');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Job' : 'Create New Job'}</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-2xl shadow">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input {...register('title', { required: true })} placeholder="Job Title" className="input" />
//           <input {...register('location', { required: true })} placeholder="Location" className="input" />
//           <select {...register('type')} className="input">
//             <option>Full-Time</option>
//             <option>Part-Time</option>
//             <option>Internship</option>
//             <option>Contract</option>
//             <option>Remote</option>
//           </select>
//           <input {...register('experience')} placeholder="Experience (e.g., 2+ years)" className="input" />
//           <input {...register('closingDate')} type="date" className="input" />
//           <input {...register('assignedTo')} placeholder="AssignedTo (userId)" className="input" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Job Description (JSON)</label>
//           <textarea {...register('jobDescription')} rows={6} className="w-full border rounded-md p-3 font-mono text-sm" placeholder='{"overview":"..."}'></textarea>
//           <p className="text-sm text-gray-400 mt-1">You can paste JSON for jobDescription; controller will parse it.</p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Hiring Workflow (JSON)</label>
//           <textarea {...register('hiringWorkflow')} rows={4} className="w-full border rounded-md p-3 font-mono text-sm" placeholder='{"stages":[{"stage":"Screen","description":"..."}]}' />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Eligibility Criteria (JSON)</label>
//           <textarea {...register('eligibilityCriteria')} rows={4} className="w-full border rounded-md p-3 font-mono text-sm" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Upload Documents</label>
//           <input {...register('documents')} type="file" multiple className="w-full" />
//         </div>

//         <div className="flex gap-2">
//           <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
//             {id ? 'Update Job' : 'Create Job'}
//           </button>
//           <button type="button" onClick={() => navigate('/admin')} className="px-4 py-2 border rounded-xl">Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// }


// src/pages/JobForm.jsx


// src/pages/JobForm.jsx

// src/pages/JobForm.jsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Plus, File, Calendar, Users, X } from "lucide-react";
import api from "../assets/lib/api";

const HIRING_STAGE_OPTIONS = [
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

export default function JobForm() {
  const { id } = useParams(); // if id exists -> edit
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      type: "Full-Time",
      experience: "",
      closingDate: "",
      assignedTo: "",
      status: "open",
      jobDescription: {
        ctc: { min: "", max: "" },
        summary: { overview: "", responsibilities: [""], qualifications: [""] },
        category: "",
        positionLevel: "",
        shift: "Day Shift",
        openings: 1,
        aboutRole: "",
        responsibilities: [""],
        requirements: [""],
        benefits: [""],
        document: [], // existing document objects
      },
      hiringWorkflow: {
        stages: [{ stage: "", description: "" }],
      },
      eligibilityCriteria: {
        required: [""],
        preferred: [""],
        skills: [""],
      },
      documents: [], // new files
      toRemoveDocuments: [], // ids of docs to delete on update
    },
  });

  // Field arrays
  const responsibilitiesFA = useFieldArray({
    control,
    name: "jobDescription.responsibilities",
  });
  const requirementsFA = useFieldArray({
    control,
    name: "jobDescription.requirements",
  });
  const benefitsFA = useFieldArray({
    control,
    name: "jobDescription.benefits",
  });
  const summaryResponsibilitiesFA = useFieldArray({
    control,
    name: "jobDescription.summary.responsibilities",
  });
  const summaryQualificationsFA = useFieldArray({
    control,
    name: "jobDescription.summary.qualifications",
  });
  const stagesFA = useFieldArray({
    control,
    name: "hiringWorkflow.stages",
  });
  const requiredFA = useFieldArray({
    control,
    name: "eligibilityCriteria.required",
  });
  const preferredFA = useFieldArray({
    control,
    name: "eligibilityCriteria.preferred",
  });
  const skillsFA = useFieldArray({
    control,
    name: "eligibilityCriteria.skills",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]); // array of { _id, name, url, uploadedAt }
  const [newFilesPreview, setNewFilesPreview] = useState([]); // File list preview

  // watch documents input to show previews
  const watchedNewFiles = watch("documents");

  useEffect(() => {
    if (watchedNewFiles && watchedNewFiles.length) {
      const arr = Array.from(watchedNewFiles).map((f) => ({
        name: f.name,
        size: f.size,
        file: f,
      }));
      setNewFilesPreview(arr);
    } else {
      setNewFilesPreview([]);
    }
  }, [watchedNewFiles]);

  // --- Fetch assignable users (admin/recruiter) ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const filtered = res.data.users.filter(
          (u) => u.role === "admin" || u.role === "recruiter"
        );
        setUsers(filtered);
      } catch (err) {
        console.error("fetch users error", err);
      }
    };
    fetchUsers();
  }, []);

  // --- Fetch existing job if editing ---
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await api.fetchJob(id);
          const job = res.data;

          // Ensure arrays exist for react-hook-form / useFieldArray
          job.jobDescription = job.jobDescription || {};
          job.jobDescription.ctc = job.jobDescription.ctc || { min: "", max: "" };
          job.jobDescription.summary = job.jobDescription.summary || {
            overview: "",
            responsibilities: [""],
            qualifications: [""],
          };
          job.jobDescription.responsibilities =
            job.jobDescription.responsibilities?.length > 0
              ? job.jobDescription.responsibilities
              : [""];
          job.jobDescription.requirements =
            job.jobDescription.requirements?.length > 0 ? job.jobDescription.requirements : [
              "",
            ];
          job.jobDescription.benefits =
            job.jobDescription.benefits?.length > 0 ? job.jobDescription.benefits : [""];

          job.hiringWorkflow = job.hiringWorkflow || { stages: [{ stage: "", description: "" }] };
          job.hiringWorkflow.stages =
            job.hiringWorkflow.stages?.length > 0 ? job.hiringWorkflow.stages : [{ stage: "", description: "" }];

          job.eligibilityCriteria = job.eligibilityCriteria || {
            required: [""],
            preferred: [""],
            skills: [""],
          };
          job.eligibilityCriteria.required =
            job.eligibilityCriteria.required?.length > 0 ? job.eligibilityCriteria.required : [""];
          job.eligibilityCriteria.preferred =
            job.eligibilityCriteria.preferred?.length > 0 ? job.eligibilityCriteria.preferred : [""];
          job.eligibilityCriteria.skills =
            job.eligibilityCriteria.skills?.length > 0 ? job.eligibilityCriteria.skills : [""];

        if (job.assignedTo && typeof job.assignedTo === 'object' && job.assignedTo._id) {
          job.assignedTo = job.assignedTo._id;
        }

          // Set documents for display (existing documents; your sample uses jobDescription.document)
          setExistingDocs(job.jobDescription?.document || []);

          // prefill form
          reset(job);
        } catch (err) {
          console.error(err);
          alert("Failed to load job details");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, reset]);

  // Remove existing doc toggle (mark for removal)
  const toggleRemoveExistingDoc = (docId) => {
    const current = watch("toRemoveDocuments") || [];
    const exists = current.includes(docId);
    const next = exists ? current.filter((d) => d !== docId) : [...current, docId];
    setValue("toRemoveDocuments", next);
  };

  // --- Submission handler ---
//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       // Build multipart formdata
//       const formData = new FormData();

//       // top-level fields
//       formData.append("title", data.title || "");
//       formData.append("location", data.location || "");
//       formData.append("type", data.type || "");
//       formData.append("experience", data.experience || "");
//       formData.append("closingDate", data.closingDate || "");
//       formData.append("assignedTo", data.assignedTo || "");
//       formData.append("status", data.status || "open");

//       // Nested objects as JSON
//       formData.append("jobDescription", JSON.stringify(data.jobDescription || {}));
//       formData.append("hiringWorkflow", JSON.stringify(data.hiringWorkflow || {}));
//       formData.append("eligibilityCriteria", JSON.stringify(data.eligibilityCriteria || {}));

//       // If editing and user marked existing docs to remove, send their IDs
//       if (data.toRemoveDocuments && data.toRemoveDocuments.length > 0) {
//         formData.append("toRemoveDocuments", JSON.stringify(data.toRemoveDocuments));
//       }

//       // Append new files (if any)
//       if (data.documents && data.documents.length) {
//         Array.from(data.documents).forEach((file) => {
//           formData.append("documents", file); // backend key: "documents"
//         });
//       }

//       const config = { headers: { "Content-Type": "multipart/form-data" } };

//       if (id) {
//         await api.updateJob(id, formData, config);
//         alert("Job updated successfully!");
//       } else {
//         await api.createJob(formData, config);
//         alert("Job created successfully!");
//       }

//       navigate("/admin");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving job");
//     } finally {
//       setLoading(false);
//     }
//   };


// const onSubmit = async (data) => {
//   try {
//     const formData = new FormData();

//     // Append simple fields
//     Object.keys(data).forEach((key) => {
//       if (key !== 'documents' && typeof data[key] !== 'object') {
//         formData.append(key, data[key]);
//       }
//     });

//     // Append nested objects (like jobDescription, eligibilityCriteria, etc.)
//     formData.append('jobDescription', JSON.stringify(data.jobDescription));
//     formData.append('eligibilityCriteria', JSON.stringify(data.eligibilityCriteria));
//     formData.append('stages', JSON.stringify(data.stages));
//     formData.append('responsibilities', JSON.stringify(data.responsibilities));

//     // Append uploaded documents
//     if (data.documents && data.documents.length > 0) {
//       for (let i = 0; i < data.documents.length; i++) {
//         formData.append('documents', data.documents[i]);
//       }
//     }

//     // 🔥 Create Job API Call
//     const response = await api.post('/jobs', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     if (response.status === 201) {
//       alert('Job created successfully!');
//       reset();
//     } else {
//       alert('Something went wrong while creating the job');
//     }
//   } catch (error) {
//     console.error('Error creating job:', error);
//     alert(error.response?.data?.message || 'Server Error');
//   }
// };

const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    // Append simple fields
    Object.keys(data).forEach((key) => {
      if (key !== 'documents' && typeof data[key] !== 'object') {
        formData.append(key, data[key]);
      }
    });

    // Append nested objects
    formData.append('jobDescription', JSON.stringify(data.jobDescription));
    formData.append('eligibilityCriteria', JSON.stringify(data.eligibilityCriteria));
    formData.append('stages', JSON.stringify(data.stages));
    formData.append('responsibilities', JSON.stringify(data.responsibilities));

    // Append uploaded documents
    if (data.documents && data.documents.length > 0) {
      for (let i = 0; i < data.documents.length; i++) {
        formData.append('documents', data.documents[i]);
      }
    }

    let response;
    if (id) {
      // 🛠️ Edit mode
      response = await api.updateJob(id, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert('Job updated successfully!');
        navigate("/admin");
      } else {
        alert('Something went wrong while updating the job');
      }
    } else {
      // 🆕 Create mode
      response = await api.createJob(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        alert('Job created successfully!');
        reset();
        navigate("/admin");
      } else {
        alert('Something went wrong while creating the job');
      }
    }
  } catch (error) {
    console.error('Error submitting job:', error);
    alert(error.response?.data?.message || 'Server Error');
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {id ? "Edit Job Posting" : "Create New Job"}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Basic Info */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    {...register("title", { required: true })}
                    placeholder="e.g., Senior Software Engineer"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    {...register("location", { required: true })}
                    placeholder="e.g., Bengaluru, India (Hybrid)"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    {...register("type")}
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <input
                    {...register("experience")}
                    placeholder="e.g., 3-5 years of experience"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      {...register("closingDate")}
                      type="date"
                      className="block w-full border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <select
                    {...register("assignedTo")}
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Assignee</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.firstName} {u.lastName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right column small summary */}
              <aside className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="text-gray-500" size={18} />
                    <div>
                      <div className="text-xs text-gray-500">Applicants</div>
                      <div className="font-medium text-gray-800">{/* show applicants */}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="open">Open</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Openings</label>
                  <input
                    {...register("jobDescription.openings")}
                    type="number"
                    min="1"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
              </aside>
            </section>

            {/* Job Description Card */}
            <section className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Job Description</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <input
                    {...register("jobDescription.category")}
                    placeholder="e.g., Engineering / Platform"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Position Level</label>
                  <select
                    {...register("jobDescription.positionLevel")}
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <option value="">Select Position Level</option>
                    <option>Intern</option>
                    <option>Fresher</option>
                    <option>Junior</option>
                    <option>Mid-Level</option>
                    <option>Senior</option>
                    <option>Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Shift</label>
                  <select
                    {...register("jobDescription.shift")}
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <option>Day Shift</option>
                    <option>Night Shift</option>
                    <option>Rotational Shift</option>
                    <option>Flexible</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">CTC - Min</label>
                  <input
                    {...register("jobDescription.ctc.min")}
                    placeholder="e.g., 8,00,000"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">CTC - Max</label>
                  <input
                    {...register("jobDescription.ctc.max")}
                    placeholder="e.g., 12,00,000"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">About the role</label>
                  <textarea
                    {...register("jobDescription.aboutRole")}
                    rows={3}
                    placeholder="Summarize mission, impact, and team context"
                    className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              {/* Responsibilities / Requirements / Benefits as dynamic lists */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {/* Responsibilities */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Responsibilities</h3>
                    <button
                      type="button"
                      onClick={() => responsibilitiesFA.append("")}
                      className="inline-flex items-center gap-1 text-xs text-blue-600"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {responsibilitiesFA.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`jobDescription.responsibilities.${idx}`)}
                          placeholder={`Primary responsibility #${idx + 1}`}
                          className="flex-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => responsibilitiesFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Requirements</h3>
                    <button
                      type="button"
                      onClick={() => requirementsFA.append("")}
                      className="inline-flex items-center gap-1 text-xs text-blue-600"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {requirementsFA.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`jobDescription.requirements.${idx}`)}
                          placeholder={`Mandatory requirement #${idx + 1}`}
                          className="flex-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => requirementsFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Benefits</h3>
                    <button
                      type="button"
                      onClick={() => benefitsFA.append("")}
                      className="inline-flex items-center gap-1 text-xs text-blue-600"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {benefitsFA.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`jobDescription.benefits.${idx}`)}
                          placeholder={`Benefit or perk #${idx + 1}`}
                          className="flex-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => benefitsFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary (nested) */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Summary (optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Overview</label>
                    <textarea
                      {...register("jobDescription.summary.overview")}
                      rows={3}
                      placeholder="Concise elevator pitch for this role"
                      className="mt-1 block w-full border border-gray-200 rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Summary Responsibilities</label>
                    <div className="space-y-2">
                      {summaryResponsibilitiesFA.fields.map((f, idx) => (
                        <div className="flex gap-2" key={f.id}>
                          <input
                            {...register(`jobDescription.summary.responsibilities.${idx}`)}
                            placeholder={`Key summary responsibility #${idx + 1}`}
                            className="flex-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => summaryResponsibilitiesFA.remove(idx)}
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => summaryResponsibilitiesFA.append("")}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
                      >
                        <Plus size={14} /> Add responsibility
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Summary Qualifications</label>
                    <div className="space-y-2">
                      {summaryQualificationsFA.fields.map((f, idx) => (
                        <div className="flex gap-2" key={f.id}>
                          <input
                            {...register(`jobDescription.summary.qualifications.${idx}`)}
                            placeholder={`Qualification highlight #${idx + 1}`}
                            className="flex-1 block w-full border border-gray-200 rounded-lg px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => summaryQualificationsFA.remove(idx)}
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => summaryQualificationsFA.append("")}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
                      >
                        <Plus size={14} /> Add qualification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Hiring Workflow */}
            <section className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Hiring Workflow</h2>
                <button
                  type="button"
                  onClick={() => stagesFA.append({ stage: "", description: "" })}
                  className="inline-flex items-center gap-2 text-sm text-blue-600"
                >
                  <Plus size={14} /> Add Stage
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {stagesFA.fields.map((field, idx) => (
                  <div key={field.id} className="grid md:grid-cols-3 gap-3 items-start">
                    <select
                      {...register(`hiringWorkflow.stages.${idx}.stage`)}
                      className="col-span-1 border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <option value="">Select stage</option>
                      {HIRING_STAGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    <input
                      {...register(`hiringWorkflow.stages.${idx}.description`)}
                      placeholder="e.g., 30-min phone screen with hiring manager"
                      className="col-span-1 md:col-span-1 border border-gray-200 rounded-lg px-3 py-2"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => stagesFA.remove(idx)}
                        className="p-2 rounded-md hover:bg-gray-100"
                        title="Remove stage"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility Criteria */}
            <section className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Eligibility Criteria</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Required</label>
                  <div className="space-y-2 mt-2">
                    {requiredFA.fields.map((f, idx) => (
                      <div className="flex gap-2" key={f.id}>
                        <input
                          {...register(`eligibilityCriteria.required.${idx}`)}
                          placeholder={`Must-have criterion #${idx + 1}`}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => requiredFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => requiredFA.append("")}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Preferred</label>
                  <div className="space-y-2 mt-2">
                    {preferredFA.fields.map((f, idx) => (
                      <div className="flex gap-2" key={f.id}>
                        <input
                          {...register(`eligibilityCriteria.preferred.${idx}`)}
                          placeholder={`Nice-to-have criterion #${idx + 1}`}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => preferredFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => preferredFA.append("")}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Skills</label>
                  <div className="space-y-2 mt-2">
                    {skillsFA.fields.map((f, idx) => (
                      <div className="flex gap-2" key={f.id}>
                        <input
                          {...register(`eligibilityCriteria.skills.${idx}`)}
                          placeholder={`Skill or tool #${idx + 1}`}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => skillsFA.remove(idx)}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => skillsFA.append("")}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Documents</h2>

              {/* Existing documents (from jobDescription.document) */}
              <div className="space-y-2 mb-4">
                {existingDocs.length > 0 ? (
                  existingDocs.map((doc) => {
                    const isMarked = (watch("toRemoveDocuments") || []).includes(doc._id);
                    return (
                      <div
                        key={doc._id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-md border ${
                          isMarked ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <File size={18} />
                          <div>
                            <div className="text-sm text-gray-800">{doc.name}</div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600"
                            >
                              View
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 mr-2">Remove</label>
                          <input
                            type="checkbox"
                            checked={isMarked}
                            onChange={() => toggleRemoveExistingDoc(doc._id)}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-500">No existing documents</div>
                )}
              </div>

              {/* New file upload */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Upload new documents</label>
                <input
                  {...register("documents")}
                  type="file"
                  multiple
                  className="w-full text-sm file:border-0 file:bg-gray-100 file:rounded-md file:px-3 file:py-2"
                />

                {/* previews */}
                {newFilesPreview.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {newFilesPreview.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md border border-gray-100 bg-white">
                        <div className="flex items-center gap-3">
                          <File size={16} />
                          <div>
                            <div className="text-sm text-gray-700">{f.name}</div>
                            <div className="text-xs text-gray-400">{Math.round(f.size / 1024)} KB</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading || isSubmitting ? "Saving..." : id ? "Update Job" : "Create Job"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* small footer note */}
        <p className="text-xs text-gray-500 mt-4">
          Tip: responsibilities / requirements / benefits &amp; eligibility fields are dynamic — add as many as needed.
        </p>
      </div>
    </div>
  );
}

