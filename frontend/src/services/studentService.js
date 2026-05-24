import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/Student'; // Update port as needed

// Create an Axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to format data or catch errors globally (Optional but highly recommended)
apiClient.interceptors.response.use(
    (response) => {
        // Axios returns the parsed JSON in the `data` property
        // For 204 No Content, Axios data will be empty string or null/undefined
        return response.status === 204 ? null : response.data;
    },
    (error) => {
        // Axios automatically traps non-2xx status codes here
        const errorText = error.response?.data || error.message;
        return Promise.reject(new Error(errorText || `Network response was not ok: ${error.status}`));
    }
);

export const studentService = {
    getAllStudents: () => {
        return apiClient.get('/');
    },

    getStudentById: (id) => {
        return apiClient.get(`/${id}`);
    },

    /**
     * POST: api/Student
     * Creates a new student record using StudentCreateDTO
     * @param {Object} studentDto - { fullname, university, year_of_study, field_of_study, userID }
     */
    createStudent: (studentDto) => {
        // Axios handles JSON.stringify() automatically under the hood
        return apiClient.post('/', studentDto);
    },

    /**
     * PUT: api/Student/{id}
     * Updates an existing student record
     * @param {number} id - The student ID
     * @param {Object} studentData - Full Student object including the ID
     */
    updateStudent: (id, studentData) => {
        return apiClient.put(`/${id}`, { ...studentData, id });
    },

    deleteStudent: (id) => {
        return apiClient.delete(`/${id}`);
    }
};