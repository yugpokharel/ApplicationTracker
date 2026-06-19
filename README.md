# Job Application Tracker

A full-stack job application tracker built with Next.js, Express.js, PostgreSQL, and Prisma ORM. Helps you keep track of where you've applied, what stage you're in, and any notes you want to remember.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS, TypeScript |
| Backend | Express.js, Node.js, TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Validation | Zod |

## What it does

**Application management**
- Add, edit, view, and delete job applications
- Filter by status: Applied, Interviewing, Offer, Rejected
- Search by company name or job title
- Tag by job type: Internship, Full-time, Part-time

**UI**
- Clean dashboard with stats at the top
- Real-time search and filter
- Toast notifications for feedback
- Confirm before deleting anything
- Form validation with error messages

**Code**
- TypeScript strict mode on both frontend and backend
- Type-safe API client
- Clean layered architecture (controller, service, repository)
- No `any` types

---
**Screenshots**
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  25 29" src="https://github.com/user-attachments/assets/93277713-de31-4b9a-9adf-b6166684f411" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  23 41" src="https://github.com/user-attachments/assets/c358057a-abc1-4df9-999d-6bbec6cf470e" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  23 58" src="https://github.com/user-attachments/assets/4621bb08-a8a2-453a-bc6f-41727e397edc" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  25 03" src="https://github.com/user-attachments/assets/41735221-27d7-4c33-a9cf-efa34a2e2647" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  24 19" src="https://github.com/user-attachments/assets/b443f4f2-0c87-4bc5-883c-18eba4aeabac" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  24 55" src="https://github.com/user-attachments/assets/8e9ff3cf-8722-4486-a6ac-900eae48558f" />







## Prerequisites

- Node.js 18+
- PostgreSQL 13+ installed locally OR Docker installed (for docker-compose)

---

## Setup

### 1. Clone

```bash
git clone https://github.com/yugpokharel/ApplicationTracker.git
cd ApplicationTracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://tracker_user:tracker_password@localhost:5432/application_tracker?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Set up the database

You can choose either option below to run PostgreSQL:

#### Option A: Running PostgreSQL locally
Start PostgreSQL on your machine, connect to your console, and create the database:

```bash
psql postgres
```

```sql
CREATE ROLE tracker_user WITH LOGIN PASSWORD 'tracker_password' SUPERUSER;
CREATE DATABASE application_tracker OWNER tracker_user;
\q
```

#### Option B: Running via Docker Compose (Bonus Point)
If you have Docker installed, simply start the database container from the root directory:

```bash
docker compose up -d
```

### 5. Run migrations

Generate the schema and apply the migrations:

```bash
npm run db:migrate
```

---

## Running Tests (Bonus Point)

Run the backend validation unit tests from the root directory:

```bash
npm test
```

Or from the backend directory:

```bash
npm run test -w backend
```

---

## Running locally

Open two terminal tabs:

**Tab 1 - Backend (port 5000):**

```bash
npm run dev:backend
```

**Tab 2 - Frontend (port 3000):**

```bash
npm run dev:frontend
```

Go to http://localhost:3000.

---

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List all applications (supports `?status=` and `?search=`) |
| GET | `/applications/:id` | Get a single application |
| POST | `/applications` | Create a new application |
| PATCH | `/applications/:id` | Update an application |
| DELETE | `/applications/:id` | Delete an application |

### Request body (POST/PATCH)

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

`job_type`: `Internship` | `FullTime` | `PartTime`
`status`: `Applied` | `Interviewing` | `Offer` | `Rejected`

---

## Project structure

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
│   │   ├── schema.prisma
│   │   └── migrations/
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

## Database schema

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `company_name` | String | Required |
| `job_title` | String | Required |
| `job_type` | Enum | Internship, FullTime, PartTime |
| `status` | Enum | Applied, Interviewing, Offer, Rejected |
| `applied_date` | DateTime | Required |
| `notes` | String | Optional |
| `created_at` | DateTime | Auto-set on create |
| `updated_at` | DateTime | Auto-updated |

---

## Backend architecture

```
backend/src/
├── config/
│   ├── env.ts            env validation
│   └── database.ts       Prisma singleton
├── types/
│   └── index.ts          domain types and DTOs
├── validations/
│   └── application.validation.ts   Zod schemas
├── services/
│   └── application.service.ts      business logic and DB queries
├── controllers/
│   └── application.controller.ts   HTTP handlers
├── routes/
│   ├── application.route.ts
│   └── index.ts
├── middleware/
│   ├── validate.ts       Zod middleware
│   └── errorHandler.ts   global error handler
├── app.ts                Express app setup
└── index.ts              server entry point
```

---

## Available scripts

### Backend

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

### Frontend

| Script | What it does |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

### Root (shortcuts)

| Script | What it does |
|--------|-------------|
| `npm run dev:backend` | Start backend |
| `npm run dev:frontend` | Start frontend |
| `npm run db:migrate` | Run migrations |

---

## License

MIT
