# Job Application Tracker

A production-ready, full-stack job application tracker built with **Next.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. Track your job applications through different hiring stages with a clean, intuitive interface.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, TypeScript (Strict) |
| **Backend** | Express.js, Node.js, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Validation** | Zod for schema validation |

## Features

✅ **Application Management**
- Create, read, update, and delete job applications
- Filter applications by status (Applied, Interviewing, Offer, Rejected)
- Search by company name or job title
- Categorize by job type (Internship, Full-time, Part-time)

✅ **User Experience**
- Responsive, clean dashboard interface
- Real-time filtering and search
- Loading states and error handling
- Toast notifications for user feedback
- Delete confirmation modal to prevent accidents
- Proper form validation with error messages

✅ **Code Quality**
- TypeScript strict mode throughout
- Type-safe API client
- Proper error handling and HTTP status codes
- Clean, modular architecture
- No `any` types used

---

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 13+ (local or Docker)
- **Docker** & **Docker Compose** (optional, for containerized PostgreSQL)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yugpokharel/ApplicationTracker.git
cd ApplicationTracker
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for both backend and frontend.

### 3. Set Up Environment Variables

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/application_tracker?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Set Up PostgreSQL

**Using Docker Compose (Recommended):**

```bash
docker compose up -d
```

**Or use local PostgreSQL:**

Update `DATABASE_URL` in `backend/.env` with your connection string.

### 5. Run Database Migrations

```bash
cd backend
npm run db:migrate
npm run db:generate
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend (Port 5000):**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 3000):**

```bash
cd frontend
npm run dev
```

Access at **http://localhost:3000**

### Production Build

```bash
cd backend && npm run build && npm start
cd frontend && npm run build && npm start
```

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applications` | List applications (supports `?status=` and `?search=`) |
| GET | `/applications/:id` | Get single application |
| POST | `/applications` | Create application |
| PATCH | `/applications/:id` | Update application |
| DELETE | `/applications/:id` | Delete application |

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── types/
│   │   └── validations/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── package.json
│
└── docker-compose.yml
```

---

## Environment Variables

### Root `.env`
```
DATABASE_URL="postgresql://tracker_user:tracker_password@localhost:5432/application_tracker?schema=public"
```

### Backend `backend/.env`
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/application_tracker?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Database Schema

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `company_name` | String | Required, min 2 chars |
| `job_title` | String | Required |
| `job_type` | Enum | Internship, FullTime, PartTime |
| `status` | Enum | Applied, Interviewing, Offer, Rejected |
| `applied_date` | DateTime | Required |
| `notes` | String | Optional |
| `created_at` | DateTime | Auto-set |
| `updated_at` | DateTime | Auto-updated |

---

## TypeScript

Both backend and frontend use **strict mode** (`"strict": true`).

---

## License

MIT

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List all (supports `?status=` and `?search=`) |
| GET | `/applications/:id` | Get one application |
| POST | `/applications` | Create application |
| PATCH | `/applications/:id` | Partial update |
| DELETE | `/applications/:id` | Delete |

### POST/PATCH body shape

```json
{
  "company_name": "Google",
  "job_title": "Software Engineer",
  "job_type": "FullTime",
  "status": "Applied",
  "applied_date": "2025-01-15T00:00:00.000Z",
  "notes": "Referred by John"
}
```

`job_type` values: `Internship` | `FullTime` | `PartTime`  
`status` values: `Applied` | `Interviewing` | `Offer` | `Rejected`

---

## Database Schema

```prisma
model Application {
  id           String   @id @default(uuid())
  company_name String
  job_title    String
  job_type     JobType
  status       Status   @default(Applied)
  applied_date DateTime
  notes        String?
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

---

## Backend Architecture

```
backend/src/
├── config/
│   ├── env.ts            Environment validation
│   └── database.ts       Prisma singleton
├── types/
│   └── index.ts          Domain types & DTOs
├── validations/
│   └── application.validation.ts   Zod schemas
├── services/
│   └── application.service.ts      Business logic & DB queries
├── controllers/
│   └── application.controller.ts   HTTP request/response
├── routes/
│   ├── application.route.ts        Express router
│   └── index.ts                    Route registry
├── middleware/
│   ├── validate.ts       Reusable Zod middleware
│   └── errorHandler.ts   Global 404 + error handler
├── app.ts                Express app factory
└── index.ts              Server entry + graceful shutdown
```

---

## Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint check |

### Root (convenience)

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start backend |
| `npm run dev:frontend` | Start frontend |
| `npm run db:migrate` | Run migrations |
