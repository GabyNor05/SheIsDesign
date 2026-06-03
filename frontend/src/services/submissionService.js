import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/Submission'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => {
        return response.status === 204 ? null : response.data;
    },
    (error) => {
        // Catch error payloads from backend, fallback to generic message
        const errorText = error.response?.data || error.message;
        return Promise.reject(new Error(errorText || `Request failed with status ${error.response?.status}`));
    }
);

export const submissionService = {
    // GET: api/Submission
    getAllSubmissions: () => apiClient.get('/'),

    // GET: api/Submission/5
    getSubmissionById: (id) => apiClient.get(`/${id}`),

    // GET: api/Submission/details/5 (Returns LeaderboardTotalReadDTO)
    getSubmissionDetails: (id) => apiClient.get(`/details/${id}`),

    /*
    create submission expects variables mapped to SubmissionCreateDTO:
    -----
      {
        "studentId": 0,
        "eventId": 0,
        "title": "string"
      }
    -----
    */
    // POST: api/Submission
    createSubmission: (submissionData) => apiClient.post('/', submissionData),

    /*
    update submission expects variables mapped to SubmissionUpdateDTO:
    -----
      {
        "title": "string",
        "status": "string",
        "points": 0,
        "rank": 0
      }
    -----
    */
    // PUT: api/Submission/5
    updateSubmission: (id, submissionData) => apiClient.put(`/${id}`, submissionData),

    // DELETE: api/Submission/5
    deleteSubmission: (id) => apiClient.delete(`/${id}`)
};