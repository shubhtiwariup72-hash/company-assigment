# Nopser Admin Dashboard

A full-stack React Admin Dashboard built for the **Nopser Research Pvt Ltd** assignment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6 |
| Routing | React Router DOM v7 |
| Data Fetching / Caching | TanStack Query v5 (React Query) |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) |

---

## Features

### Authentication
- Login with email + password validation
- Show / Hide password toggle
- **Remember Me** — checked → persists in `localStorage`; unchecked → session only (`sessionStorage`)
- JWT stored and attached to every request via Axios interceptor
- Protected routes — unauthenticated users redirected to `/`
- Logout clears token and redirects to login

### Dashboard
- 4 stats cards (Total Users, Active Users, Products, Revenue) from live API
- Area chart — Monthly User Growth
- Bar chart — Monthly Revenue Trend
- Quick stats summary

### Users Module (Full CRUD)
- List all users with paginated table (6 per page)
- Search by **name** or **email** (debounced 400ms)
- Filter by **role** (Admin / User) and **status** (Active / Inactive)
- Add user (modal form with validation)
- Edit user (pre-populated modal)
- Delete user (confirmation modal)
- View user detail page (`/dashboard/users/:id`)

### Products Module (Full CRUD)
- List all products with paginated table
- Search by **name** or **category** (debounced)
- Filter by **category** and **status**
- Add / Edit / Delete products via modals

### Reports
- User role distribution (Pie chart)
- User status distribution (Pie chart)
- Products by category (Pie chart)
- Top products by price (Bar chart)
- Monthly revenue vs user growth (Bar chart)

### Settings
- Profile form (Name, Email) with validation
- Dark / Light mode toggle (persisted in localStorage)
- Notification toggles

### Layout
- Responsive sidebar (collapses on mobile with overlay)
- Sticky header with user dropdown + theme toggle
- Dynamic breadcrumb navigation (shows "User Detail" instead of raw IDs)
- Footer

---

## Performance Optimizations

| Technique | Where Applied |
|-----------|--------------|
| `React.memo` | `UserRow`, `StatsCard`, `Badge`, `Pagination`, `ProductForm` |
| `useMemo` | Filtered/searched user & product lists |
| `useCallback` | All event handlers passed to memoized children |
| `useDebounce` hook | Search inputs (400ms debounce) |
| **TanStack Query** | All list/detail APIs cached with 5-minute `staleTime` |
| Cache invalidation | After every Create/Update/Delete mutation |
| `React.lazy` + `Suspense` | All 7 pages (route-level code splitting) |
| Loading states | Spinner shown while API fetches |
| Error states | Graceful error messages on API failure |
| Empty states | "No users found" / "No products found" messages |

---

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   ├── productsController.js
│   │   └── statsController.js
│   ├── data/
│   │   └── db.json            # Seed data source
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── MonthlyStats.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   └── stats.js
│   ├── seed.js                # One-time DB seed script
│   └── server.js
│
└── src/
    ├── api/                   # Axios API functions
    │   ├── authApi.js
    │   ├── userApi.js
    │   ├── productApi.js
    │   └── statsApi.js
    ├── components/
    │   ├── common/            # Loader, Modal, Pagination, Badge
    │   ├── dashboard/         # StatsCard, UserGrowthChart, RevenueChart
    │   ├── users/             # UserRow (React.memo), UserForm
    │   └── products/          # ProductForm (React.memo)
    ├── context/
    │   ├── AuthContext.jsx    # JWT auth state
    │   └── ThemeContext.jsx   # Dark/light theme
    ├── hooks/
    │   ├── useAuth.js
    │   └── useDebounce.js
    ├── layout/
    │   ├── MainLayout.jsx
    │   ├── Sidebar.jsx
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   └── Breadcrumb.jsx
    ├── pages/
    │   ├── auth/Login.jsx
    │   ├── dashboard/Dashboard.jsx
    │   ├── users/Users.jsx
    │   ├── users/UserDetail.jsx
    │   ├── products/Products.jsx
    │   ├── reports/Reports.jsx
    │   └── settings/Settings.jsx
    ├── routes/
    │   ├── AppRoutes.jsx      # React.lazy + Suspense
    │   └── ProtectedRoute.jsx
    ├── services/
    │   └── axiosInstance.js   # Axios + JWT interceptor
    └── utils/
        ├── storage.js         # localStorage / sessionStorage helpers
        └── helpers.js         # formatDate, formatCurrency, etc.
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nopser-dashboard.git
cd nopser-dashboard
```

### 2. Frontend — install dependencies

```bash
npm install
```

### 3. Backend — install dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Environment Variables

**Frontend** — create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** — create `backend/.env`:

```env
PORT=5000
JWT_SECRET=nopser-super-secret-jwt-key-change-in-production-2026
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/nopser_dashboard?appName=Cluster0
```

> ⚠️ `backend/.env` is git-ignored. Never commit it.

### 5. Seed the database (run once)

```bash
cd backend
node seed.js
```

This imports 12 users, 12 products, and 8 months of stats from `backend/data/db.json`.

---

## Running the Application

### Start the backend (Terminal 1)

```bash
cd backend
npm run dev      # uses nodemon for hot-reload
# OR
npm start        # plain node
```

Server runs at: `http://localhost:5000`

