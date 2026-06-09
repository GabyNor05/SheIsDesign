import axios from 'axios';

import API_BASE from '../config';
const API_BASE_URL = `${API_BASE}/Event`;

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

    /*
    create event needs these variables

    -----
      {
        "title": "string",
        "start_date": "2026-05-26", -- DateTime
        "end_date": "2026-05-26", -- DateTTime
        "description": "string",
        "max_entry": 0,
        "category": "string",
        "points_reward": 0,
        "status": "string",
        "image_link": "string"
      }
    -----

    */
    createEvent: (eventData) => apiClient.post('/', eventData),

    updateEvent: (id, eventData) => apiClient.put(`/${id}`, { ...eventData, id }),

    deleteEvent: (id) => apiClient.delete(`/${id}`)
};