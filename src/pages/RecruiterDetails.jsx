// admin view recruiter details page
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Linkedin, Github, Twitter, Globe } from "lucide-react";
import api from "../assets/lib/api";

const RecruiterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await api.getRecruiterById(id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadDetails();
  }, [id]);

  if (!data) return <div className="p-6">Loading...</div>;

  const r = data.recruiter;

  /* ---------------- TITLE CASE FORMATTER ---------------- */
  const toTitleCase = (str = "") =>
    str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  /* ---------------- ADDRESS NORMALIZATION ---------------- */
  let currentAddress = "Not provided";
  let permanentAddress = "Not provided";

  if (r.address) {
    if (typeof r.address === "string") {
      currentAddress = r.address;
    } else {
      currentAddress =
        r.address.current ||
        r.address.currentAddress ||
        "Not provided";
      permanentAddress =
        r.address.permanent ||
        r.address.permanentAddress ||
        "Not provided";
    }
  } else {
    currentAddress = r.currentAddress || "Not provided";
    permanentAddress = r.permanentAddress || "Not provided";
  }

  /* ---------------- SOCIAL LINKS ---------------- */
  const social = r.socialLinks || {
    linkedin: r.linkedin,
    github: r.github,
    twitter: r.twitter,
    portfolio: r.portfolio,
  };

  /* ---------------- DATE FORMATTER ---------------- */
  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-1 border rounded text-sm"
      >
        Back
      </button>

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full border flex items-center justify-center text-3xl font-semibold text-gray-700">
            {toTitleCase(r.name)?.[0]}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {toTitleCase(r.name)}
          </h2>

          <p className="text-sm text-gray-500">Recruiter</p>
          <p className="mt-1 text-sm text-gray-500">{r.email}</p>

          {r.resume && (
            <a
              href={r.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              View Resume
            </a>
          )}

          {/* SOCIAL ICONS */}
          {(social.linkedin || social.github || social.twitter || social.portfolio) && (
            <div className="flex justify-center gap-4 mt-5">

              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             bg-blue-50 text-blue-600 shadow-sm
                             hover:bg-blue-600 hover:text-white transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             bg-gray-100 text-gray-800 shadow-sm
                             hover:bg-gray-800 hover:text-white transition"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             bg-sky-50 text-sky-500 shadow-sm
                             hover:bg-sky-500 hover:text-white transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}

              {social.portfolio && (
                <a
                  href={social.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             bg-purple-50 text-purple-600 shadow-sm
                             hover:bg-purple-600 hover:text-white transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}

            </div>
          )}
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5 text-sm">

            <div>
              <p className="font-medium text-gray-600 mb-1">Full Name</p>
              <p className="text-gray-900">{toTitleCase(r.name)}</p>
            </div>

            <div>
              <p className="font-medium text-gray-600 mb-1">Gender</p>
              <p className="text-gray-900">{toTitleCase(r.gender)}</p>
            </div>

            <div>
              <p className="font-medium text-gray-600 mb-1">Phone</p>
              <p className="text-gray-900">{r.phoneNumber}</p>
            </div>

            <div>
              <p className="font-medium text-gray-600 mb-1">PAN</p>
              <p className="text-gray-900">{r.pan}</p>
            </div>

            <div>
              <p className="font-medium text-gray-600 mb-1">Permanent Address</p>
              <p className="text-gray-900">
                {toTitleCase(permanentAddress)}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="font-medium text-gray-600 mb-1">Current Address</p>
              <p className="text-gray-900">
                {toTitleCase(currentAddress)}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= EDUCATION ================= */}
      {r.education?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mt-6">
          <h3 className="font-semibold text-sm mb-3">Education</h3>

          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold">Degree</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Institution</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Year</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">CGPA / %</th>
              </tr>
            </thead>
            <tbody>
              {r.education.map((edu) => (
                <tr key={edu._id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-sm">{edu.programOrDegree}</td>
                  <td className="px-3 py-2 text-sm truncate">{edu.institution}</td>
                  <td className="px-3 py-2 text-sm text-center">{edu.passedYear}</td>
                  <td className="px-3 py-2 text-sm text-center">{edu.percentageOrCGPA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EXPERIENCE ================= */}
      {r.experienced && r.experiences?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h3 className="font-semibold mb-4">Experience</h3>

          {r.experiences.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-start border-b last:border-b-0 pb-3 mb-3"
            >
              <div>
                <p className="font-medium">{exp.companyName}</p>
                <p className="text-sm text-gray-700">{exp.designation}</p>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= SKILLS ================= */}
      {r.skills?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {r.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= JOBS ================= */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold mb-3">
          Assigned Jobs ({data.totalAssignedJobs})
        </h3>
        <ul className="list-disc ml-5 text-sm">
          {data.jobs.map((job) => (
            <li key={job.jobId}>
              {job.title} – {job.location} ({job.applicantCount} applicants)
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default RecruiterDetails;
