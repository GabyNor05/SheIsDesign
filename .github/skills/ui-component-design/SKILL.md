---
name: ui-component-design
description: "Documents UI component conventions for SheIsDesign using Tailwind CSS and DaisyUI. Covers the brand theme (dark mode, pink/magenta gradients), reusable component patterns, accessibility standards (WCAG AA), typography, spacing, and DaisyUI class usage. References the project theme config. Use when building any new component, applying brand styling, checking colour contrast, or ensuring accessibility compliance."
argument-hint: "[component name or UI element to build]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — UI Component Design Skill

## Stack Reference
- **CSS Framework:** Tailwind CSS
- **Component Library:** DaisyUI
- **Theme Config:** [tailwind.config.ts](../../tailwind.config.ts)
- **Font:** Inter (Google Fonts)
- **Default Mode:** Dark theme (`sheisdesign-dark`)
- **Brand:** Bold, pink, confident, empowering

---

## Theme Overview — sheisdesign-dark

These are the design tokens from the moodboard analysis. All values are defined in `tailwind.config.ts`.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#F05057` | Buttons, active states, key CTAs |
| `secondary` | `#C61063` | Secondary buttons, deeper accents |
| `accent` | `#FF086B` | Highlights, gradient stops |
| `base-100` | `#1A1A1A` | Main page background |
| `base-200` | `#2C2C2C` | Cards, modals, surfaces |
| `base-300` | `#404040` | Borders, dividers |
| `base-content` | `#FFFFFF` | Primary text |
| `error` | `#F87272` | Error states, alerts |
| `success` | `#66BB6A` | Success states |

### Gradient Classes (define in tailwind.config.ts)
```typescript
// tailwind.config.ts — extend theme with custom utilities
extend: {
  backgroundImage: {
    'gradient-brand': 'linear-gradient(90deg, #C61063, #F05057)',
    'gradient-hero': 'radial-gradient(at center top, #C11C84 0%, transparent 70%)',
    'gradient-card-hover': 'linear-gradient(135deg, #C11C84, #F05057, #FF88AB)',
  }
}
```

---

## Typography Standards

```typescript
// Heading hierarchy
<h1 className="text-4xl font-bold text-base-content">Page Title</h1>
<h2 className="text-2xl font-bold text-base-content">Section Title</h2>
<h3 className="text-xl font-semibold text-base-content">Card Title</h3>

// Body text
<p className="text-base text-base-content/80">Body copy</p>
<p className="text-sm text-base-content/60">Muted / secondary text</p>

// Brand accent text (for taglines, highlights)
<span className="text-primary font-bold">Empowered. Creative. You.</span>
```

---

## Core Component Patterns

### Card
```typescript
// Standard content card — use for events, portfolios, competitions
<div className="card bg-base-200 shadow-lg rounded-2xl">
  <figure>
    <img src={imageUrl} alt={altText} className="w-full h-48 object-cover" />
  </figure>
  <div className="card-body p-6">
    <h3 className="card-title text-base-content">{title}</h3>
    <p className="text-base-content/60 text-sm">{description}</p>
    <div className="card-actions justify-end mt-4">
      <button className="btn btn-primary btn-sm">View Details</button>
    </div>
  </div>
</div>
```

### Primary Button (Brand Gradient)
```typescript
// Gradient button — use for primary CTAs
<button
  className="btn border-0 text-white font-semibold rounded-lg normal-case
             bg-gradient-brand hover:opacity-90 transition-opacity"
>
  Submit Entry
</button>

// Standard DaisyUI primary button
<button className="btn btn-primary normal-case">Sign Up</button>

// Outline / ghost variant
<button className="btn btn-outline btn-primary normal-case">Learn More</button>

// Loading state
<button className="btn btn-primary normal-case" disabled>
  <span className="loading loading-spinner loading-sm" />
  Saving...
</button>
```

### Form Input (Consistent Styling)
```typescript
// Standard input — always pair with a label for accessibility
<div className="form-control w-full">
  <label className="label" htmlFor="field-id">
    <span className="label-text text-base-content">Field Label</span>
    <span className="label-text-alt text-base-content/50">Optional</span>
  </label>
  <input
    id="field-id"
    type="text"
    placeholder="Placeholder text"
    className="input input-bordered bg-base-200 text-base-content
               border-base-300 focus:border-primary w-full"
  />
</div>

// Error state (from form-validation skill)
<input
  className="input input-bordered input-error bg-base-200 w-full"
  aria-invalid="true"
  aria-describedby="field-error"
/>
<label className="label" id="field-error" role="alert">
  <span className="label-text-alt text-error">Error message here</span>
</label>
```

