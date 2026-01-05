// // src/pages/AdminDashboard.jsx
// import { useEffect, useState } from "react";
// import api from "../assets/lib/api";
// import { Award, Users, CheckCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// const StatCard = ({ icon, label, value, accent }) => (
//   <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-5 border border-gray-100">
//     <div
//       className={`w-14 h-14 rounded-xl flex items-center justify-center ${accent} text-white shadow-sm`}
//     >
//       {icon}
//     </div>
//     <div>
//       <div className="text-3xl font-bold text-gray-800">{value}</div>
//       <div className="text-sm text-gray-500">{label}</div>
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const [sRes, jRes] = await Promise.all([
//         api.getJobStats(),
//         api.fetchJobs(),
//       ]);
//       setStats(sRes.data);
//       setJobs(jRes.data?.jobs || jRes.data || []);
//     } catch (err) {
//       console.error("Load error", err);
//       alert("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
//           Admin Dashboard
//         </h1>
//         <Link
//           to="/admin/jobs/new"
//           className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
//         >
//           + New Job
//         </Link>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//         <StatCard
//           icon={<Users className="w-7 h-7" />}
//           label="Total Jobs"
//           value={stats?.totalJobs ?? "—"}
//           accent="bg-blue-500"
//         />
//         <StatCard
//           icon={<CheckCircle className="w-7 h-7" />}
//           label="Open Jobs"
//           value={stats?.openJobs ?? "—"}
//           accent="bg-green-500"
//         />
//         <StatCard
//           icon={<Award className="w-7 h-7" />}
//           label="Closed Jobs"
//           value={stats?.closedJobs ?? "—"}
//           accent="bg-purple-500"
//         />
//       </div>

//       {/* Jobs Table Section */}
//       <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-5">
//           Recent Jobs
//         </h2>

//         {loading ? (
//           <div className="text-gray-500 text-center py-10 animate-pulse">
//             Loading dashboard data...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
//                 <tr>
//                   <th className="p-3 text-left font-medium">Title</th>
//                   <th className="p-3 text-left font-medium">Location</th>
//                   <th className="p-3 text-left font-medium">Type</th>
//                   <th className="p-3 text-left font-medium">Assigned To</th>
//                   <th className="p-3 text-left font-medium">Applicants</th>
//                   <th className="p-3 text-left font-medium">Status</th>
//                   <th className="p-3 text-left font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {jobs.length > 0 ? (
//                   jobs.slice(0, 8).map((job) => (
//                     <tr
//                       key={job._id}
//                       className="border-t hover:bg-gray-50 transition-all"
//                     >
//                       <td className="p-3 text-gray-800 font-medium">
//                         {job.title}
//                       </td>
//                       <td className="p-3 text-gray-600">{job.location}</td>
//                       <td className="p-3 text-gray-600">{job.type}</td>
//                       <td className="p-3 text-gray-600">
//                         {job.assignedTo?.name || "—"}
//                       </td>
//                       <td className="p-3 text-gray-600">
//                         {job.applicants?.length || 0}
//                       </td>
//                       <td className="p-3 capitalize font-semibold">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             job.status === "open"
//                               ? "bg-green-100 text-green-700"
//                               : job.status === "closed"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {job.status}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <Link
//                           to={`/admin/jobs/${job._id}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="py-10 text-center text-gray-500 text-sm"
//                     >
//                       No jobs found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// src/pages/AdminDashboard.jsx
// import { useEffect, useState } from "react";
// import api from "../assets/lib/api";
// import { Award, Users, CheckCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// const StatCard = ({ icon, label, value, accent }) => (
//   <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-5 border border-gray-100">
//     <div
//       className={`w-14 h-14 rounded-xl flex items-center justify-center ${accent} text-white shadow-sm`}
//     >
//       {icon}
//     </div>
//     <div>
//       <div className="text-3xl font-bold text-gray-800">{value}</div>
//       <div className="text-sm text-gray-500">{label}</div>
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const [sRes, jRes] = await Promise.all([
//         api.getJobStats(),
//         api.fetchJobs(),
//       ]);
//       setStats(sRes.data);
//       setJobs(jRes.data?.jobs || jRes.data || []);
//     } catch (err) {
//       console.error("Load error", err);
//       alert("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
//           Admin Dashboard
//         </h1>
//         <Link
//           to="/admin/jobs/new"
//           className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
//         >
//           + New Job
//         </Link>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//         <StatCard
//           icon={<Users className="w-7 h-7" />}
//           label="Total Jobs"
//           value={stats?.totalJobs ?? "—"}
//           accent="bg-blue-500"
//         />
//         <StatCard
//           icon={<CheckCircle className="w-7 h-7" />}
//           label="Open Jobs"
//           value={stats?.openJobs ?? "—"}
//           accent="bg-green-500"
//         />
//         <StatCard
//           icon={<Award className="w-7 h-7" />}
//           label="Closed Jobs"
//           value={stats?.closedJobs ?? "—"}
//           accent="bg-purple-500"
//         />
//       </div>

//       {/* Jobs Table Section */}
//       <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-5">
//           Recent Jobs
//         </h2>

//         {loading ? (
//           <div className="text-gray-500 text-center py-10 animate-pulse">
//             Loading dashboard data...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
//                 <tr>
//                   <th className="p-3 text-left font-medium">Title</th>
//                   <th className="p-3 text-left font-medium">Location</th>
//                   <th className="p-3 text-left font-medium">Type</th>
//                   <th className="p-3 text-left font-medium">Assigned To</th>
//                   <th className="p-3 text-left font-medium">Applicants</th>
//                   <th className="p-3 text-left font-medium">Status</th>
//                   <th className="p-3 text-left font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {jobs.length > 0 ? (
//                   jobs.slice(0, 8).map((job) => (
//                     <tr
//                       key={job._id}
//                       className="border-t hover:bg-gray-50 transition-all"
//                     >
//                       <td className="p-3 text-gray-800 font-medium">
//                         {job.title}
//                       </td>
//                       <td className="p-3 text-gray-600">{job.location}</td>
//                       <td className="p-3 text-gray-600">{job.type}</td>
//                       <td className="p-3 text-gray-600">
//                         {job.assignedTo?.name || "—"}
//                       </td>
//                       <td className="p-3 text-gray-600">
//                         {job.applicants?.length || 0}
//                       </td>
//                       <td className="p-3 capitalize font-semibold">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             job.status === "open"
//                               ? "bg-green-100 text-green-700"
//                               : job.status === "closed"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {job.status}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <Link
//                           to={`/admin/jobs/${job._id}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="py-10 text-center text-gray-500 text-sm"
//                     >
//                       No jobs found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../assets/lib/api";
import { Award, Users, CheckCircle, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-5 border border-gray-100">
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center ${accent} text-white shadow-sm`}
    >
      {icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    title: "",
    assignedTo: "",
    status: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const [sRes, jRes] = await Promise.all([
        api.getJobStats(),
        api.fetchJobs(),
      ]);
      const jobsData = jRes.data?.jobs || jRes.data || [];
      setStats(sRes.data);
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Load error", err);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
    let result = jobs;

    if (filters.title) {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.assignedTo) {
      result = result.filter(
        (job) =>
          job.assignedTo?.name?.toLowerCase() ===
          filters.assignedTo.toLowerCase()
      );
    }

    if (filters.status) {
      result = result.filter(
        (job) => job.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  useEffect(() => {
    load();
  }, []);

  // Unique values for dropdowns
  const assignedToOptions = [
    ...new Set(jobs.map((j) => j.assignedTo?.name).filter(Boolean)),
  ];
  const statusOptions = [...new Set(jobs.map((j) => j.status).filter(Boolean))];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
          Admin Dashboard
        </h1>
        <Link
          to="/admin/jobs/new"
          className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
        >
          + New Job
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users className="w-7 h-7" />}
          label="Total Jobs"
          value={stats?.totalJobs ?? "—"}
          accent="bg-blue-500"
        />
        <StatCard
          icon={<CheckCircle className="w-7 h-7" />}
          label="Open Jobs"
          value={stats?.openJobs ?? "—"}
          accent="bg-green-500"
        />
        <StatCard
          icon={<Award className="w-7 h-7" />}
          label="Closed Jobs"
          value={stats?.closedJobs ?? "—"}
          accent="bg-purple-500"
        />
      </div>

      {/* Jobs Table Section */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" /> Recent Jobs
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by title"
              value={filters.title}
              onChange={(e) =>
                setFilters((f) => ({ ...f, title: e.target.value }))
              }
              className="border w-72 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={filters.assignedTo}
              onChange={(e) =>
                setFilters((f) => ({ ...f, assignedTo: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Assigned To</option>
              {assignedToOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            {(filters.title || filters.assignedTo || filters.status) && (
              <button
                onClick={() =>
                  setFilters({ title: "", assignedTo: "", status: "" })
                }
                className="text-sm text-red-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-10 animate-pulse">
            Loading dashboard data...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-3 text-left font-medium">S.No</th>
                  <th className="p-3 text-left font-medium">Title</th>
                  <th className="p-3 text-left font-medium">Location</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Assigned To</th>
                  <th className="p-3 text-left font-medium">Applicants</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.slice(0, 10).map((job, index) => (
                    <tr
                      key={job._id}
                      className="border-t hover:bg-gray-50 transition-all"
                    >
                      <td className="p-3 text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-3 text-gray-800 font-medium">
                        {job.title}
                      </td>
                      <td className="p-3 text-gray-600">{job.location}</td>
                      <td className="p-3 text-gray-600">{job.type}</td>
                      <td className="p-3 text-gray-600">
                        {job.assignedTo?.name || "—"}
                      </td>
                      <td className="p-3 text-gray-600">
                        {job.applicants?.length || 0}
                      </td>
                      <td className="p-3 capitalize font-semibold">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            job.status === "open"
                              ? "bg-green-100 text-green-700"
                              : job.status === "closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/admin/jobs/${job._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-gray-500 text-sm"
                    >
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