### Start the frontend (Terminal 2)

```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## Login Credentials

```
Email:    admin@nopser.com
Password: Admin@123
```

Other seeded users all have password: `Pass@123`

---

## API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://<your-render-service>.onrender.com/api`

### Response Format (all endpoints)

```json
{
  "success": true,
  "message": "...",
  "data": {} 
}
```

---

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/auth/login` | ❌ | Login and receive JWT |

**Request body:**
```json
{ "email": "admin@nopser.com", "password": "Admin@123" }
```

**Success response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "u1",
      "name": "Admin User",
      "email": "admin@nopser.com",
      "role": "admin",
      "status": "active",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

---

### Users

All user endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all users (passwords excluded) |
| `GET` | `/users/:id` | Get single user by `id` field |
| `POST` | `/users` | Create a new user |
| `PUT` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |

**POST / PUT body fields:**

| Field | Type | Required | Notes |
|-------|------|:---:|-------|
| `name` | string | ✅ | |
| `email` | string | ✅ | Must be unique, valid format |
| `password` | string | POST only | Defaults to `Pass@123` if omitted |
| `role` | `"admin"` \| `"user"` | ✅ | |
| `status` | `"active"` \| `"inactive"` | ✅ | |

---

### Products

All product endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all products |
| `GET` | `/products/:id` | Get single product by `id` field |
| `POST` | `/products` | Create a new product |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |

**POST / PUT body fields:**

| Field | Type | Required | Notes |
|-------|------|:---:|-------|
| `name` | string | ✅ | |
| `price` | number | ✅ | Must be ≥ 0 |
| `category` | string | ✅ | e.g. Electronics, Audio |
| `status` | `"active"` \| `"inactive"` | ✅ | |

---

### Stats

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/stats` | ✅ | Dashboard summary + monthly data |

**Response data:**
```json
{
  "totalUsers": 12,
  "activeUsers": 8,
  "totalProducts": 12,
  "revenue": 3379.88,
  "monthlyStats": [
    { "month": "Jan", "users": 2, "revenue": 4200 },
    ...
  ]
}
```

---

## Deployment

### Backend → Render (free tier)

1. Push code to GitHub
2. Create **New → Web Service** on [render.com](https://render.com)
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables: `MONGODB_URI`, `JWT_SECRET`
5. Copy the deployed URL (e.g. `https://nopser-backend.onrender.com`)

### Frontend → Netlify

1. Connect GitHub repo on [netlify.com](https://netlify.com)
2. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Add environment variable: `VITE_API_URL=https://nopser-backend.onrender.com/api`
4. Trigger deploy

> The included `netlify.toml` handles SPA routing (prevents 404 on page refresh).

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## Assignment Submission Checklist

- [x] Login with JWT + protected routes
- [x] Show/hide password + Remember Me (sessionStorage vs localStorage)
- [x] Dashboard with 4 stats cards + 2 charts
- [x] Users CRUD + search + filter + pagination + detail view
- [x] Products CRUD + search + filter + pagination
- [x] Reports page with 5 charts
- [x] Settings page with theme toggle + notifications
- [x] Logout — clears token, redirects to login
- [x] Responsive layout (mobile sidebar)
- [x] Dark mode
- [x] React.memo on UserRow, StatsCard, Badge, Pagination, ProductForm
- [x] useMemo + useCallback for filtered lists and handlers
- [x] useDebounce on search inputs
- [x] TanStack Query caching (5-min staleTime, invalidation on mutations)
- [x] React.lazy + Suspense (all 7 pages lazy-loaded)
- [x] Loading states + error states + empty states
- [x] MongoDB Atlas database
- [x] Node.js + Express backend with proper response format
- [x] All API endpoints with validation and error handling
- [x] README with setup, env vars, and API docs
