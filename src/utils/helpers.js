// Utility Helper Functions

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format date to short string
 * @param {string} dateString - ISO date string
 * @returns {string} Short formatted date
 */
export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculate days since posted
 * @param {string} dateString - ISO date string
 * @returns {number} Number of days
 */
export const daysSincePosted = (dateString) => {
  const postedDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Filter jobs based on multiple criteria
 * @param {Array} jobs - Array of job objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered jobs
 */
export const filterJobs = (jobs, filters) => {
  return jobs.filter(job => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.department.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesDepartment = !filters.department || job.department === filters.department;
    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesStatus = !filters.status || job.status === filters.status;

    return matchesSearch && matchesDepartment && matchesType && matchesLocation && matchesStatus;
  });
};

/**
 * Sort jobs by different criteria
 * @param {Array} jobs - Array of job objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted jobs
 */
export const sortJobs = (jobs, sortBy) => {
  const sortedJobs = [...jobs];
  
  switch (sortBy) {
    case 'date-desc':
      return sortedJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    case 'date-asc':
      return sortedJobs.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    case 'applicants-desc':
      return sortedJobs.sort((a, b) => b.applicants - a.applicants);
    case 'applicants-asc':
      return sortedJobs.sort((a, b) => a.applicants - b.applicants);
    case 'title-asc':
      return sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sortedJobs;
  }
};

/**
 * Get unique values from array of objects
 * @param {Array} array - Array of objects
 * @param {string} key - Key to extract unique values from
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))];
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

