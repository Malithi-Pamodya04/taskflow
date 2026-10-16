# TaskFlow: Smart Task Management System

A responsive full-stack task management app built for the iFeX International development intern assessment.

## Features
- User registration and login (bcrypt password hashing, JWT authentication)
- Role-based access control (`user` and `admin`); admin-only Users page
- Create, edit, delete tasks with priority (Low/Medium/High), deadline, description and status (To Do/In Progress/Completed)
- Dashboard with total, completed, pending and overdue counts plus charts
- Search by title, filter by status and priority, sort by deadline or creation date
- Server-side validation, rate limiting, Helmet security headers, parameterized SQL
- Responsive dark UI (desktop, tablet, mobile) with loading states, error messages and toast notifications

## Tech stack
React (Vite), Tailwind CSS, Recharts, Axios, React Router | Node.js, Express | MySQL | Git/GitHub

## Prerequisites
Node.js 20+ (LTS), MySQL 8.x, Git

## Setup

### 1. Clone
```bash
git clone https://github.com/Malithi-Pamodya04/taskflow.git
cd taskflow
```

### 2. Database
```bash
mysql -u root -p < backend/database/schema.sql
```

### 3. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then set your MySQL password and a long random `JWT_SECRET`
(generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
```bash
npm run dev
```
API runs at http://localhost:5000

### 4. Frontend
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env`.
```bash
npm run dev
```
App runs at http://localhost:5173

### 5. Create an admin (optional)
Register normally, then in MySQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```
Log out and back in (the role is stored in the token).

## API endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/me | Current user | Auth |
| GET | /api/tasks | List (search, status, priority, sort, order) | Auth |
| POST | /api/tasks | Create | Auth |
| GET/PUT/DELETE | /api/tasks/:id | Read, update, delete own task | Auth |
| GET | /api/dashboard/stats | Dashboard statistics | Auth |
| GET | /api/users | List users | Admin |

## Security notes
- Passwords hashed with bcrypt (12 rounds); secrets live in `.env` (never committed)
- JWT verified on every protected route; role checked by `authorize` middleware
- Every task query includes `user_id` from the token, so users only access their own tasks
- Input validated with express-validator; all SQL is parameterized; sort columns are whitelisted
- Helmet, CORS restricted to the frontend origin, request size limit, login/register rate limiting

## Database
Tables `users` and `tasks` (one-to-many, `ON DELETE CASCADE`). Schema: `backend/database/schema.sql`.

## Screenshots
Screenshots of every page are in the [`screenshots`](screenshots) folder.