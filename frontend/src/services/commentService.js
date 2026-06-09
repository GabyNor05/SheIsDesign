import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/Comment';

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

export const commentService = {
    getAllComments: () => apiClient.get('/'),

    getCommentById: (id) => apiClient.get(`/${id}`),

    /*
    createComment needs these variables

    -----
      {
        "content": "string",
        "studentId": 0,
        "postId": 0
      }
    -----
    */
    createComment: (commentData) => apiClient.post('/', commentData),

    updateComment: (id, commentData) => apiClient.put(`/${id}`, { ...commentData, id }),

    deleteComment: (id) => apiClient.delete(`/${id}`),
};