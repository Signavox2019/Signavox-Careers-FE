import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Award,
  Users,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-5 border border-gray-100">
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center ${accent} text-white shadow-sm`}
    >
      {icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-800">{value ?? "—"}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default function RecruiterDashboard() {
  const [mode, setMode] = useState(null); // "admin" | "recruiter"
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: "",
    status: "",
  });

  const load = async () => {
    try {
      setLoading(true);


      try {
        const res = await api.fetchRecruiterDashboard();

        const enrichedJobs = await Promise.all(
          (res.data.jobs || []).map(async (job) => {
            try {
              const jobRes = await api.fetchJob(job.jobId);
              return {
                ...job,
                location: jobRes.data.location,
                type: jobRes.data.type,
                openings: jobRes.data.jobDescription?.openings ?? 0,

                // ✅ ADD THIS LINE
                createdAt: jobRes.data.createdAt,
              };
            } catch {
              return job;
            }
          })
        );

        setMode("recruiter");
        setStats(res.data.stats);
        // setJobs(enrichedJobs);
        // setFilteredJobs(enrichedJobs);
        const sortedJobs = [...enrichedJobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);

        return;
      } catch (error) {
        console.log(error);
      }

      /* ================= ADMIN FALLBACK ================= */
      const [statsRes, jobsRes] = await Promise.all([
        api.getJobStats(),
        api.fetchJobs(),
      ]);

      const jobsData = jobsRes.data?.jobs || jobsRes.data || [];

      setMode("admin");
      setStats(statsRes.data);
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Dashboard load error:", err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let result = jobs;

    if (filters.title) {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(filters.title.toLowerCase())
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

  const statusOptions = [...new Set(jobs.map((j) => j.status).filter(Boolean))];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, recordsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / recordsPerPage)
  );

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const startRecord = filteredJobs.length ? startIndex + 1 : 0;
  const endRecord = Math.min(endIndex, filteredJobs.length);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          {mode === "admin" ? "Admin Dashboard" : "Recruiter Dashboard"}
        </h1>
      </div> */}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users className="w-7 h-7" />}
          label="Total Jobs"
          value={
            mode === "recruiter" ? stats?.totalAssignedJobs : stats?.totalJobs
          }
          accent="bg-blue-500"
        />
        <StatCard
          icon={<CheckCircle className="w-7 h-7" />}
          label="Open Jobs"
          value={mode === "recruiter" ? stats?.activeJobs : stats?.openJobs}
          accent="bg-green-500"
        />
        <StatCard
          icon={<Award className="w-7 h-7" />}
          label="Closed Jobs"
          value={mode === "recruiter" ? stats?.inactiveJobs : stats?.closedJobs}
          accent="bg-purple-500"
        />

      </div>

      {/* Jobs Table */}
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

            {(filters.title || filters.status) && (
              <button
                onClick={() => setFilters({ title: "", status: "" })}
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
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide ">
                <tr>
                  <th className="p-3 text-left font-medium">S.No</th>
                  <th className="p-3 text-left font-medium">Title</th>
                  <th className="p-3 text-left font-medium">Location</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-center font-medium">Openings</th>
                  <th className="p-3 text-center font-medium">Applicants</th>
                  <th className="p-3 text-center font-medium">Status</th>
                  <th className="p-3 text-center font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.length > 0 ? (
                  paginatedJobs.map((job, index) => (
                    <tr
                      key={job.jobId || job._id}
                      className="border-t hover:bg-gray-50 transition-all "
                    >
                      <td className="p-3 text-gray-700 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="p-3 text-gray-800 font-medium">
                        {job.title}
                      </td>

                      <td className="p-3 text-gray-600">
                        {job.location || "—"}
                      </td>

                      <td className="p-3 text-gray-600">{job.type || "—"}</td>
                      <td className="p-3 text-gray-600 text-center">
                        {job.openings ?? "—"}
                      </td>

                      <td className="p-3 text-gray-600 text-center">
                        {job.applicants?.length || 0}
                      </td>

                      <td className="p-3 capitalize font-semibold text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            job.status === "open"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          to={
                            mode === "recruiter"
                              ? `/recruiter/jobs/${job.jobId}`
                              : `/admin/jobs/${job._id}` 
                          }
                          className="text-blue-600 hover:underline "
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
      {!loading && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Rows per page:</span>
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Pagination controls */}
          {filteredJobs.length > 0 ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="text-sm text-gray-700 font-semibold">
                {startRecord}-{endRecord} of {filteredJobs.length}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No jobs to paginate.</div>
          )}
        </div>
      )}
    </div>
  );
}
