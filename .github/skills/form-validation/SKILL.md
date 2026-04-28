---
name: form-validation
description: "Standardises form validation across the SheIsDesign platform. Covers client-side validation in React + TypeScript (with react-hook-form and zod), server-side validation in ASP.NET Core (.NET with Data Annotations or FluentValidation), consistent error message display, and UX patterns for accessible error states. Use when building or editing any form: login, registration, event creation, competition submission, portfolio upload, or donation entry."
argument-hint: "[form name or field to validate]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — Form Validation Skill

## Stack Reference
- **Frontend Validation:** React + TypeScript + `react-hook-form` + `zod`
- **Backend Validation:** ASP.NET Core Data Annotations + FluentValidation
- **UI:** Tailwind CSS + DaisyUI (use `input-error` and `label` classes)
- **Rule:** Always validate on BOTH frontend (UX) and backend (security)

---

## FRONTEND — React + TypeScript

### Install
```bash
npm install react-hook-form zod @hookform/resolvers
```

### Pattern: Zod Schema + react-hook-form

Always define your validation schema separately from the component. This keeps it reusable and testable.

```typescript
// src/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```typescript
// src/schemas/registrationSchema.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  // POPIA: user must accept privacy policy
  acceptPrivacy: z
    .boolean()
    .refine(val => val === true, 'You must accept the privacy policy'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
```

### Template — Login Form Component
```typescript
// src/components/forms/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../schemas/loginSchema';

interface Props {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Map API errors back to specific fields
      setError('email', { message: 'Invalid email or password' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>

      {/* Email Field */}
      <div className="form-control w-full">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <label className="label" id="email-error" role="alert">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </div>

      {/* Password Field */}
      <div className="form-control w-full mt-4">
        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <label className="label" id="password-error" role="alert">
            <span className="label-text-alt text-error">{errors.password.message}</span>
          </label>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full mt-6"
        disabled={isLoading}
      >
        {isLoading ? <span className="loading loading-spinner" /> : 'Login'}
      </button>

    </form>
  );
};
```

### Template — File Upload Validation (Portfolio/Competition)
```typescript
// src/schemas/portfolioSchema.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const portfolioUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['graphic-design', 'photography', 'illustration', 'ui-ux', 'other']),
  file: z
    .custom<FileList>()
    .refine(files => files?.length > 0, 'Please upload a file')
    .refine(
      files => files?.[0]?.size <= MAX_FILE_SIZE,
      'File must be smaller than 5MB'
    )
    .refine(
      files => ALLOWED_TYPES.includes(files?.[0]?.type),
      'Only JPG, PNG, and PDF files are allowed'
    ),
});
```

---

## BACKEND — ASP.NET Core (.NET)

### Option A: Data Annotations (simple, built-in)
```csharp
// DTOs/RegisterDto.cs
using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "Full name must be between 2 and 100 characters")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 8,
        ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Password must contain at least one uppercase letter and one number")]
    public string Password { get; set; } = string.Empty;
}
```

### Option B: FluentValidation (recommended for complex rules)
```bash
dotnet add package FluentValidation.AspNetCore
```

```csharp
// Validators/RegisterDtoValidator.cs
using FluentValidation;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email address");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Must be at least 8 characters")
            .Matches("[A-Z]").WithMessage("Must contain an uppercase letter")
            .Matches("[0-9]").WithMessage("Must contain a number");
    }
}
```

### Controller — Returning Validation Errors
```csharp
[HttpPost("register")]
public async Task<IActionResult> Register(RegisterDto dto)
{
    // ModelState is automatically validated by Data Annotations
    if (!ModelState.IsValid)
    {
        // Returns structured errors the frontend can map to fields
        return ValidationProblem(ModelState);
    }

    // ... registration logic
}
```

---

## Error Message Standards for SheIsDesign

Always use these consistent messages across all forms:

| Scenario | Message |
|---|---|
| Required field empty | `"[Field name] is required"` |
| Invalid email | `"Please enter a valid email address"` |
| Password too short | `"Password must be at least 8 characters"` |
| Passwords don't match | `"Passwords do not match"` |
| File too large | `"File must be smaller than 5MB"` |
| Invalid file type | `"Only JPG, PNG, and PDF files are allowed"` |
| Invalid credentials | `"Invalid email or password"` (never reveal which) |
| Privacy not accepted | `"You must accept the privacy policy to register"` |

---

## Accessibility Rules for Form Errors (WCAG AA)

1. Always use `aria-invalid="true"` on fields with errors
2. Always use `aria-describedby` pointing to the error message element
3. Always use `role="alert"` on error message containers
4. Never rely on colour alone — use an icon + text (e.g. ⚠ + message)
5. Error messages must be associated with their input via `htmlFor` / `id`
