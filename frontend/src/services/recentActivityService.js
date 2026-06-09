import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/RecentActivity';

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

export const recentActivityService = {
    /*
    Returns the top 10 most recent activities across all events.
    Activity types returned: "Post", "Donation", "JudgeMarkScheme", "Event", "NewAccount"

    Response shape:
    -----
      {
        "id": 0,
        "activityType": "string",   -- "Post" | "Donation" | "JudgeMarkScheme" | "Event" | "NewAccount"
        "title": "string",
        "description": "string",
        "timestamp": "2026-05-26T00:00:00Z",
        "actorName": "string",
        "relatedEventId": 0,        -- nullable
        "relatedPostId": 0          -- nullable
      }
    -----
    */
    getRecentActivity: (limit) => apiClient.get('/', limit),

    /*
    Returns the top 10 most recent activities scoped to a specific event.
    Activity types returned: "Post", "Donation", "JudgeMarkScheme", "Event"
    */
    getRecentActivityByEvent: (eventId) => apiClient.get(`/Event/${eventId}`),
};