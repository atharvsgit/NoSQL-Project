# MSRIT Department Management System

A full-stack MERN application for managing college department events, registrations, and user roles at Ramaiah Institute of Technology.

## Overview

This system provides a comprehensive platform for managing department events with role-based access control. Students can browse and register for events, faculty can create and manage events, HODs can approve events, and admins have full system control including user management.

## Features

### Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (RBAC)
- Four user roles: STUDENT, FACULTY, HOD, ADMIN
- Persistent sessions with token management

### Event Management
- Create, update, and delete events
- Event approval workflow (PENDING -> APPROVED -> REJECTED)
- Event capacity tracking
- Registration count monitoring
- Event filtering by status and department

### Registration System
- Student event registration
- Registration status tracking
- Attendance marking
- Capacity management
- Prevent duplicate registrations

### User Management
- View all users (Admin only)
- Change user roles dynamically
- User search and filtering
- Department-based organization

### Dashboard
- Role-specific statistics
- Recent events display
- Quick action buttons
- Pending approvals alerts

## Tech Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- JWT - Authentication tokens
- CORS - Cross-origin resource sharing

### Frontend
- React 18+ - UI library
- React Router DOM - Client-side routing
- Axios - HTTP client
- Context API - State management
- Vite - Build tool
- Pure CSS3 - Styling (black/white/grey theme)

## Project Structure

```
nosql/
├── server/                 # Backend application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication & authorization
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
│
└── README.md             # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn package manager

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/msrit-department-management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
```
POST   /api/auth/signup        - Register new user
POST   /api/auth/login         - User login
```

### Users
```
GET    /api/users              - Get all users (Admin)
GET    /api/users/me           - Get current user profile
PATCH  /api/users/:id/role     - Update user role (Admin)
```

### Events
```
GET    /api/events             - Get all approved events
GET    /api/events/all         - Get all events (Faculty+)
GET    /api/events/:id         - Get single event
POST   /api/events             - Create event (Faculty+)
PATCH  /api/events/:id         - Update event (Owner/Admin)
DELETE /api/events/:id         - Delete event (Owner/Admin)
PATCH  /api/events/:id/approve - Approve/reject event (HOD/Admin)
```

### Registrations
```
POST   /api/registrations/:eventId           - Register for event
GET    /api/registrations/my                 - Get user's registrations
GET    /api/registrations/event/:eventId     - Get event registrations
PATCH  /api/registrations/:id/status         - Update registration status
DELETE /api/registrations/:eventId           - Unregister from event
```

## User Roles & Permissions

### STUDENT
- Browse and view events
- Register for approved events
- View own registrations
- Mark attendance

### FACULTY
- All student permissions
- Create events
- View and manage own events
- View registrations for own events
- Update event details

### HOD
- Browse all events
- Approve or reject pending events
- View department statistics

### ADMIN
- Full system access
- Create and manage all events
- Approve or reject events
- Change user roles
- View all registrations
- User management

## Database Schema

### User Model
```
- name: String (required)
- email: String (required, unique)
- password: String (required, min 6 chars)
- role: ADMIN | HOD | FACULTY | STUDENT
- department: CSE | ECE | ME | EEE | ISE | CIVIL | AIML | AIDS | CSBS
- timestamps
```

### Event Model
```
- title: String (required)
- description: String (required)
- date: Date (required)
- venue: String (required)
- department: String (required)
- capacity: Number (optional)
- status: PENDING | APPROVED | REJECTED | COMPLETED | CANCELLED
- organizer: User reference
- registrationsCount: Number
- timestamps
```

### Registration Model
```
- event: Event reference
- user: User reference
- status: REGISTERED | ATTENDED | CANCELLED
- attended: Boolean
- registrationDate: Date
- timestamps
```

## Development

### Running in Development Mode

Start backend:
```bash
cd server
npm run dev
```

Start frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## Testing

### Test User Creation
You can manually create test users with different roles using the signup endpoint or MongoDB directly.

### Sample API Calls

Register a new student:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT",
    "department": "CSE"
  }'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Theme

The application uses a clean black/white/grey color scheme:
- Primary: #1a1a1a (Black)
- Background: #f5f5f5 (Light grey)
- Text: #333333 (Dark grey)
- Borders: #e0e0e0 (Border grey)
- Success: #4caf50 (Green)
- Danger: #f44336 (Red)
- Warning: #ff9800 (Orange)

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

**JWT Token Errors**
- Verify JWT_SECRET is set in .env
- Check token expiration settings
- Clear browser localStorage and login again

### Frontend Issues

**API Connection Failed**
- Ensure backend is running on port 5000
- Check baseURL in src/utils/api.js
- Verify CORS is enabled on backend

**Authentication Not Persisting**
- Check browser console for errors
- Verify token is stored in localStorage
- Clear cache and cookies

## Security Notes

- Passwords are stored as plain text (for development only)
- In production, implement proper password hashing
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Enable HTTPS in production

## Future Enhancements

- Email notifications for event approvals
- Calendar view for events
- Export registration data to CSV
- Event categories and tags
- File upload for event posters
- Real-time notifications
- Mobile responsive improvements
- Dark mode support

## License

This project is developed for Ramaiah Institute of Technology.

## Contributors

Vedant Parasrampuria
<br>
Atharv Dixit
<br>
Vedang Srivastava

## Support
Made with love ❤️

For issues and questions, contact the development team or create an issue in the repository.
