# CAFlow - Frontend

The frontend client for **CAFlow**, a full-stack financial management web application for small retail businesses.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 1. Environment Variables

Create a `.env.local` file in this directory based on `.env.example`:

```bash
# Frontend API endpoint pointing to CAFlow backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> **Note:** Never commit `.env.local` or real credentials to version control.

### Associated Backend Environment Variables (`backend/.env`)

For reference, the backend server requires:
- `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/caflow?schema=public`)
- `PORT`: Server port (default: `5000`)
- `FRONTEND_URL`: Allowed CORS origin (default: `http://localhost:3000`)

---

## 2. Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Running CAFlow Express backend on port `5000`

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application and live backend health-check status.

### Production Build
```bash
npm run build
```

### Production Run
```bash
npm run start
```

### Type Checking & Linting
```bash
npx tsc --noEmit
npm run lint
```
