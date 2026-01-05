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

export default function JobDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.fetchJob(id);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load job');
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
  const confirmMsg = isClosing
    ? 'Are you sure you want to close this job?'
    : 'Are you sure you want to reopen this job?';

  if (!confirm(confirmMsg)) return;

  try {
    setProcessing(true);

    if (isClosing) {
      // Close job
      const res = await api.closeJob(id);
      alert(res.data.message || 'Job closed successfully.');
    } else {
      // Reopen job (backend validates timing)
      const res = await api.openJob(id);
      alert(res.data.message || 'Job reopened successfully.');
    }

    await load(); // refresh job details
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      'Failed to update job status. Please try again.';
    alert(message);
  } finally {
    setProcessing(false);
  }
};


  // ✅ Delete Job
  const handleDelete = async () => {
    if (!confirm('Delete this job permanently?')) return;
    try {
      setProcessing(true);
      await api.deleteJob(id);
      alert('Job deleted successfully');
      nav('/admin');
    } catch (err) {
      console.error(err);
      alert('Failed to delete job');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="text-sm text-gray-500">
            {job.location} • {job.type} • {job.experience || 'Any'}
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
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overview */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold text-lg mb-2">Overview</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {job.jobDescription?.overview ||
              job.jobDescription?.aboutRole ||
              '—'}
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {/* Responsibilities */}
            <div>
              <h4 className="text-sm font-medium mb-1">Responsibilities</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {(job.jobDescription?.responsibilities || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-sm font-medium mb-1">Requirements</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {(job.jobDescription?.requirements || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-sm font-medium mb-1">Benefits</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {(job.jobDescription?.benefits || []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-white p-6 rounded-2xl shadow space-y-4">
          {/* Assigned To */}
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Assigned To</h4>
            <div className="flex items-center justify-between">
              <div>{job.assignedTo?.firstName + ' ' + job.assignedTo?.lastName || 'Unassigned'}</div>
            </div>
          </div>

          {/* Job Status */}
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Job Status</h4>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  job.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {job.status === 'open' ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Applicants */}
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Applicants</h4>
            <div className="mt-2 text-lg font-semibold">
              {job.applicants?.length ?? 0}
            </div>
            <Link
              to={`/admin/jobs/${id}/applicants`}
              className="text-blue-600 text-sm hover:underline"
            >
              Manage applicants
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
