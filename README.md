# Job Application Tracker

A production-ready, full-stack job application tracker with a clean monorepo structure.

```
application-tracker/
├── frontend/   Next.js 15 · TypeScript · Tailwind CSS
└── backend/    Express · TypeScript · Prisma · PostgreSQL
```

## Features

- Track applications: Applied, Interviewing, Offer, Rejected
- Filter by status and debounced full-text search
- Add, edit, view, and delete applications via modals
- Dashboard stat cards with live counts
- Loading skeletons, toast notifications, delete confirmation
- Strict TypeScript throughout — zero `any`
- Clean architecture: config → types → validations → services → controllers → routes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Validation | Zod |
| UI Extras | react-hot-toast, lucide-react |

---

## Prerequisites

- Node.js 18+
- PostgreSQL database running locally or remotely

---

## Setup

### 1. Clone

```bash
git clone https://github.com/yugpokharel/ApplicationTracker.git
cd ApplicationTracker
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/application_tracker?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Install dependencies and run migrations:

```bash
npm install
npm run db:migrate
npm run db:generate
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install and run:

```bash
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

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
