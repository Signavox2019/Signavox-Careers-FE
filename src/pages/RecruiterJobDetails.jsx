

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../assets/lib/api';

/* ---------- Helpers (same as Admin) ---------- */
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

  if (full) return full;
  if (typeof user === 'string') return capitalize(user);
  if (user.name) return formatLabel(user.name);

  return 'Unassigned';
};

export default function RecruiterJobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  const applicantsCount = job.applicants?.length ?? 0;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              📍 {job.location || 'Not specified'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              🧭 {formatLabel(job.type)}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              🎯 {job.experience || 'Any experience'}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* -------- Left Content -------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Overview
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.jobDescription?.overview ||
                job.jobDescription?.aboutRole ||
                '—'}
            </p>
          </div>

          {/* Lists */}
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

        {/* -------- Sidebar -------- */}
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
                {formatLabel(job.status)}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Applicants</p>
              <p className="text-lg font-semibold text-gray-800">
                {applicantsCount}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <p className="text-xs text-gray-500 mb-1">Openings</p>
              <p className="text-lg font-semibold text-gray-800">
                {job.jobDescription?.openings ?? '—'}
              </p>
            </div>
          </div>

          {/* Manage Applicants */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Applicants</p>
                <p className="text-base font-semibold text-gray-800">
                  {applicantsCount}
                </p>
              </div>
              <Link
                to={`/recruiter/jobs/${id}/applicants`}
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
