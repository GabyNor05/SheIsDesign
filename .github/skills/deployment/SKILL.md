---
name: deployment
description: "Covers environment setup, build configuration, and deployment procedures for the SheIsDesign platform. Includes Electron app packaging, ASP.NET Core publish profiles, environment variable management, PostgreSQL production setup, and pre-deployment checklist. Use when preparing a build for staging or production, configuring environment variables, setting up a new environment, or troubleshooting deployment issues."
argument-hint: "[environment or deployment step]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — Deployment & Environment Skill

## Stack Reference
- **Frontend:** Electron + React + TypeScript (built with Vite + electron-builder)
- **Backend:** ASP.NET Core (.NET) — published as self-contained or framework-dependent
- **Database:** PostgreSQL (hosted or local)
- **Environment Files:** `.env` (frontend) + `appsettings.json` / environment variables (backend)

---

## Environment Overview

| Environment | Purpose | Database | API URL |
|---|---|---|---|
| `development` | Local development | `sheisdesign_dev` (local PostgreSQL) | `http://localhost:5000` |
| `staging` | Pre-production testing | `sheisdesign_staging` | `https://staging-api.sheisdesign.co.za` |
| `production` | Live system | `sheisdesign_prod` | `https://api.sheisdesign.co.za` |

---

## FRONTEND — Vite + Electron

### 1. Environment Variable Files

```bash
# .env.development — local dev (committed to repo, no secrets)
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SheIsDesign
VITE_ENV=development

# .env.staging — staging build (DO NOT commit — add to .gitignore)
VITE_API_URL=https://staging-api.sheisdesign.co.za
VITE_APP_NAME=SheIsDesign
VITE_ENV=staging

# .env.production — production build (DO NOT commit — use CI/CD secrets)
VITE_API_URL=https://api.sheisdesign.co.za
VITE_APP_NAME=SheIsDesign
VITE_ENV=production
```

### 2. .gitignore — Never Commit These
```bash
# Environment files with real values
.env.staging
.env.production
.env.local

# Build outputs
dist/
dist-electron/
release/

# Secrets
*.pem
*.key
*.p12
```

### 3. Vite Config — vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? './' : '/',
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production', // No source maps in production
    minify: mode === 'production',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
}));
```

### 4. Electron Builder Config — electron-builder.yml
```yaml
# electron-builder.yml
appId: za.co.sheisdesign.app
productName: SheIsDesign
copyright: Copyright © 2026 SheIsDesign

directories:
  output: release
  buildResources: build-assets

files:
  - dist/**/*
  - dist-electron/**/*

win:
  target:
    - target: nsis
      arch: [x64]
  icon: build-assets/icon.ico

mac:
  target:
    - target: dmg
      arch: [x64, arm64]
  icon: build-assets/icon.icns

linux:
  target:
    - target: AppImage
      arch: [x64]
  icon: build-assets/icon.png
```

### 5. Build Commands
```bash
# Development — run with hot reload
npm run dev

# Build frontend only (Vite)
npm run build

# Build Electron app for current platform
npm run electron:build

# Build for specific platform (from CI/CD)
npm run electron:build -- --win
npm run electron:build -- --mac
npm run electron:build -- --linux

# Preview production build locally before packaging
npm run preview
```

---

## BACKEND — ASP.NET Core (.NET)

### 1. Environment Variables (never hardcode secrets)

```bash
# Set in your OS environment, CI/CD pipeline, or hosting platform
# Never put real values in appsettings.json

ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=prod-db;Database=sheisdesign_prod;Username=dbuser;Password=STRONG_PASSWORD
Jwt__Key=YOUR_256_BIT_SECRET_KEY_MINIMUM_32_CHARS
Jwt__Issuer=SheIsDesign
Jwt__Audience=SheIsDesignUsers
Jwt__ExpiryMinutes=60
```

### 2. appsettings Structure
```json
// appsettings.json — safe defaults, no secrets
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Jwt": {
    "Issuer": "SheIsDesign",
    "Audience": "SheIsDesignUsers",
    "ExpiryMinutes": 60
  }
}
```

```json
// appsettings.Development.json — local dev only, safe to commit
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sheisdesign_dev;Username=postgres;Password=devpassword"
  },
  "Jwt": {
    "Key": "dev-only-key-min-32-characters-long!!"
  }
}
```

### 3. Publish Commands
```bash
# Publish self-contained (includes .NET runtime — no install needed on server)
dotnet publish -c Release -r win-x64 --self-contained true -o ./publish/win

# Publish framework-dependent (smaller, but .NET must be installed on server)
dotnet publish -c Release -o ./publish/server

# Run database migrations before starting the app in production
dotnet ef database update --project SheIsDesign.Data --startup-project SheIsDesign.Api
```

### 4. CORS Configuration — Program.cs
```csharp
// Allow Electron app to call the API in production
builder.Services.AddCors(options =>
{
    options.AddPolicy("ElectronApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // In production, Electron calls via file:// or custom protocol
            // Adjust this based on your Electron IPC setup
            policy.WithOrigins("app://sheis-design")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

app.UseCors("ElectronApp");
```

---

## PostgreSQL — Production Setup

```sql
-- Run once on the production database server
CREATE DATABASE sheisdesign_prod;
CREATE USER sheisdesign_user WITH ENCRYPTED PASSWORD 'STRONG_UNIQUE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE sheisdesign_prod TO sheisdesign_user;
```

```bash
# Verify connection before deploying
psql -h prod-host -U sheisdesign_user -d sheisdesign_prod -c "SELECT version();"
```

---

## Pre-Deployment Checklist

### Before Every Deployment
- [ ] All environment variables set in the target environment (not hardcoded)
- [ ] `.env.production` and `.env.staging` excluded from git
- [ ] Database migrations run and verified: `dotnet ef migrations list`
- [ ] JWT secret key is at least 32 characters and unique per environment
- [ ] CORS origins updated to match the production Electron app protocol
- [ ] `ASPNETCORE_ENVIRONMENT` set to `Production`
- [ ] Serilog writing to a persistent log directory
- [ ] Default admin account password changed from seed value

### Frontend Build Checks
- [ ] `npm run build` completes without errors
- [ ] `VITE_API_URL` points to the correct backend URL
- [ ] Source maps disabled for production (`sourcemap: false`)
- [ ] App icon assets present in `build-assets/`

### Backend Build Checks
- [ ] `dotnet publish -c Release` completes without warnings
- [ ] All secrets loaded from environment variables (not `appsettings.json`)
- [ ] `Database.Migrate()` NOT called on startup in production
- [ ] Health check endpoint available: `GET /health`

---

## Local Dev Quick Start (New Team Member Setup)

```bash
# 1. Clone the repo
git clone https://github.com/git-happens/she-is-design.git
cd she-is-design

# 2. Install frontend dependencies
cd frontend && npm install

# 3. Copy dev environment file
cp .env.example .env.development
# Edit .env.development with your local API URL

# 4. Restore backend packages
cd ../backend && dotnet restore

# 5. Set up local database
createdb sheisdesign_dev
dotnet ef database update --project SheIsDesign.Data --startup-project SheIsDesign.Api

# 6. Start backend
dotnet run --project SheIsDesign.Api

# 7. Start frontend (in a new terminal)
cd frontend && npm run dev
```
