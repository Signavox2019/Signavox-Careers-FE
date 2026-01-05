const baseUrl = 'http://localhost:5000/api';  
// const baseUrl = 'https://signavox-careers.onrender.com/api';  

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
    UPDATE_PERSONAL: '/user-details/personal'
  },
  RESUME: '/user-details/resume',
  SKILLS: '/user-details/skills',
  CERTIFICATIONS: {
    BASE: '/user-details/certifications',
    BY_ID: (id) => `/user-details/certifications/${id}`
  },
  EXPERIENCE: {
    BASE: '/user-details/experience',
    BY_ID: (id) => `/user-details/experience/${id}`
  },
  EDUCATION: {
    BASE: '/user-details/education',
    BY_ID: (id) => `/user-details/education/${id}`
  }
};

// API service functions
export const apiService = {
  // Jobs API
  async getJobs(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.JOBS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getJobById(id, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.JOB_BY_ID(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
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
  async applyForJob(jobId, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.APPLICATIONS.APPLY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
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

      const response = await fetch(`${baseUrl}${API_ENDPOINTS.RESUME}`, {
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
  },

  async updateResume(resumeFile, token) {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(`${baseUrl}${API_ENDPOINTS.RESUME}`, {
        method: 'PUT',
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
      console.error('Error updating resume:', error);
      throw error;
    }
  },

  async getResume(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.RESUME}`, {
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
      console.error('Error fetching resume:', error);
      throw error;
    }
  },

  async updatePersonalDetails(personalData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.USER.UPDATE_PERSONAL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(personalData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw error;
    }
  },

  // Skills API
  async getSkills(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.SKILLS}`, {
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
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  async addSkills(skills, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.SKILLS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding skills:', error);
      throw error;
    }
  },

  async updateSkills(skills, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.SKILLS}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating skills:', error);
      throw error;
    }
  },

  // Certifications API
  async getCertifications(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.CERTIFICATIONS.BASE}`, {
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
      console.error('Error fetching certifications:', error);
      throw error;
    }
  },

  async createCertification(certificationData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.CERTIFICATIONS.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ certification: certificationData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  },

  async updateCertification(id, certificationData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.CERTIFICATIONS.BY_ID(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ certification: { ...certificationData, _id: id } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
  },

  async deleteCertification(id, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.CERTIFICATIONS.BY_ID(id)}`, {
        method: 'DELETE',
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
      console.error('Error deleting certification:', error);
      throw error;
    }
  },

  // Experience API
  async getExperience(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPERIENCE.BASE}`, {
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
      console.error('Error fetching experience:', error);
      throw error;
    }
  },

  async createExperience(experienceData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPERIENCE.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ experience: experienceData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
  },

  async updateExperience(id, experienceData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPERIENCE.BY_ID(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ experience: { ...experienceData, _id: id } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  },

  async deleteExperience(id, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPERIENCE.BY_ID(id)}`, {
        method: 'DELETE',
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
      console.error('Error deleting experience:', error);
      throw error;
    }
  },

  // Education API
  async getEducation(token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EDUCATION.BASE}`, {
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
      console.error('Error fetching education:', error);
      throw error;
    }
  },

  async getEducationById(id, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EDUCATION.BY_ID(id)}`, {
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
      console.error('Error fetching education by ID:', error);
      throw error;
    }
  },

  async createEducation(educationData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EDUCATION.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ education: educationData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating education:', error);
      throw error;
    }
  },

  async updateEducation(id, educationData, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EDUCATION.BY_ID(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ education: { ...educationData, _id: id } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  },

  async deleteEducation(id, token) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.EDUCATION.BY_ID(id)}`, {
        method: 'DELETE',
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
      console.error('Error deleting education:', error);
      throw error;
    }
  }
};

export default baseUrl;