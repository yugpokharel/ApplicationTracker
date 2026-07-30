# JobTracker.io | Secure Career Operations Platform

A full-stack, enterprise-grade job application tracker built with Next.js, Express.js, PostgreSQL, and Prisma ORM, engineered according to **Zero-Trust Architecture** guidelines and security assessment specifications.

---

## 🔒 Security Assessment & Architectural Specifications

This application was upgraded to meet and exceed all requirements of the security assessment module:

### 1. Zero-Trust Access Control & IDOR Prevention
- **Tenant Isolation**: Every database query for job applications enforces `userId: req.user.id`, completely eliminating Insecure Direct Object References (IDOR).
- **Strict Role-Based Access Control (RBAC)**: Supports `USER` and `ADMIN` roles. Administrative actions (viewing system users, account unlock, audit stream) require `ADMIN` role verification.
- **Mass Assignment Defense**: Client request bodies are sanitized via strict Zod schemas, preventing clients from modifying sensitive user fields like `role` or `id`.

### 2. Multi-Factor Authentication (MFA / 2FA) & Password Policy
- **RFC 6238 TOTP Standard**: Support for Google Authenticator / Authy 2FA with live QR Code scanning and 6-digit TOTP verification.
- **Strong Password Policy**: Enforces minimum 10 characters, uppercase, lowercase, numbers, and special symbols with real-time visual strength feedback.
- **Bcrypt Hashing**: Passwords stored using 12 salt rounds.

### 3. Brute-Force Protection & Account Lockout
- **Automated Rate Limiting**: Express rate limiters throttle authentication endpoints (10 attempts per 15 mins) and general API routes.
- **Account Lockout Threshold**: Consecutive failed login attempts (5 attempts) automatically lock the target user account for 15 minutes.

### 4. Data Protection & Cryptography at Rest
- **AES-256-GCM Field Encryption**: Application notes and sensitive details are encrypted at rest using AES-256-GCM symmetric encryption before storage.
- **Data Integrity via HMAC SHA-256**: Transactions feature HMAC signatures and idempotency keys to prevent replay attacks and ensure double-spend protection.

### 5. GDPR Data Portability & Privacy Rights
- **Data Export (GDPR Art. 20)**: One-click export of complete user profile, application history, and security log metadata into JSON format.
- **Data Import**: Restore backup JSON application data with strict schema validation.
- **Right to be Forgotten**: Account erasure feature.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript, Lucide Icons |
| **Backend** | Express.js, Node.js, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (Bearer Tokens), Bcrypt, RFC 6238 TOTP (Base32 / HMAC-SHA1) |
| **Security & Auditing**| Express Rate Limit, AES-256-GCM, Audit Logging Engine, Zod Validation |

---
**Screenshots**
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  25 29" src="https://github.com/user-attachments/assets/93277713-de31-4b9a-9adf-b6166684f411" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  23 41" src="https://github.com/user-attachments/assets/c358057a-abc1-4df9-999d-6bbec6cf470e" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  23 58" src="https://github.com/user-attachments/assets/4621bb08-a8a2-453a-bc6f-41727e397edc" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  25 03" src="https://github.com/user-attachments/assets/41735221-27d7-4c33-a9cf-efa34a2e2647" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  24 19" src="https://github.com/user-attachments/assets/b443f4f2-0c87-4bc5-883c-18eba4aeabac" />
<img width="2048" height="1280" alt="CleanShot 2026-06-19 at 9  24 55" src="https://github.com/user-attachments/assets/8e9ff3cf-8722-4486-a6ac-900eae48558f" />







## 🛠️ Quick Start & Setup

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment Variables

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_tracker"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET="super-secret-jwt-key-change-in-production-32bytes!"
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef"
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database Migration & Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Run Automated Security Unit Tests

```bash
npm test
```

### 5. Start Application Locally

Open two terminal tabs:

**Tab 1 - Backend:**
```bash
npm run dev:backend
```

**Tab 2 - Frontend:**
```bash
npm run dev:frontend
```

Navigate to `http://localhost:3000`.

---

## 🌐 API Endpoint Overview

Base URL: `http://localhost:5000/api`

### Auth & Security (`/auth`)
- `POST /api/auth/register` - Create new user account with password policy check
- `POST /api/auth/login` - Authenticate credentials & prompt 2FA if enabled
- `GET /api/auth/me` - Get current session identity
- `POST /api/auth/mfa/setup` - Generate TOTP secret & QR Code
- `POST /api/auth/mfa/verify` - Activate 2FA TOTP
- `POST /api/auth/mfa/disable` - Turn off 2FA TOTP

### Profile & GDPR (`/profile`)
- `GET /api/profile` - Fetch profile metadata & application stats
- `PATCH /api/profile` - Update personalization details
- `POST /api/profile/change-password` - Change password with policy verification
- `GET /api/profile/export` - Export GDPR compliant JSON archive
- `POST /api/profile/import` - Import job tracker records
- `DELETE /api/profile/account` - Right to be forgotten account erasure

### Application Operations (`/applications`)
- `GET /api/applications` - List applications (supports `?status=` and `?search=`)
- `GET /api/applications/:id` - Fetch application details
- `POST /api/applications` - Create job application (AES-256 notes encryption)
- `PATCH /api/applications/:id` - Update job application
- `DELETE /api/applications/:id` - Delete job application

### Secure Transactions (`/transactions`)
- `POST /api/transactions` - Process HMAC-signed transaction with idempotency key
- `GET /api/transactions` - View transaction history

### Admin Console (`/admin`)
- `GET /api/admin/users` - Directory of all users & lockout states (ADMIN only)
- `POST /api/admin/users/:id/unlock` - Reset account lockout threshold (ADMIN only)
- `GET /api/admin/logs` - Real-time security audit log stream (ADMIN only)

---

## 📜 License

MIT - Developed for Security Assessment Coursework Evaluation.
