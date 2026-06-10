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
        const backendError = error.response?.data;
        return Promise.reject(backendError || new Error(error.message || 'Request failed'));
    }
);

export const postService = {
    // GET: api/Post
    getAllPosts: () => apiClient.get('/'),

    // GET: api/Post/{id}
    getPostById: (id) => apiClient.get(`/${id}`),

    // POST: api/Post
    createPost: (postData) => apiClient.post('/', postData),

    updatePost: (id, postData) => apiClient.put(`/${id}`, { ...postData, id: Number(id) }),

    // GET: api/Post/event/{eventId}
    getPostsByEvent: (eventId) => apiClient.get(`/event/${eventId}`),

    // GET: api/Post/student/{studentId}/event/{eventId}
    getPostsByStudentAndEvent: (studentId, eventId) => apiClient.get(`/student/${studentId}/event/${eventId}`),

    // DELETE: api/Post/{id}
    deletePost: (id) => apiClient.delete(`/${id}`)
};