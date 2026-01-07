// // src/pages/JobDetails.jsx
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import api from '../assets/lib/api';
// export default function JobDetails() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const res = await api.fetchJob(id);
//       setJob(res.data);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load job');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, [id]);

//   const handleClose = async () => {
//     if (!confirm('Close this job?')) return;
//     try {
//       await api.closeJob(id);
//       alert('Job closed');
//       load();
//     } catch (err) { console.error(err); alert('Close failed'); }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Delete this job permanently?')) return;
//     try {
//       await api.deleteJob(id);
//       alert('Deleted');
//       nav('/admin');
//     } catch (err) { console.error(err); alert('Delete failed'); }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!job) return <div className="p-6">Job not found</div>;

//   return (
//     <div className="p-6">
//       <div className="flex items-start justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">{job.title}</h1>
//           <div className="text-sm text-gray-500">{job.location} • {job.type} • {job.experience || 'Any'}</div>
//         </div>
//         <div className="flex gap-2">
//           <Link to={`/admin/jobs/${id}/edit`} className="px-3 py-2 border rounded">Edit</Link>
//           <button onClick={handleClose} className="px-3 py-2 bg-yellow-500 text-white rounded">Close</button>
//           <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
//           <h3 className="font-semibold text-lg mb-2">Overview</h3>
//           <p className="text-gray-700 whitespace-pre-wrap">{job.jobDescription?.overview || job.jobDescription?.aboutRole || '—'}</p>

//           <div className="mt-6 grid md:grid-cols-3 gap-4">
//             <div>
//               <h4 className="text-sm font-medium">Responsibilities</h4>
//               <ul className="list-disc ml-5 text-gray-700">
//                 {(job.jobDescription?.responsibilities || []).map((r, i) => <li key={i}>{r}</li>)}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-sm font-medium">Requirements</h4>
//               <ul className="list-disc ml-5 text-gray-700">
//                 {(job.jobDescription?.requirements || []).map((r, i) => <li key={i}>{r}</li>)}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-sm font-medium">Benefits</h4>
//               <ul className="list-disc ml-5 text-gray-700">
//                 {(job.jobDescription?.benefits || []).map((b, i) => <li key={i}>{b}</li>)}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <aside className="bg-white p-6 rounded-2xl shadow space-y-4">
//           <div>
//             <h4 className="text-sm text-gray-500">Assigned To</h4>
//             <div className="flex items-center justify-between">
//               <div>{job.assignedTo?.name || 'Unassigned'}</div>
//             </div>
//           </div>

//           <div>
//             <h4 className="text-sm text-gray-500">Job Status</h4>
//             <div className="mt-2">
//               <span className={`px-3 py-1 rounded-full text-sm ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{job.status}</span>
//             </div>
//           </div>

//           <div>
//             <h4 className="text-sm text-gray-500">Applicants</h4>
//             <div className="mt-2 text-lg font-semibold">{job.applicants?.length ?? 0}</div>
//             <Link to={`/admin/jobs/${id}/applicants`} className="text-blue-600 text-sm hover:underline">Manage applicants</Link>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// src/pages/JobDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../assets/lib/api';
import { showError, showSuccess, showConfirm } from '../utils/notify';

const formatLabel = (value) =>
  value
    ? value
        .toString()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : '—';

const capitalize = (str) =>
  str
    ? str
        .toString()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

const formatName = (user) => {
  if (!user) return 'Unassigned';
  const full = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .map(capitalize)
    .join(' ')
    .trim();

  // Handle cases where backend only returns `name` or a plain string
  if (full) return full;
  if (typeof user === 'string') return capitalize(user);
  if (user.name) return formatLabel(user.name);

  return 'Unassigned';
};

