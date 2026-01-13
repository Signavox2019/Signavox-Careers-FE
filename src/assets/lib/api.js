// src/lib/api.js
import axios from "axios";
 
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
 
// Automatically attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 
export default {
  /** -------------------------------
   * JOB ROUTES
   * ------------------------------- */
  // fetchJobs: (params) => api.get("/jobs", { params }),
  fetchJobs: () => api.get("/jobs"),
 
  fetchJob: (id) => api.get(`/jobs/${id}`),
  createJob: (formData, config) => api.post("/jobs", formData, config),
  updateJob: (id, formData, config) => api.put(`/jobs/${id}`, formData, config),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  closeJob: (id) => api.put(`/jobs/${id}/close`),
  openJob: (id) => api.put(`/jobs/${id}/reopen`),
  getJobStats: () => api.get("/jobs/stats/summary"),
  fetchManagers: () => api.get("/users", { params: { role: "manager" } }),
  fetchRecruiterDashboard: () => api.get("/users/recruiter/my-stats"),
 
  /** -------------------------------
   * APPLICATION ROUTES
   * ------------------------------- */
  // Apply for a job
  applyJob: (jobId, formData) => api.post(`/applications/${jobId}/apply`, formData),
 
  // View applicants for a specific job
  fetchApplicantsByJob: (jobId) => api.get(`/applications/${jobId}/applicants`),
 
  // Shortlist an applicant
  shortlistApplicant: (appId) => api.put(`/applications/${appId}/shortlist`),
 
  // Reject an applicant
  rejectApplicant: (appId) => api.put(`/applications/${appId}/reject`),
 
  // Generate offer letter for an applicant
  generateOfferLetter: (appId) => api.post(`/applications/${appId}/generate-offer-letter`),
 
  // Get an applicant’s offer letter
  getOfferLetter: (appId) => api.get(`/applications/${appId}/offer-letter`),
 
  // Applicant accepts the offer
  acceptOffer: (appId) => api.put(`/applications/${appId}/accept-offer`),
 
  // Applicant rejects the offer
  rejectOffer: (appId) => api.put(`/applications/${appId}/reject-offer`),
 
  // Fetch all applications for the logged-in user
  fetchUserApplications: () => api.get(`/applications/my`),
  fetchApplicantsByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  fetchApplicantDetails: (userId) => api.get(`/users/${userId}`),
 
  /** -------------------------------
   * GENERIC HELPERS
   * ------------------------------- */
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};
 
 