# Database Setup Guide

## Overview

The Kushon application uses PostgreSQL as its database and Prisma as the ORM. This guide explains how the database is set up automatically and how to manage it manually.

## Automatic Setup (Heroku)

When you deploy to Heroku, the database is automatically set up using the **release phase**:

1. **Migrations**: All pending migrations are applied to create/update tables
2. **Seeding**: Initial data is populated (if the database is empty)

This happens before the web dyno starts, ensuring the database is ready.

### What Gets Created

The schema includes these tables:
- **publishers**: Publisher information
- **titles**: Manga/comic titles
- **volumes**: Individual volumes for each title
- **users**: User accounts
- **user_roles**: User role assignments (ADMIN, USER)
- **user_volumes**: User volume tracking (owned, notified)
- **notification_preferences**: User notification settings per title

### Initial Seed Data

The seed creates:
- **Admin User**:
  - Email: `admin@kushon.com`
  - Password: `admin123`
  - Role: ADMIN

- **Regular User**:
  - Email: `user@kushon.com`
  - Password: `user123`
  - Role: USER

- **Sample Publisher**: Shogakukan (Japan)

- **Sample Title**: One Piece
  - Author: Eiichiro Oda
  - Genre: Aventura, Shonen
  - Status: ONGOING
  - 2 volumes with sample data

**IMPORTANT**: Change these default passwords after first login in production!

## Manual Database Management

### Run Migrations Only

To apply migrations without seeding:

```bash
# On Heroku
heroku run npm run prisma:migrate:deploy --app YOUR_APP_NAME

# Locally (requires local PostgreSQL)
cd backend
npm run prisma:migrate:deploy
```

### Run Seeding Only

To populate initial data:

```bash
# On Heroku
heroku run npm run prisma:seed:prod --app YOUR_APP_NAME

# Locally
cd backend
npm run prisma:seed
```

### Full Database Setup

To run both migrations and seeding:

```bash
# On Heroku
heroku run npm run db:deploy --app YOUR_APP_NAME

# Locally
cd backend
npm run db:deploy
```

### View Database

To explore the database using Prisma Studio:

```bash
# Locally only
cd backend
npm run prisma:studio
```

This opens a web interface at http://localhost:5555

### Reset Database (Development Only)

**WARNING**: This deletes all data!

```bash
# Locally only
cd backend
npm run prisma:reset
```

## Database Schema Management

### Creating New Migrations

When you modify the Prisma schema:

```bash
cd backend
npm run prisma:migrate
# Follow the prompts to name your migration
```

This creates a new migration file in `backend/prisma/migrations/`

### Viewing Migration Status

```bash
# On Heroku
heroku run npx prisma migrate status --app YOUR_APP_NAME

# Locally
cd backend
npx prisma migrate status
```

## Troubleshooting

### Seeding Fails with "Unique constraint"

This is normal if the database already has data. The seed script tries to create initial data, but if users/titles already exist, it will fail. This is okay - your existing data is preserved.

Solution: Seeding is optional and the app will work fine without it.

### Migration Fails

Check the Heroku logs:

```bash
heroku logs --tail --app YOUR_APP_NAME
```

Look for migration errors in the release phase. Common issues:
- Database URL not set
- Conflicting schema changes
- Data that violates new constraints

### Database Connection Issues

Verify your DATABASE_URL is set:

```bash
heroku config:get DATABASE_URL --app YOUR_APP_NAME
```

Check database status:

```bash
heroku pg:info --app YOUR_APP_NAME
```

### Resetting Heroku Database

**WARNING**: This deletes all data!

```bash
# Reset the database
heroku pg:reset DATABASE --app YOUR_APP_NAME --confirm YOUR_APP_NAME

# Run migrations and seed again
heroku run npm run db:deploy --app YOUR_APP_NAME
```

## Development Workflow

1. **Modify schema**: Edit `backend/prisma/schema.prisma`
2. **Create migration**: `npm run prisma:migrate`
3. **Test locally**: Ensure app works with new schema
4. **Commit changes**: Include migration files in git
5. **Deploy**: Heroku automatically applies migrations

## Production Best Practices

1. **Always backup before major migrations**:
   ```bash
   heroku pg:backups:capture --app YOUR_APP_NAME
   ```

2. **Test migrations on a staging database first**

3. **Use Prisma's preview features carefully**

4. **Monitor migration logs during deployment**

5. **Keep seed data minimal** - Only essential records

## Database Connection Limits

Heroku Postgres has connection limits based on your plan:
- **Essential-0** (free): 20 connections
- **Mini**: 50 connections
- **Basic**: 120 connections

The Prisma connection pool is configured automatically, but be aware of these limits if scaling.

## Useful Commands

```bash
# View all Heroku Postgres commands
heroku pg --help

# Connect to database with psql
heroku pg:psql --app YOUR_APP_NAME

# View database size
heroku pg:info --app YOUR_APP_NAME

# View table row counts
heroku run npx prisma db execute --sql "SELECT table_name, (xpath('/row/count/text()', xml_count))[1]::text::int as row_count FROM (SELECT table_name, table_schema, query_to_xml(format('SELECT COUNT(*) FROM %I.%I', table_schema, table_name), false, true, '') as xml_count FROM information_schema.tables WHERE table_schema = 'public') t ORDER BY table_name;" --app YOUR_APP_NAME
```

## Schema Visualization

The current schema relationships:

```
Publisher (1) ──→ (*) Title
                       ↓ (1)
                      (*) Volume
                           ↓ (*)
                          UserVolume (*)
                           ↑
                          (1)
                         User
                          ↓ (1)
                         (*) UserRole
                         (*) NotificationPreference
```

## Support

For database-related issues:
1. Check the logs first
2. Verify environment variables
3. Check migration status
4. Review this documentation
5. Check Heroku Postgres status page
