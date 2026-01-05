import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../assets/lib/api";

export default function ApplicantDetails() {
  const { userId } = useParams(); // from /admin/jobs/:id/applicants/:userId
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}`);
      setUser(res.data.user); // backend returns { user: { ... } }
    } catch (err) {
      console.error("Failed to fetch applicant details:", err);
      alert("Failed to load applicant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  if (loading) return <div className="p-8">Loading applicant details...</div>;
  if (!user) return <div className="p-8 text-red-600">Applicant not found</div>;

  return (
    <div className="w-full px-8 py-6">
      <button
        onClick={() => nav(-1)}
        className="mb-4 px-4 py-2 border rounded-md hover:bg-gray-100"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 w-full md:max-w-xs flex flex-col items-center">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover mb-3 border"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-1">{user.role?.toUpperCase()}</p>
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
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      Degree
                    </th>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      Institution
                    </th>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      Board/University
                    </th>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      Year
                    </th>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      CGPA / %
                    </th>
                    <th className="text-lg font-semibold text-left pb-2 px-4">
                      Specialization
                    </th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {user.education.map((edu, idx) => (
                    <tr
                      key={idx}
                      className="border-b-2 border-gray-200 last:border-none"
                    >
                      <td className="px-4 py-2">
                        {edu.programOrDegree || "—"}
                      </td>
                      <td className="px-4 py-2">{edu.institution || "—"}</td>
                      <td className="px-4 py-2">
                        {edu.boardOrUniversity || "—"}
                      </td>
                      <td className="px-4 py-2">{edu.passedYear || "—"}</td>
                      <td className="px-4 py-2">
                        {edu.percentageOrCGPA || "—"}
                      </td>
                      <td className="px-4 py-2">
                        {edu.branchOrSpecialization || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    {skill}
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
              <ul className="space-y-2">
                {user.certifications.map((cert, idx) => (
                  <li key={idx} className="border-b last:border-none pb-2">
                    <div className="font-medium">{cert.certificationName}</div>
                    <div className="text-gray-500 text-xs mb-1">
                      {cert.issuedBy} •{" "}
                      {cert.issuedDate
                        ? new Date(cert.issuedDate).toLocaleDateString()
                        : ""}
                      {cert.expiryDate
                        ? ` - Expiry: ${new Date(
                            cert.expiryDate
                          ).toLocaleDateString()}`
                        : ""}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {cert.description}
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
