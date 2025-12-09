const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  getEventRegistrations,
  unregisterFromEvent,
  checkInAttendee,
} = require('../controllers/registration.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// POST /api/registrations/:eventId - Register for event (Student)
router.post('/:eventId', protect, authorize('STUDENT'), registerForEvent);

// GET /api/registrations/user - Get user's registrations
router.get('/user', protect, getUserRegistrations);

// GET /api/registrations/event/:eventId - Get event registrations (Faculty - own event, Admin)
router.get('/event/:eventId', protect, authorize('FACULTY', 'ADMIN'), getEventRegistrations);

// DELETE /api/registrations/:eventId - Unregister from event (Student)
router.delete('/:eventId', protect, authorize('STUDENT'), unregisterFromEvent);

// PUT /api/registrations/checkin/:registrationId - Check-in attendee (Faculty, Admin)
router.put('/checkin/:registrationId', protect, authorize('FACULTY', 'ADMIN'), checkInAttendee);

module.exports = router;
