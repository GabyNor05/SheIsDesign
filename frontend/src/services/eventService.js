import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/Event'; 

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

export const eventService = {
    getAllEvents: () => apiClient.get('/'),

    getEventById: (id) => apiClient.get(`/${id}`),

    getEventsByStatus: (status) => apiClient.get(`/status/${status}`),

    getCategoryStats: (category) => apiClient.get(`/category/${category}`),

    getUpcomingEvents: () => apiClient.get('/Upcoming'),

    createEvent: (eventData) => apiClient.post('/', eventData),

    updateEvent: (id, eventData) => apiClient.put(`/${id}`, { ...eventData, id }),

    deleteEvent: (id) => apiClient.delete(`/${id}`)
};