const formatINR = (value) => {
  if (!value || value === '—') return '—';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
  if (isNaN(num)) return value;
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export default function JobDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const applicantsCount = job?.applicants?.length ?? 0;
  const statusLabel = job ? formatLabel(job.status) : '—';
  const locationLabel = job?.location || 'Not specified';
  const typeLabel = formatLabel(job?.type);
  const expLabel = job?.experience || 'Any experience';
  const shiftLabel = formatLabel(job?.jobDescription?.shift);
  const openingsLabel =
    job?.jobDescription?.openings != null ? job.jobDescription.openings : '—';

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.fetchJob(id);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      showError('Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  // ✅ Toggle Open/Close Job
//   const handleToggleStatus = async () => {
//     if (!job) return;
//     const newStatus = job.status === 'open' ? 'closed' : 'open';
//     if (!confirm(`Are you sure you want to ${newStatus === 'open' ? 'reopen' : 'close'} this job?`)) return;

//     try {
//       setProcessing(true);
//       await api.updateJob(id, JSON.stringify({ status: newStatus }));
//       alert(`Job ${newStatus === 'open' ? 'reopened' : 'closed'} successfully`);
//       await load(); // refresh job details
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update job status');
//     } finally {
//       setProcessing(false);
//     }
//   };

// ✅ Updated Toggle Open/Close Job function using api.js helpers
const handleToggleStatus = async () => {
  if (!job) return;

  const isClosing = job.status === 'open';
  const confirmTitle = isClosing
    ? 'Close this job?'
    : 'Reopen this job?';
  const confirmText = isClosing
    ? 'Are you sure you want to close this job posting?'
    : 'Are you sure you want to reopen this job posting?';

  const confirmed = await showConfirm(confirmTitle, confirmText, 'Yes', 'Cancel');
  if (!confirmed) return;

  try {
    setProcessing(true);

    if (isClosing) {
      // Close job
      const res = await api.closeJob(id);
      showSuccess(res.data.message || 'Job closed successfully.');
      // Update status locally without reloading the page
      setJob((prev) => (prev ? { ...prev, status: 'closed' } : prev));
    } else {
      // Reopen job (backend validates timing)
      const res = await api.openJob(id);
      showSuccess(res.data.message || 'Job reopened successfully.');
      // Update status locally without reloading the page
      setJob((prev) => (prev ? { ...prev, status: 'open' } : prev));
    }
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      'Failed to update job status. Please try again.';
    showError(message);
  } finally {
    setProcessing(false);
  }
};


  // ✅ Delete Job
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      'Delete this job permanently?',
      'This action cannot be undone. All associated data will be removed.',
      'Yes, Delete',
      'Cancel'
    );
    if (!confirmed) return;
    
    try {
      setProcessing(true);
      await api.deleteJob(id);
      showSuccess('Job deleted successfully');
      nav('/admin');
    } catch (err) {
      console.error(err);
      showError('Failed to delete job');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              📍 {locationLabel}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              🧭 {typeLabel}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              🎯 {expLabel}
            </span>
            {job.closingDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                📅 Closes: {new Date(job.closingDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/admin/jobs/${id}/edit`}
            className="px-3 py-2 border rounded hover:bg-gray-100"
          >
            Edit
          </Link>

          {/* Toggle Status Button */}
          <button
            onClick={handleToggleStatus}
            disabled={processing}
            className={`px-3 py-2 rounded text-white ${
              job.status === 'open'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {processing
              ? 'Processing...'
              : job.status === 'open'
              ? 'Close Job'
              : 'Reopen Job'}
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={processing}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Job Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overview + Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-lg text-gray-900">Overview</h3>
              {job.jobDescription?.category && (
                <span className="text-sm text-gray-500">
                  Category: <span className="font-medium text-gray-700">{formatLabel(job.jobDescription.category)}</span>
                </span>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap mt-2">
              {job.jobDescription?.overview ||
                job.jobDescription?.aboutRole ||
                '—'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Responsibilities */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Responsibilities
              </h4>
              {(job.jobDescription?.responsibilities?.length ?? 0) > 0 ? (
                <ul className="list-disc ml-4 space-y-1 text-gray-700 text-sm">
                  {job.jobDescription.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not provided.</p>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Requirements
              </h4>
              {(job.jobDescription?.requirements?.length ?? 0) > 0 ? (
                <ul className="list-disc ml-4 space-y-1 text-gray-700 text-sm">
                  {job.jobDescription.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not provided.</p>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Benefits
              </h4>
              {(job.jobDescription?.benefits?.length ?? 0) > 0 ? (
                <ul className="list-disc ml-4 space-y-1 text-gray-700 text-sm">
                  {job.jobDescription.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Assigned To</p>
              <p className="text-sm font-semibold text-gray-800">
                {formatName(job.assignedTo)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                  job.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Applicants</p>
              <p className="text-lg font-semibold text-gray-800">{applicantsCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Openings</p>
              <p className="text-lg font-semibold text-gray-800">{openingsLabel}</p>
            </div>
          </div>

          {/* Job Basics */}
          <div className="bg-white p-5 rounded-2xl shadow space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">Job Basics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium">{typeLabel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{locationLabel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Experience</p>
                <p className="font-medium">{expLabel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shift</p>
                <p className="font-medium">{shiftLabel || '—'}</p>
              </div>
              {job.jobDescription?.ctc && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">CTC Range</p>
                  <p className="font-medium">
                    ₹{formatINR(job.jobDescription.ctc.min)} - ₹{formatINR(job.jobDescription.ctc.max)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Applicants Link */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Applicants</p>
                <p className="text-base font-semibold text-gray-800">
                  {applicantsCount}
                </p>
              </div>
              <Link
                to={`/admin/jobs/${id}/applicants`}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Manage
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
