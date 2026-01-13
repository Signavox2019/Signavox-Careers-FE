import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Session expired. Please login again.");
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

// Job Stats 
export const getApplicationStats = async () => {
    const response = await api.get("/jobs/stats/summary", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Job Application 
export const getJobApplicationStats = async () => {
    const response = await api.get("/applications/stats/overview", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};
// Recruiters
// export const getRecruitersStats = async () => {
//     const response = await api.get("/users/recruiter/68f0ca76f1ab9620e60e343d/stats", {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//     });
//     return response.data;
// };


export const getRecruiters = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/users/stats`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    console.log(data);

    return data
}




// For Jobs API Request 

export const getJobData = async () => {
    const { data } = await api.get("/jobs", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return data;
};


export const createJob = async (jobData) => {
    const response = await api.post("/jobs", jobData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};


export const updateJob = async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};
