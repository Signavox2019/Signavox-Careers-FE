// const baseUrl = 'http://localhost:5000/api';  
const baseUrl = 'https://signavox-careers.onrender.com/api';  

// API endpoints
export const API_ENDPOINTS = {
  JOBS: '/jobs',
  JOB_BY_ID: (id) => `/jobs/${id}`,
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_TOKEN: '/auth/validate-token'
  },
  APPLICATIONS: {
    APPLY: '/applications/apply',
    MY_APPLICATIONS: '/applications/my'
  },
  USER: {
    ME: '/users/me',
    UPLOAD_RESUME: '/users/me/resume'
  }
};

// API service functions
export const apiService = {
  // Jobs API
  async getJobs() {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.JOBS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getJobById(id) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.JOB_BY_ID(id)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  },

  // Auth API
  async login(credentials) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending forgot password:', error);
      throw error;
    }
  },

  async validateToken(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  },

  // Applications API
  async applyForJob(jobId, resumeFile, token) {
    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('resume', resumeFile);

      const response = await fetch(`${baseUrl}${API_ENDPOINTS.APPLICATIONS.APPLY}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  async getMyApplications(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching my applications:', error);
      throw error;
    }
  },

  // User API
  async getUserProfile(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.USER.ME}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async uploadResume(resumeFile, token) {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(`${baseUrl}${API_ENDPOINTS.USER.UPLOAD_RESUME}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }
};

export default baseUrl;