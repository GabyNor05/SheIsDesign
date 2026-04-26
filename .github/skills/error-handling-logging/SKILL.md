---
name: error-handling-logging
description: "Defines consistent error handling and logging patterns for SheIsDesign. Covers global exception middleware in ASP.NET Core (.NET), React error boundaries, toast/notification UX with DaisyUI, structured logging with Serilog, and POPIA-compliant audit logging. Use when adding error handling to a controller, component, or service, or when setting up logging infrastructure."
argument-hint: "[layer or feature to add error handling to]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — Error Handling & Logging Skill

## Stack Reference
- **Backend Logging:** Serilog (.NET)
- **Backend Error Handling:** Global exception middleware + ProblemDetails
- **Frontend Error Handling:** React Error Boundaries + toast notifications
- **UI Feedback:** DaisyUI `alert` + `toast` components
- **POPIA:** Log all access to personal data and all auth failures

---

## BACKEND — ASP.NET Core (.NET)

### 1. Install Serilog
```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

### 2. Configure Serilog — Program.cs
```csharp
// Program.cs
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/sheis-design-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30) // Keep 30 days of logs
    .CreateLogger();

builder.Host.UseSerilog();

// Register global exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
```

### 3. Global Exception Handler
```csharp
// Middleware/GlobalExceptionHandler.cs
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            "Unhandled exception on {Method} {Path} at {Time}",
            context.Request.Method,
            context.Request.Path,
            DateTime.UtcNow);

        var problemDetails = exception switch
        {
            KeyNotFoundException => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resource not found",
                Detail = exception.Message,
            },
            UnauthorizedAccessException => new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Access denied",
                Detail = "You do not have permission to perform this action.",
            },
            ArgumentException => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid request",
                Detail = exception.Message,
            },
            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "An unexpected error occurred",
                Detail = "Please try again or contact support.",
            }
        };

        context.Response.StatusCode = problemDetails.Status ?? 500;
        await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
```

### 4. POPIA Audit Logging — Log Personal Data Access
```csharp
// Use this in any service that accesses personal user data
public class UserService
{
    private readonly ILogger<UserService> _logger;

    public async Task<UserProfile> GetProfileAsync(string requesterId, string targetUserId)
    {
        // POPIA: log who accessed whose profile and when
        _logger.LogInformation(
            "POPIA AUDIT: User {RequesterId} accessed profile of {TargetUserId} at {Timestamp}",
            requesterId,
            targetUserId,
            DateTime.UtcNow);

        // ... fetch and return profile
    }

    public async Task DeleteAccountAsync(string userId)
    {
        // POPIA: log account deletion (Right to be Forgotten)
        _logger.LogWarning(
            "POPIA AUDIT: Account deletion requested for User {UserId} at {Timestamp}",
            userId,
            DateTime.UtcNow);

        // ... deletion logic
    }
}
```

### 5. Structured Error Responses

All error responses from the API follow this structure so the frontend can parse them consistently:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource not found",
  "status": 404,
  "detail": "Event with ID 42 was not found."
}
```

---

## FRONTEND — React + TypeScript

### 1. API Error Utility — parseApiError.ts
```typescript
// src/utils/parseApiError.ts

export interface ApiError {
  title: string;
  detail?: string;
  status?: number;
}

export const parseApiError = (error: unknown): string => {
  // Axios error with a response from the backend
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response: { data: ApiError; status: number } };
    const { data, status } = axiosError.response;

    if (status === 401) return 'Your session has expired. Please log in again.';
    if (status === 403) return 'You do not have permission to do that.';
    if (status === 404) return data.detail ?? 'The requested item was not found.';
    if (status === 422 || status === 400) return data.detail ?? 'Invalid input. Please check your details.';
    if (status >= 500) return 'Something went wrong on our end. Please try again.';

    return data.title ?? 'An unexpected error occurred.';
  }

  // Network error (no response)
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const netError = error as { message: string };
    if (netError.message === 'Network Error') {
      return 'Could not connect to the server. Please check your internet connection.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};
```

### 2. Toast Notification Hook — useToast.ts
```typescript
// src/hooks/useToast.ts
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};
```

### 3. Toast Container Component (DaisyUI)
```typescript
// src/components/ToastContainer.tsx
import { useToast } from '../hooks/useToast';

const alertClass: Record<string, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};

interface Props {
  toasts: ReturnType<typeof useToast>['toasts'];
  onDismiss: (id: number) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: Props) => (
  <div className="toast toast-end toast-bottom z-50">
    {toasts.map(toast => (
      <div
        key={toast.id}
        role="alert"
        className={`alert ${alertClass[toast.type]} shadow-lg`}
      >
        <span>{toast.message}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="btn btn-ghost btn-xs"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);
```

### 4. React Error Boundary — Catches Render Crashes
```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to a logging service
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <div role="alert" className="alert alert-error max-w-md">
            <span>Something went wrong loading this section.</span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 5. Wrap Major Sections in Error Boundaries
```typescript
// src/App.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrap each major route/section
<ErrorBoundary>
  <AdminDashboard />
</ErrorBoundary>

<ErrorBoundary>
  <PortfolioPage />
</ErrorBoundary>
```

---

## Error Handling Checklist

- [ ] Global exception handler registered in `Program.cs`
- [ ] Serilog writing to daily rolling file in `logs/`
- [ ] POPIA audit log for all personal data access
- [ ] POPIA audit log for account creation and deletion
- [ ] Frontend `parseApiError` used in all service catch blocks
- [ ] `ToastContainer` mounted at app root level
- [ ] `ErrorBoundary` wrapping all major page components
- [ ] Auth failures (401/403) redirect to login or show permission error
