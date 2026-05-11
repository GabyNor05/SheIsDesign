const API_BASE_URL = 'http://localhost:5160/api/Event';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
};

export const eventService = {
    // GET: api/Event
    getAllEvents: async () => {
        const response = await fetch(API_BASE_URL);
        return handleResponse(response);
    },

    // GET: api/Event/{id}
    getEventById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        return handleResponse(response);
    },

    // GET: api/Event/status/{status}
    getEventsByStatus: async (status) => {
        const response = await fetch(`${API_BASE_URL}/status/${status}`);
        return handleResponse(response);
    },

    // GET: api/Event/category/{category}
    getCategoryStats: async (category) => {
        const response = await fetch(`${API_BASE_URL}/category/${category}`);
        return handleResponse(response);
    },

    // GET: api/Event/Upcoming
    getUpcomingEvents: async () => {
        const response = await fetch(`${API_BASE_URL}/Upcoming`);
        return handleResponse(response);
    },

    // POST: api/Event
    createEvent: async (eventData) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });
        return handleResponse(response);
    },

    // PUT: api/Event/{id}
    updateEvent: async (id, eventData) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...eventData, id }), // Ensure ID matches URL
        });
        return handleResponse(response);
    },

    // DELETE: api/Event/{id}
    deleteEvent: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    }
};