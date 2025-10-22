# Heroku Deployment Setup Guide

## Required Environment Variables

The Kushon application requires the following environment variables to be set on Heroku:

### Critical Variables (Required)

These variables **must** be set or the application will fail to start:

```bash
# Database URL - Set automatically when you add Heroku Postgres addon
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret - Must be at least 32 characters for security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

### Optional Variables (Recommended)

These variables are optional but recommended for full functionality:

```bash
# SMTP Configuration (for email functionality)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=noreply@kushon.app

# Frontend URL (for email links and CORS)
FRONTEND_URL=https://your-app-name.herokuapp.com
```

## Setup Instructions

### 1. Check Current Heroku App Name

```bash
# List your Heroku apps
heroku apps

# Or check in your current directory
heroku apps:info
```

### 2. Add PostgreSQL Database

If you haven't already added a database:

```bash
# Add Heroku Postgres (free hobby-dev tier)
heroku addons:create heroku-postgresql:essential-0 --app YOUR_APP_NAME

# Verify DATABASE_URL was set automatically
heroku config:get DATABASE_URL --app YOUR_APP_NAME
```

### 3. Set Required Environment Variables

```bash
# Set JWT_SECRET (generate a secure random string)
heroku config:set JWT_SECRET="$(openssl rand -base64 48)" --app YOUR_APP_NAME

# Set FRONTEND_URL
heroku config:set FRONTEND_URL="https://YOUR_APP_NAME.herokuapp.com" --app YOUR_APP_NAME
```

### 4. Set Optional Email Variables (if needed)

```bash
# Gmail SMTP example
heroku config:set SMTP_HOST="smtp.gmail.com" --app YOUR_APP_NAME
heroku config:set SMTP_PORT="587" --app YOUR_APP_NAME
heroku config:set SMTP_FROM="noreply@kushon.app" --app YOUR_APP_NAME
heroku config:set SMTP_USER="your-email@gmail.com" --app YOUR_APP_NAME
heroku config:set SMTP_PASS="your-app-password" --app YOUR_APP_NAME
```

### 5. Verify All Config Vars

```bash
# List all config vars
heroku config --app YOUR_APP_NAME

# Should show at minimum:
# - DATABASE_URL
# - JWT_SECRET
```

### 6. Deploy

```bash
# Push to Heroku
git push heroku main

# Or if you're on a different branch
git push heroku your-branch:main

# Watch the logs
heroku logs --tail --app YOUR_APP_NAME
```

## Troubleshooting

### Error: "Missing critical environment variables"

If you see this error in the logs:

```
❌ CRITICAL ERROR: Missing required environment variables!
   Variables: DATABASE_URL, JWT_SECRET
```

**Solution**: Set the missing variables using the commands above.

### Error: "JWT_SECRET must be at least 32 characters long"

**Solution**: Generate a longer secret:

```bash
heroku config:set JWT_SECRET="$(openssl rand -base64 48)" --app YOUR_APP_NAME
```

### Database Connection Issues

If the app starts but can't connect to the database:

```bash
# Check if DATABASE_URL is set
heroku config:get DATABASE_URL --app YOUR_APP_NAME

# Check Postgres addon status
heroku addons --app YOUR_APP_NAME

# Check database info
heroku pg:info --app YOUR_APP_NAME
```

## Viewing Detailed Startup Logs

The application now includes comprehensive startup logging. When you deploy or restart the app, you'll see:

```
════════════════════════════════════════════════════════════════
🚀 KUSHON BACKEND APPLICATION - STARTUP SEQUENCE
════════════════════════════════════════════════════════════════
📅 Timestamp: ...
🖥️  Platform: ...
📦 Node Version: ...
🔧 Working Directory: ...
🌍 Environment: ...
🚪 Port: ...

🔍 ENVIRONMENT VALIDATION STARTING...
📦 ENVIRONMENT INFORMATION: ...
🗄️  DATABASE_URL: ...
📋 ENVIRONMENT VARIABLES STATUS: ...
✅ ENVIRONMENT VALIDATION COMPLETED SUCCESSFULLY

🏗️  Creating NestJS application...
✅ NestJS application created successfully
...
```

This makes it easy to diagnose startup issues.

## Commands Reference

```bash
# View logs in real-time
heroku logs --tail --app YOUR_APP_NAME

# Restart the application
heroku restart --app YOUR_APP_NAME

# Run database migrations
heroku run npm run prisma:migrate --app YOUR_APP_NAME

# Open the app in browser
heroku open --app YOUR_APP_NAME

# Check dyno status
heroku ps --app YOUR_APP_NAME
```

## Build and Deployment Process

The Heroku deployment automatically runs these steps:

### 1. Install Dependencies
`npm install` for backend and frontend workspaces

### 2. Post-Build (heroku-postbuild script)
- Generate Prisma client
- Build backend (TypeScript → JavaScript)
- Build frontend (Vite build)

### 3. Release Phase (before starting the app)
- **Run database migrations**: Creates/updates all database tables
- **Seed initial data**: Populates admin user, sample data (if database is empty)

This ensures your database is ready before the app starts!

### 4. Start
Run `npm run start:prod` in backend directory

You'll see detailed logs for each step during deployment.

## Default Login Credentials

After the first deployment, you can login with:

**Admin Account**:
- Email: `admin@kushon.com`
- Password: `admin123`
- Role: ADMIN

**Regular User Account**:
- Email: `user@kushon.com`
- Password: `user123`
- Role: USER

**IMPORTANT**: Change these passwords immediately after first login!

For more details on database management, see [DATABASE_SETUP.md](DATABASE_SETUP.md)
