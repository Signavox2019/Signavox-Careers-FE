// admin view recruiter page
import { useEffect, useState } from "react";
import { Users, CheckCircle, Award, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const Recruiter = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRecruiters: 0,
    activeRecruitersCount: 0,
    inactiveRecruitersCount: 0,
  });

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // FETCH DATA
  useEffect(() => {
    const loadRecruiters = async () => {
      try {
        setLoading(true);
        const res = await api.fetchAllRecruiters();
        const data = res.data;

        setStats({
          totalRecruiters: data.totalRecruiters,
          activeRecruitersCount: data.activeRecruitersCount,
          inactiveRecruitersCount: data.inactiveRecruitersCount,
        });

        setRecruiters(data.recruiters || []);
      } catch (error) {
        console.error("Failed to fetch recruiters", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecruiters();
  }, []);

  // FILTER LOGIC
  const filteredRecruiters = recruiters.filter((rec) => {
    const fullName =
      `${rec.firstName} ${rec.middleName || ""} ${rec.lastName || ""}`.toLowerCase();

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      rec.email.toLowerCase().includes(search.toLowerCase());

    const matchesTeam = teamFilter === "" || rec.team === teamFilter;
    const matchesStatus = statusFilter === "" || rec.status === statusFilter;

    return matchesSearch && matchesTeam && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-600">Loading recruiters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100">
            <Users className="text-blue-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{stats.totalRecruiters}</h2>
            <p className="text-gray-500 text-sm">Total Recruiters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-green-100">
            <CheckCircle className="text-green-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{stats.activeRecruitersCount}</h2>
            <p className="text-gray-500 text-sm">Active Recruiters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-purple-100">
            <Award className="text-purple-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{stats.inactiveRecruitersCount}</h2>
            <p className="text-gray-500 text-sm">Inactive Recruiters</p>
          </div>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-8">
        {/* FILTER BAR */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 justify-between">
          <div className="flex items-center gap-2 font-medium text-gray-800">
            <Filter className="w-5 h-5 text-gray-600" />
            Recruiters
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Team</option>
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left font-medium">S.No</th>
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Team</th>
                <th className="p-3 text-center font-medium">Total Assigned Jobs</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecruiters.length > 0 ? (
                filteredRecruiters.map((rec, index) => (
                  <tr
                    key={rec._id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3 text-gray-700 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">
                      {`${rec.firstName} ${rec.middleName || ""} ${rec.lastName || ""}`}
                    </td>
                    <td className="p-3 text-gray-600">{rec.email}</td>
                    <td className="p-3 text-gray-600 capitalize">{rec.team}</td>
                    <td className="p-3 text-gray-600 text-center">
                      {rec.totalAssignedJobs || 0}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rec.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        className="px-4 py-1 text-sm font-medium 
                                   text-blue-600 border border-blue-600 
                                   rounded-md hover:bg-blue-600 hover:text-white transition"
                        onClick={() => navigate(`/admin/recruiter/${rec._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 text-sm"
                  >
                    No recruiters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recruiter;
