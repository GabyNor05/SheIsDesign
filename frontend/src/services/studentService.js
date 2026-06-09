import axios from 'axios';

import API_BASE from '../config';
const API_BASE_URL = `${API_BASE}/Post`;

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

export const postService = {
    getAllPosts: () => apiClient.get('/'),

    getPostById: (id) => apiClient.get(`/${id}`),

    /*
    create/update post needs these variables (PostCreateDto mapping)

    -----
      {
        "title": "string",
        "studentId": 0,
        "imageFileLink": "string",
        "category": "string",
        "eventId": 0,
        "description": "string",
        "status": "string"
      }
    -----
    */
    createPost: (postData) => apiClient.post('/', postData),

    // In your refactored controller, PutPost maps directly from PostCreateDto without requiring an inline ID body property mismatch check.
    updatePost: (id, postData) => apiClient.put(`/${id}`, postData),

    deletePost: (id) => apiClient.delete(`/${id}`)
};