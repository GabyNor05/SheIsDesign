---
name: testing  
description: Guides writing and running tests for the SheIsDesign platform. Covers all  
test types for the full stack: Jest + React Testing Library for frontend  
component and integration tests (Electron + React + TypeScript), and xUnit +  
WebApplicationFactory for backend API tests (.NET + PostgreSQL). Use when  
writing any new test, setting up a test file, debugging a failing test, or  
when asked "how do I test this?". Also covers E2E tests with Playwright.  
argument-hint: "\[component or feature to test\]"  
user-invocable: true  
disable-model-invocation: false
---

# SheIsDesign — Testing Skill

## Tech Stack Reference

-   **Frontend:** Electron, React, TypeScript, Tailwind CSS + DaisyUI
-   **Backend:** ASP.NET Core (.NET), PostgreSQL, Entity Framework Core
-   **Frontend Testing:** Jest + React Testing Library (RTL) + MSW (Mock Service Worker)
-   **Backend Testing:** xUnit + WebApplicationFactory + EF Core InMemory
-   **E2E Testing:** Playwright



## Testing Philosophy for This Project

> Test **behaviour**, not implementation.  
> Ask: "What does the user see or experience?" — not "What does the code do internally?"

### The Three Rules

1.  **Never test implementation details** (e.g. internal state variable names)
2.  **Always test from the user's perspective** (what they see, click, and read)
3.  **One assertion of intent per test** — keep tests small and focused


## Test Types Overview

| Type | Tool | Scope | Location |
| --- | --- | --- | --- |
| Unit | Jest | Single function or utility | `src/__tests__/utils/` |
| Component | Jest + RTL | Single React component | `src/__tests__/components/` |
| Integration | Jest + MSW | Multiple components + API calls | `src/__tests__/integration/` |
| API/Backend | xUnit + WAF | .NET controller endpoints | `backend/Tests/` |
| E2E | Playwright | Full user flow in the app | `e2e/` |


## FRONTEND TESTS (Jest + React Testing Library)

### Setup Commands

```bash
# Install all frontend testing dependencies
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev msw jest-environment-jsdom

```

### jest.config.ts

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};

```

### jest.setup.ts

```typescript
import '@testing-library/jest-dom';

```


## TYPE 1 — Unit Tests (Pure Functions & Utilities)

**When to use:** Testing helper functions, formatters, validators, or any logic  
that does NOT involve React components or the DOM.

**File naming:** `src/__tests__/utils/[functionName].test.ts`

### Template

```typescript
// src/__tests__/utils/pointsCalculator.test.ts
import { calculatePoints } from '../../utils/pointsCalculator';

describe('calculatePoints', () => {

  it('should return 10 points for a completed portfolio entry', () => {
    const result = calculatePoints('portfolio_entry');
    expect(result).toBe(10);
  });

  it('should return 0 for an unknown action type', () => {
    const result = calculatePoints('unknown_action');
    expect(result).toBe(0);
  });

  it('should return 25 points for winning a competition', () => {
    const result = calculatePoints('competition_win');
    expect(result).toBe(25);
  });

});

```

### Key Jest Matchers for Units

```typescript
expect(value).toBe(10)               // Exact equality
expect(value).toEqual({ id: 1 })     // Deep object equality
expect(fn).toThrow('error message')  // Function throws an error
expect(value).toBeNull()             // Value is null
expect(array).toHaveLength(3)        // Array length
expect(string).toContain('hello')    // String contains substring

```


## TYPE 2 — Component Tests (React + RTL)

**When to use:** Testing that a single React component renders correctly,  
shows the right content, and responds to user interactions.

**File naming:** `src/__tests__/components/[ComponentName].test.tsx`

**Core RTL queries (in order of preference):**

```typescript
screen.getByRole('button', { name: /submit/i })   // Best — accessible
screen.getByLabelText(/email/i)                    // Good — form fields
screen.getByText(/welcome/i)                       // Good — visible text
screen.getByTestId('submit-btn')                   // Last resort only

```

### Template — Basic Render Test

```typescript
// src/__tests__/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';

describe('LoginForm', () => {

  it('should render email and password fields', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show validation error when email is empty on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('should call onSubmit with credentials when form is valid', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'Password123!',
    });
  });

});

```

### Template — RBAC / Conditional Rendering Test

```typescript
// src/__tests__/components/AdminDashboard.test.tsx
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../../components/AdminDashboard';

describe('AdminDashboard', () => {

  it('should show admin controls when user role is admin', () => {
    render(<AdminDashboard userRole="admin" />);
    expect(screen.getByRole('button', { name: /manage users/i })).toBeInTheDocument();
  });

  it('should NOT show admin controls for a volunteer user', () => {
    render(<AdminDashboard userRole="volunteer" />);
    expect(screen.queryByRole('button', { name: /manage users/i })).not.toBeInTheDocument();
  });

});

```

### Template — Leaderboard Component

```typescript
// src/__tests__/components/Leaderboard.test.tsx
import { render, screen } from '@testing-library/react';
import Leaderboard from '../../components/Leaderboard';

const mockEntries = [
  { id: 1, name: 'Anika de Beer', points: 150, rank: 1 },
  { id: 2, name: 'Keabetswe Olifant', points: 120, rank: 2 },
];

describe('Leaderboard', () => {

  it('should render all leaderboard entries', () => {
    render(<Leaderboard entries={mockEntries} />);
    expect(screen.getByText('Anika de Beer')).toBeInTheDocument();
    expect(screen.getByText('Keabetswe Olifant')).toBeInTheDocument();
  });

  it('should display points for each entry', () => {
    render(<Leaderboard entries={mockEntries} />);
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should show empty state when no entries are provided', () => {
    render(<Leaderboard entries={[]} />);
    expect(screen.getByText(/no entries yet/i)).toBeInTheDocument();
  });

});

