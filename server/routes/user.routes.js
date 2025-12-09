const express = require('express');
const router = express.Router();
const {
  getMe,
  getAllUsers,
  updateUserRole,
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// GET /api/users/me - Get current user profile
router.get('/me', protect, getMe);

// GET /api/users - Get all users (Admin only)
router.get('/', protect, authorize('ADMIN'), getAllUsers);

// PUT /api/users/role/:id - Update user role (Admin only)
router.put('/role/:id', protect, authorize('ADMIN'), updateUserRole);

module.exports = router;
