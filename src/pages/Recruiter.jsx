// admin view recruiter page
import { useEffect, useState } from "react";
import { Users, CheckCircle, Award, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../assets/lib/api";

const Recruiter = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRecruiters: 0,
    activeRecruitersCount: 0,
    inactiveRecruitersCount: 0,
  });

  const [recruiters, setRecruiters] = useState([]);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // FETCH DATA
  useEffect(() => {
    const loadRecruiters = async () => {
      try {
        const res = await api.fetchAllrecruiters();
        const data = res.data;

        setStats({
          totalRecruiters: data.totalRecruiters,
          activeRecruitersCount: data.activeRecruitersCount,
          inactiveRecruitersCount: data.inactiveRecruitersCount,
        });

        setRecruiters(data.recruiters);
      } catch (error) {
        console.error("Failed to fetch recruiters", error);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100">
            <Users className="text-blue-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{stats.totalRecruiters}</h2>
            <p className="text-gray-500 text-sm">Total Recruiters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-green-100">
            <CheckCircle className="text-green-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{stats.activeRecruitersCount}</h2>
            <p className="text-gray-500 text-sm">Active Recruiters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
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
      <div className="bg-white rounded-xl shadow-sm mt-8">

        {/* FILTER BAR */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Filter className="w-5 h-5" />
            Recruiters
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm"
            />

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Select Team</option>
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">S.No</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-center">Total Assigned Jobs</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredRecruiters.map((rec, index) => (
                <tr key={rec._id}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">
                    {`${rec.firstName} ${rec.middleName || ""} ${rec.lastName || ""}`}
                  </td>
                  <td className="px-6 py-4">{rec.email}</td>
                  <td className="px-6 py-4 capitalize">{rec.team}</td>
                  <td className="px-6 py-4 text-center">
  {rec.totalAssignedJobs || 0}
</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="px-4 py-1 text-sm font-medium 
                                 text-blue-600 border border-blue-600 
                                 rounded-md hover:bg-blue-600 hover:text-white transition"
                      onClick={() => navigate(`/recruiter/${rec._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRecruiters.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No recruiters found
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