```


## TYPE 3 — Integration Tests (Components + API via MSW)

**When to use:** Testing a component that fetches data from the .NET API.  
MSW (Mock Service Worker) intercepts the real API call and returns fake data  
so tests are fast and don't rely on the backend being online.

**File naming:** `src/__tests__/integration/[FeatureName].integration.test.tsx`

### MSW Setup

```typescript
// src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [

  // Mock: GET all events
  http.get('/api/events', () => {
    return HttpResponse.json([
      { id: 1, title: 'Design Workshop', date: '2026-05-01', capacity: 30 },
      { id: 2, title: 'Portfolio Review', date: '2026-05-15', capacity: 20 },
    ]);
  }),

  // Mock: POST login
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'fake-jwt-token',
      role: 'volunteer',
    });
  }),

  // Mock: GET leaderboard
  http.get('/api/leaderboard', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test User', points: 100, rank: 1 },
    ]);
  }),

];

```

```typescript
// src/__tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

```

```typescript
// jest.setup.ts — add these lines
import { server } from './__tests__/mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

```

### Integration Test Template — Event List

```typescript
// src/__tests__/integration/EventList.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import EventList from '../../components/EventList';

describe('EventList (integration)', () => {

  it('should fetch and display events from the API', async () => {
    render(<EventList />);

    // Loading state appears first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for API data to load
    await waitFor(() => {
      expect(screen.getByText('Design Workshop')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Review')).toBeInTheDocument();
    });
  });

  it('should show an error message if the API fails', async () => {
    // Override the handler for this one test to simulate an error
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.error();
      })
    );

    render(<EventList />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

});

```

---

## TYPE 4 — Backend API Tests (xUnit + .NET)

**Owner:** Keagan (backend) — frontend team does not need to write these.  
**File location:** `backend/SheIsDesign.Tests/`

### Setup

```bash
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package xunit
dotnet add package xunit.runner.visualstudio

```

### Template — Controller Integration Test

```csharp
// backend/SheIsDesign.Tests/EventsControllerTests.cs
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;

public class EventsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public EventsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetEvents_ReturnsOkWithEventList()
    {
        // Act
        var response = await _client.GetAsync("/api/events");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var events = await response.Content.ReadFromJsonAsync<List<EventDto>>();
        Assert.NotNull(events);
    }

    [Fact]
    public async Task PostEvent_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/events", new { title = "Test" });

        // Assert — admin-only route should reject unauthenticated requests
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

```


## TYPE 5 — End-to-End Tests (Playwright)

**When to use:** Testing complete user flows through the real running app.  
Write these LAST, after features are stable.

**File naming:** `e2e/[userFlow].spec.ts`

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install

```

### Template — Login Flow E2E

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('volunteer can log in and see their dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByLabel('Email').fill('volunteer@test.com');
    await page.getByLabel('Password').fill('TestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /my portfolio/i })).toBeVisible();
  });

  test('admin can access the admin dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByLabel('Email').fill('admin@sheis.design');
    await page.getByLabel('Password').fill('AdminPass123!');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
  });

  test('invalid credentials show an error message', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

});

```


## POPIA-Specific Test Cases

Because SheIsDesign handles personal data under South African POPIA,  
always include these test cases for any form or profile component:

```typescript
describe('POPIA Compliance', () => {

  it('should show a privacy notice before collecting personal data', () => {
    render(<RegistrationForm />);
    expect(screen.getByText(/your data will be used/i)).toBeInTheDocument();
  });

  it('should have a working "Delete My Account" option for volunteers', async () => {
    const user = userEvent.setup();
    const mockDelete = jest.fn();
    render(<AccountSettings onDeleteAccount={mockDelete} />);

    await user.click(screen.getByRole('button', { name: /delete my account/i }));
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

});

```


## Running Tests

```bash
# Frontend — run all tests
npm test

# Frontend — run tests in watch mode (re-runs on file save) ← use this while developing
npm test -- --watch

# Frontend — run tests with coverage report
npm test -- --coverage

# Backend — run all xUnit tests
dotnet test

# E2E — run Playwright tests (app must be running first)
npx playwright test

# E2E — run with UI mode (visual debugger)
npx playwright test --ui

```


## Test Coverage Targets for SheIsDesign

| Feature | Required Tests | Priority |
| --- | --- | --- |
| LoginForm | Render, validation errors, successful submit | 🔴 High |
| RegistrationForm | Render, POPIA notice, field validation | 🔴 High |
| AdminDashboard | RBAC — admin sees controls, volunteer does not | 🔴 High |
| Leaderboard | Renders entries, empty state, ranking order | 🟡 Medium |
| EventList | Fetches from API, loading state, error state | 🟡 Medium |
| PortfolioCard | Renders user data, image fallback | 🟡 Medium |
| CompetitionForm | Submission validation, file upload limits | 🟡 Medium |
| DonationLog | Admin-only visibility, total calculation | 🔵 Low |


## Common Mistakes to Avoid

1.  **❌ Using `getByTestId` everywhere** — only use as a last resort.  
    Use `getByRole` or `getByLabelText` first for accessible tests.
    
2.  **❌ Testing CSS classes or style values** — Tailwind class names are  
    implementation details. Test visible text and behaviour instead.
    
3.  **❌ Not awaiting async actions** — always `await` user events and  
    `waitFor` API responses or tests will randomly fail.
    
4.  **❌ Writing one giant test** — one test should verify one thing.  
    If your test has 10 `expect` statements, split it up.
    
5.  **❌ Mocking everything** — only mock things you don't control  
    (APIs, third-party services). Test real component logic directly.