### Badge / Status Pill
```typescript
// Use for competition entry status, user roles, event capacity
<span className="badge badge-primary">Active</span>
<span className="badge badge-success">Approved</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Rejected</span>
<span className="badge badge-ghost">Guest</span>

// Role badges
<span className="badge badge-secondary text-white">Admin</span>
<span className="badge badge-outline badge-primary">Volunteer</span>
```

### Alert / Notification
```typescript
// Success
<div role="alert" className="alert alert-success">
  <span>Portfolio entry submitted successfully!</span>
</div>

// Error
<div role="alert" className="alert alert-error">
  <span>Something went wrong. Please try again.</span>
</div>

// Info
<div role="alert" className="alert alert-info">
  <span>Competition submissions close on 30 May 2026.</span>
</div>
```

### Loading States
```typescript
// Full page loading
<div className="flex justify-center items-center min-h-screen">
  <span className="loading loading-spinner loading-lg text-primary" />
</div>

// Section loading
<div className="flex justify-center items-center py-12">
  <span className="loading loading-dots loading-md text-primary" />
</div>

// Skeleton card (while data loads)
<div className="card bg-base-200 shadow rounded-2xl">
  <div className="card-body gap-4">
    <div className="skeleton h-6 w-3/4 rounded" />
    <div className="skeleton h-4 w-full rounded" />
    <div className="skeleton h-4 w-2/3 rounded" />
  </div>
</div>
```

### Empty State
```typescript
// Use when a list or section has no data
<div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
  <div className="text-5xl opacity-30">📂</div>
  <h3 className="text-lg font-semibold text-base-content/60">No entries yet</h3>
  <p className="text-sm text-base-content/40">
    Be the first to submit a portfolio entry.
  </p>
  <button className="btn btn-primary btn-sm normal-case mt-2">
    Add Entry
  </button>
</div>
```

### Avatar / Profile Picture
```typescript
// User avatar with fallback initials
<div className="avatar placeholder">
  {imageUrl ? (
    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
      <img src={imageUrl} alt={`${name}'s avatar`} />
    </div>
  ) : (
    <div className="bg-secondary text-white rounded-full w-12">
      <span className="text-lg font-bold">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
</div>
```

### Leaderboard Row
```typescript
// Leaderboard item — highlight top 3 positions
<div className={`flex items-center gap-4 p-4 rounded-xl
  ${rank <= 3 ? 'bg-primary/10 border border-primary/30' : 'bg-base-200'}`}>
  <span className={`text-xl font-bold w-8
    ${rank === 1 ? 'text-yellow-400' :
      rank === 2 ? 'text-gray-300' :
      rank === 3 ? 'text-amber-600' : 'text-base-content/40'}`}>
    #{rank}
  </span>
  <div className="avatar placeholder">
    <div className="bg-secondary text-white rounded-full w-10">
      <span>{name.charAt(0)}</span>
    </div>
  </div>
  <div className="flex-1">
    <p className="font-semibold text-base-content">{name}</p>
    <p className="text-xs text-base-content/50">{points} points</p>
  </div>
  {rank === 1 && <span className="text-2xl">🏆</span>}
</div>
```

---

## Accessibility Rules (WCAG AA)

These are non-negotiable for SheIsDesign:

1. **Colour contrast:** All text must meet 4.5:1 ratio against background. The brand pink `#F05057` on `#1A1A1A` passes AA. **Never use pink text on a white background** without checking contrast first.

2. **Interactive elements:** Every clickable element must be reachable via keyboard (`Tab`) and have a visible focus ring. DaisyUI provides this by default — don't override `outline: none` without replacing it.

3. **Images:** Every `<img>` must have a descriptive `alt` attribute. Decorative images use `alt=""`.

4. **Forms:** Every input must have an associated `<label>` using `htmlFor` / `id`. Never use `placeholder` as the only label.

5. **Icons:** Icon-only buttons must have `aria-label`. e.g. `<button aria-label="Delete event">🗑</button>`

6. **Modals:** DaisyUI modals must trap focus and close on `Escape`. Add `role="dialog"` and `aria-modal="true"`.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `normal-case` on all buttons | Use `uppercase` — it feels aggressive |
| Use `rounded-xl` or `rounded-2xl` on cards | Use sharp `rounded-none` corners |
| Use `text-base-content/60` for muted text | Use hardcoded `text-gray-400` |
| Use `btn btn-primary` for main CTA | Stack multiple primary buttons together |
| Use `shadow-lg` on cards | Use heavy `shadow-2xl` everywhere |
| Test at 375px mobile width | Design only for desktop |
