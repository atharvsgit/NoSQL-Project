const express = require('express');
const router = express.Router();
const {
  createEvent,
  getApprovedEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
  deleteEvent,
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// POST /api/events - Create event (Faculty, Admin)
router.post('/', protect, authorize('FACULTY', 'ADMIN'), createEvent);

// GET /api/events - Get all approved events (Public)
router.get('/', getApprovedEvents);

// GET /api/events/all - Get all events including pending/rejected (Faculty, Admin, HOD)
router.get('/all', protect, authorize('FACULTY', 'ADMIN', 'HOD'), getAllEvents);

// GET /api/events/:id - Get single event (Public)
router.get('/:id', getEventById);

// PUT /api/events/:id - Update event (Faculty - own event, Admin)
router.put('/:id', protect, authorize('FACULTY', 'ADMIN'), updateEvent);

// PUT /api/events/status/:id - Update event status (Admin, HOD)
router.put('/status/:id', protect, authorize('ADMIN', 'HOD'), updateEventStatus);

// DELETE /api/events/:id - Delete event (Faculty - own event, Admin)
router.delete('/:id', protect, authorize('FACULTY', 'ADMIN'), deleteEvent);

module.exports = router;
