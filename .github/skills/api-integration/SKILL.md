---
name: api-integration
description: "Defines the standard patterns for connecting the React + TypeScript frontend to the ASP.NET Core (.NET) backend API in SheIsDesign. Covers base API client setup with Axios, auth header injection, error handling, loading states, and service layer structure. Use when creating a new API service, calling a backend endpoint, handling API responses, or setting up data fetching in a component."
argument-hint: "[endpoint or feature to connect]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — API Integration Skill

## Stack Reference
- **HTTP Client:** Axios
- **Frontend:** React + TypeScript (Electron)
- **Backend:** ASP.NET Core (.NET) — base URL via environment variable
- **Auth:** JWT Bearer token (stored in localStorage via AuthContext)
- **Pattern:** Service layer → Component (never fetch directly in components)

---

## Install
```bash
npm install axios
```

---

## 1. Base API Client — apiClient.ts

Create one shared Axios instance. All services import from this file.

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — auto-attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('she_user');
    if (stored) {
      const user = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token expiry globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear session and redirect to login
      localStorage.removeItem('she_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 2. Service Layer Pattern

Never call `apiClient` directly inside a component. Create a dedicated service file per feature.

```typescript
// src/services/eventService.ts
import apiClient from './apiClient';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  capacity: number;
  description: string;
}

export interface CreateEventDto {
  title: string;
  date: string;
  location: string;
  capacity: number;
  description: string;
}

const eventService = {

  getAll: async (): Promise<Event[]> => {
    const res = await apiClient.get<Event[]>('/api/events');
    return res.data;
  },

  getById: async (id: number): Promise<Event> => {
    const res = await apiClient.get<Event>(`/api/events/${id}`);
    return res.data;
  },

  create: async (dto: CreateEventDto): Promise<Event> => {
    const res = await apiClient.post<Event>('/api/events', dto);
    return res.data;
  },

  update: async (id: number, dto: Partial<CreateEventDto>): Promise<Event> => {
    const res = await apiClient.put<Event>(`/api/events/${id}`, dto);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/events/${id}`);
  },

  signUp: async (eventId: number): Promise<void> => {
    await apiClient.post(`/api/events/${eventId}/signup`);
  },

};

export default eventService;
```

---

## 3. Custom Hook Pattern — useEvents.ts

Wrap service calls in custom hooks to manage loading, error, and data state.

```typescript
// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import eventService, { Event } from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getAll();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

// Mutation hook — for create/update/delete
export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (dto: Parameters<typeof eventService.create>[0]) => {
    try {
      setLoading(true);
      setError(null);
      const created = await eventService.create(dto);
      return created;
    } catch (err) {
      setError('Failed to create event. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
};
```

---

## 4. Using the Hook in a Component

```typescript
// src/pages/EventsPage.tsx
import { useEvents } from '../hooks/useEvents';

export const EventsPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-12">
        No events available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
```

---

## 5. File Upload (Portfolio/Competition Submissions)
```typescript
// src/services/portfolioService.ts
import apiClient from './apiClient';

const portfolioService = {

  uploadEntry: async (formData: FormData) => {
    const res = await apiClient.post('/api/portfolio', formData, {
      headers: {
        // Override Content-Type so Axios sets multipart/form-data with boundary
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        console.log(`Upload progress: ${percent}%`);
        // Pass percent to a progress bar state if needed
      },
    });
    return res.data;
  },

};

export default portfolioService;
```

---

## 6. Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production
VITE_API_URL=https://api.sheisdesign.co.za
```

> **Rule:** Never hardcode the API URL anywhere. Always use `import.meta.env.VITE_API_URL`.

---

## Service File Checklist

For every new feature, create a corresponding service file:

| Feature | Service File |
|---|---|
| Authentication | `src/services/authService.ts` |
| Events | `src/services/eventService.ts` |
| Competitions | `src/services/competitionService.ts` |
| Portfolio | `src/services/portfolioService.ts` |
| Leaderboard | `src/services/leaderboardService.ts` |
| Donations | `src/services/donationService.ts` |
| Admin / Users | `src/services/adminService.ts` |
| Reports | `src/services/reportService.ts` |
