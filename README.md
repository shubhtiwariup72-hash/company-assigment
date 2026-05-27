# Nopser Admin Dashboard

A full-stack React Admin Dashboard with Node.js + JSON file backend, built for the Nopser Research Pvt Ltd assignment.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM v6 (with lazy loading)
- TanStack Query v5 (caching + data fetching)
- Tailwind CSS v3
- Recharts (charts)
- Lucide React (icons)
- Axios

**Backend**
- Node.js + Express.js
- JSON file storage (`backend/data/db.json`)
- JWT authentication
- uuid (ID generation)

## Features

- **Authentication** — Login with JWT, protected routes, show/hide password, Remember Me
- **Dashboard** — Stats cards (users, active users, products, revenue), area chart, bar chart
- **Users CRUD** — List, add, edit, delete, view detail, search by name/email, filter by role/status, pagination
- **Products CRUD** — List, add, edit, delete, search, filter by category/status, pagination
- **Reports** — Pie charts (role distribution, status, category), bar charts, monthly trends
- **Settings** — Profile edit, dark/light mode toggle, notification toggles
- **Responsive** — Mobile sidebar with overlay, responsive grid layouts
- **Dark Mode** — Full dark mode support via Tailwind CSS class strategy

## Performance Optimizations

- `React.memo` on `UserRow`, `Badge`, `Pagination`, `StatsCard` components
- `useMemo` for filtered/searched lists (avoids re-filtering on every render)
- `useCallback` for event handlers passed to memoized children
- `useDebounce` hook (400ms) on search inputs
- React Query caching with 5-minute staleTime — prevents redundant API calls
- `React.lazy` + `Suspense` for all pages (route-level code splitting)

## Project Structure

```
├── backend/
│   ├── controllers/       # Business logic
│   ├── data/db.json        # JSON database
│   ├── middleware/auth.js  # JWT middleware
│   ├── routes/             # Express routers
│   ├── utils/db.js         # JSON read/write helper
│   └── server.js
│
└── src/
    ├── api/                # Axios API functions
    ├── components/
    │   ├── common/         # Loader, Modal, Pagination, Badge
    │   ├── dashboard/      # StatsCard, UserGrowthChart, RevenueChart
    │   ├── users/          # UserRow, UserForm
    │   └── products/       # ProductForm
    ├── context/            # AuthContext, ThemeContext
    ├── hooks/              # useAuth, useDebounce
    ├── layout/             # MainLayout, Sidebar, Header, Footer, Breadcrumb
    ├── pages/              # auth, dashboard, users, products, reports, settings
    ├── routes/             # AppRoutes, ProtectedRoute
    ├── services/           # axiosInstance (with JWT interceptor)
    └── utils/              # storage, helpers
```

## Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm v9+

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Environment Variables

No `.env` file is required for the default setup. The backend uses:
- Port: `5000`
- JWT Secret: `nopser-secret-key-2026` (hardcoded for demo)

The frontend API base URL is `http://localhost:5000/api` (configured in `src/services/axiosInstance.js`).

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Server runs at: `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
npm run dev
```

App runs at: `http://localhost:5173`

## Login Credentials

```
Email:    admin@nopser.com
Password: Admin@123
```

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |

**Login Request:**
```json
{ "email": "admin@nopser.com", "password": "Admin@123" }
```
**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "u1", "name": "Admin User", "email": "admin@nopser.com", "role": "admin", "status": "active" }
  }
}
```

### Users (All require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Products (All require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Stats (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get dashboard stats |

**Standard Response Format:**
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.
