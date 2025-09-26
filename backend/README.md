# Kushon Backend

A NestJS backend application for title and volume management with Clean Architecture principles.

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM  
- **Architecture**: Clean Architecture with SOLID principles
- **Authentication**: bcrypt for password hashing
- **Validation**: class-validator and class-transformer

## Project Structure

```
src/
├── domain/          # Business logic and entities
├── application/     # Use cases and DTOs
├── infra/          # External services and repositories
└── presentation/   # Controllers and HTTP layer
```

## Setup

### Prerequisites

- Node.js (>= 18)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/kushon?schema=public"
   ```

3. **Database setup**:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed database with sample data
   npm run prisma:seed
   ```

## Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Database Scripts

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:reset` - Reset database and run migrations + seed

## Database Schema

The application includes these models:

- **Publisher**: Manages publishing companies
- **Title**: Manages manga/comic titles
- **Volume**: Individual volumes of titles
- **User**: Application users
- **UserRole**: User roles (ADMIN/USER)
- **UserVolume**: User-volume relationships for tracking owned/notification status

## Sample Data

After running `npm run prisma:seed`, you'll have:

- **Admin User**: `admin@kushon.com` / `admin123`
- **Regular User**: `user@kushon.com` / `user123`
- **Publisher**: Shogakukan (Japan)
- **Title**: One Piece with 2 volumes

## Architecture Layers

- **Domain**: Pure business logic, entities, and repository interfaces
- **Application**: Use cases implementations and application services
- **Infrastructure**: Database repositories, external services, and adapters
- **Presentation**: HTTP controllers, DTOs, guards, and validation

## Development Workflow

1. Create/modify domain entities and value objects
2. Define repository interfaces in domain layer
3. Implement use cases in application layer
4. Create infrastructure implementations (Prisma repositories)
5. Add presentation layer (controllers, DTOs, validation)
6. Write tests and run quality checks
