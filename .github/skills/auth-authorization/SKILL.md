---
name: auth-authorization
description: "Guides authentication and authorization implementation for SheIsDesign. Covers JWT token setup, RBAC (Admin, Judge, Student), protected routes in React/Electron, .NET [Authorize] attributes, login/registration flows, password reset, session management, and POPIA-compliant data handling. Use when implementing login, registration, protected routes, role checks, or any auth-related feature."
argument-hint: "[feature or role to implement]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — Auth & Authorization Skill

## Stack Reference
- **Frontend:** React + TypeScript (Electron)
- **Backend:** ASP.NET Core (.NET)
- **Auth Method:** JWT (JSON Web Tokens)
- **Roles:** `admin`, `judge`, `student`
- **Compliance:** POPIA (South Africa) — log all data access

---

## RBAC Role Definitions

| Role | Access Level | Notes |
|---|---|---|
| `admin` | Full access — manage users, events, competitions, donations, reports | SheIsDesign staff only |
| `judge` | Review submissions, Grade submissions, view competition details, manage judging criteria | Authorized judges |
| `student` | Own profile, portfolio, event sign-up, competition submission, leaderboard | Registered students |

---

## BACKEND — ASP.NET Core (.NET)

### 1. JWT Configuration — Program.cs
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("JudgeOrAdmin", policy =>
        policy.RequireRole("judge", "admin"));
    options.AddPolicy("Student", policy =>
        policy.RequireRole("student"));
});
```

### 2. appsettings.json (never commit real values — use environment variables)
```json
{
  "Jwt": {
    "Key": "USE_ENVIRONMENT_VARIABLE_NOT_THIS",
    "Issuer": "SheIsDesign",
    "Audience": "SheIsDesignUsers",
    "ExpiryMinutes": 60
  }
}
```

### 3. JWT Token Generation — AuthService.cs
```csharp
public string GenerateToken(ApplicationUser user, string role)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.Role, role),
        // POPIA: log token generation time for audit trail
        new Claim("issued_at", DateTime.UtcNow.ToString("o"))
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(
            double.Parse(_config["Jwt:ExpiryMinutes"]!)),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### 4. Controller — Role-Based Route Protection
```csharp
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    // Anyone authenticated can view events
    [HttpGet]
    [Authorize(Policy = "JudgeOrStudentOrAdmin")]
    public async Task<IActionResult> GetAll() { ... }

    // Only admins can create events
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create(CreateEventDto dto) { ... }

    // Public — guests can view event list
    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicEvents() { ... }
}
```

### 5. POPIA Audit Logging Middleware
```csharp
// Middleware/AuditLogMiddleware.cs
public class AuditLogMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLogMiddleware> _logger;

    public AuditLogMiddleware(RequestDelegate next,
        ILogger<AuditLogMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? "anonymous";
        var path = context.Request.Path;
        var method = context.Request.Method;

        // Log access to personal data endpoints (POPIA requirement)
        if (path.StartsWithSegments("/api/users") ||
            path.StartsWithSegments("/api/profiles"))
        {
            _logger.LogInformation(
                "POPIA AUDIT: User {UserId} accessed {Method} {Path} at {Time}",
                userId, method, path, DateTime.UtcNow);
        }

        await _next(context);
    }
}
```

---

## FRONTEND — React + TypeScript

### 1. Auth Context — AuthContext.tsx
```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'judge' | 'student';
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isJudgge: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('she_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const data = await res.json();
    const authUser: AuthUser = {
      id: data.id,
      email: data.email,
      role: data.role,
      token: data.token,
    };

    localStorage.setItem('she_user', JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('she_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isJudge = () => user?.role === 'judge' || user?.role === 'admin';
  const isStudent = () => user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isJudge, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
```

### 2. Protected Route Component
```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'judge' | 'student';
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isAdmin, isJudge, isStudent } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole === 'judge' && !isJudge()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole === 'student' && !isStudent()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### 3. Router Setup with Protected Routes
```typescript
// src/App.tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Routes>
  {/* Public */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/events/public" element={<PublicEventsPage />} />


  {/* Admin only */}
  <Route path="/portfolio" element={
    <ProtectedRoute requiredRole="admin">
      <PortfolioPage />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/manage-participants" element={
    <ProtectedRoute requiredRole="admin">
      <ManageParticipantsPage />
    </ProtectedRoute>
  } />
  <Route path="/manage-events" element={
    <ProtectedRoute requiredRole="admin">
      <ManageEventsPage />
    </ProtectedRoute>
  } />
  <Route path ="/manage-gallery" element={
    <ProtectedRoute requiredRole="admin">
      <ManageGalleryPage />
    </ProtectedRoute>
  } />
  <Route path ="/manage-donations" element={
    <ProtectedRoute requiredRole="admin">
      <ManageDonationsPage />
    </ProtectedRoute>
  } />
  <Route path = "/manage-judges" element={
    <ProtectedRoute requiredRole="admin">
      <ManageJudgesPage />
    </ProtectedRoute>
  } />

  {/* Judge only */}
  <Route path="/judge-dashboard" element={
    <ProtectedRoute requiredRole="judge">
      <JudgeDashboard />
    </ProtectedRoute>
  } />
  <Route path="/event-submissions-for-judge" element={
    <ProtectedRoute requiredRole="judge">
      <SubmissionsPage />
    </ProtectedRoute>
  } />

  {/* Student only */}
  <Route path="/my-profile" element={
    <ProtectedRoute requiredRole="student">
      <ProfilePage />
    </ProtectedRoute>
  } />
  
</Routes>
```

### 4. Conditional Rendering by Role
```typescript
// Use inside any component to show/hide UI by role
import { useAuth } from '../context/AuthContext';

const { isAdmin, isJudge, isStudent } = useAuth();

// Show admin button only to admins
{isAdmin() && (
  <button className="btn btn-primary">Manage Users</button>
)}
// Show judge panel link to judges
{isJudge() && (
  <a href="/judge-dashboard" className="btn btn-secondary">Judge Dashboard</a>
)}
// Show submit button to students
{isStudent() && (
  <button className="btn btn-secondary">Submit Entry</button>
)}
```

---

## POPIA Checklist — Auth Module

- [ ] Registration form shows privacy notice (Section 18 POPIA)
- [ ] Users can request account deletion from profile settings
- [ ] Audit log records who accessed personal data endpoints and when
- [ ] JWT tokens expire after 60 minutes (no indefinite sessions)
- [ ] Passwords are hashed with BCrypt (never stored plain text)
- [ ] Password reset emails expire after 15 minutes
