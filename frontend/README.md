# MSRIT Department Management System - Frontend

A React-based frontend application for the Ramaiah Institute of Technology Department Management System. Features role-based access control, event management, registration tracking, and approval workflows.

## Features

### 🔐 Authentication
- Secure login/signup with JWT tokens
- Password validation and error handling
- Persistent authentication with localStorage
- Automatic token refresh on API calls

### 👥 Role-Based Access Control (RBAC)
Four user roles with distinct permissions:
- **STUDENT**: Register for events, view registrations, mark attendance
- **FACULTY**: Create events, view registrations, manage attendance
- **HOD**: Approve events, manage department events
- **ADMIN**: Full system access, user role management

### 📊 Dashboard
- Role-specific statistics and metrics
- Total events, registrations, users count
- Recent events display
- Quick action buttons

### 🎯 Event Management
- Browse all events with status filters
- Detailed event view with description
- Event creation form (Faculty/HOD/Admin)
- Event approval workflow (HOD/Admin)
- Status tracking: PENDING → APPROVED → COMPLETED/CANCELLED

### 📝 Registration System
- Quick event registration
- View my registrations with status
- Attendance marking
- Registration approval by event creators

### 👤 User Management (Admin Only)
- View all users with roles
- Change user roles dynamically
- Search and filter users

## Tech Stack

- **React 18+** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - Global state management
- **Vite** - Build tool and dev server
- **Pure CSS3** - Styling with black/white/grey theme

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on `http://localhost:5173` by default.

## Environment Setup

Ensure the backend API is running on `http://localhost:5000`. If your backend uses a different port, update `src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT/api'
});
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout wrapper
│   ├── Navbar.jsx          # Top navigation bar
│   └── Sidebar.jsx         # Side navigation menu
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Registration page
│   ├── Dashboard.jsx       # Role-specific dashboard
│   ├── Events.jsx          # All events listing
│   ├── EventDetails.jsx    # Single event view
│   ├── CreateEvent.jsx     # Event creation form
│   ├── MyRegistrations.jsx # User's registrations
│   ├── EventApproval.jsx   # Event approval (HOD/Admin)
│   └── UserManagement.jsx  # User role management (Admin)
├── context/
│   └── AuthContext.jsx     # Authentication state
├── utils/
│   └── api.js              # Axios configuration
├── App.jsx                 # Router setup
├── App.css                 # Global styles
├── index.css               # Theme variables
└── main.jsx                # App entry point
```

## API Integration

All API calls go through `src/utils/api.js` which:
- Sets base URL to backend API
- Attaches JWT token to requests automatically
- Handles 401 unauthorized responses
- Manages token refresh logic

### API Endpoints Used

```
Auth:
POST /api/auth/signup       - User registration
POST /api/auth/login        - User login

Users:
GET  /api/users             - Get all users (Admin)
PATCH /api/users/:id/role   - Change user role (Admin)

Events:
GET    /api/events          - Get all events
GET    /api/events/:id      - Get event details
POST   /api/events          - Create event
PATCH  /api/events/:id      - Update event
DELETE /api/events/:id      - Delete event
PATCH  /api/events/:id/approve - Approve event

Registrations:
GET  /api/registrations/my            - Get my registrations
POST /api/registrations/:eventId      - Register for event
GET  /api/registrations/event/:eventId - Get event registrations
PATCH /api/registrations/:id/status   - Update registration status
```

## Routes

```
Public Routes:
/ or /login     - Login page
/signup         - Signup page

Protected Routes (require authentication):
/dashboard      - Role-specific dashboard
/events         - All events listing
/events/:id     - Event details
/create-event   - Create new event (Faculty+)
/my-registrations - User's registrations
/event-approval - Event approval (HOD/Admin)
/users          - User management (Admin only)
```

## Theme Colors

Black/White/Grey color scheme:

```css
--color-primary: #1a1a1a    /* Black */
--color-white: #ffffff       /* White */
--color-background: #f5f5f5  /* Light grey background */
--color-text: #333333        /* Dark grey text */
--color-border: #e0e0e0      /* Border grey */
--color-success: #4caf50     /* Green for success */
--color-danger: #f44336      /* Red for danger */
--color-warning: #ff9800     /* Orange for warning */
```

## Responsive Design

- **Desktop**: Full layout with sidebar
- **Tablet** (≤1024px): Adjusted spacing
- **Mobile** (≤768px): Collapsible sidebar, stacked layout
- **Small Mobile** (≤480px): Optimized for small screens

## Development Tips

### Adding a New Page

1. Create component in `src/pages/YourPage.jsx`
2. Create corresponding `YourPage.css` file
3. Add route in `src/App.jsx`:
```jsx
<Route path="/your-page" element={<YourPage />} />
```
4. Add navigation link in `Sidebar.jsx`

### Protected Routes

Wrap routes requiring authentication:
```jsx
<Route path="/protected" element={
  <ProtectedRoute>
    <YourComponent />
  </ProtectedRoute>
} />
```

### Role-Based Features

Use `AuthContext` to check user role:
```jsx
const { user } = useAuth();
if (user.role === 'ADMIN') {
  // Show admin features
}
```

## Troubleshooting

**Issue**: API calls fail with CORS errors  
**Solution**: Ensure backend has CORS enabled and is running

**Issue**: Authentication doesn't persist  
**Solution**: Check localStorage for `token` key; verify token format

**Issue**: Pages show "Loading..." indefinitely  
**Solution**: Check network tab for failed API calls; verify backend connectivity

**Issue**: Role-based features not working  
**Solution**: Verify user role in localStorage matches backend role

## Build and Deploy

```bash
# Build for production
npm run build

# Output will be in dist/ folder
# Deploy dist/ folder to your hosting service (Netlify, Vercel, etc.)
```

### Environment Variables for Production

Create `.env` file:
```
VITE_API_URL=https://your-backend-api.com/api
```

Update `api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
```

## Backend Repository

This frontend connects to the MSRIT Department Management System backend. Ensure the backend is running before starting this application.

Backend features:
- MongoDB database
- JWT authentication
- Role-based authorization
- Event approval workflow
- Registration management

---

**Developed for Ramaiah Institute of Technology**  
Simple, clean, and functional department management system.
