const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// These should point to your actual controller functions
// If they don't exist yet, create placeholder functions
const { 
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController') || {
  // Placeholder controller functions if yours aren't available
  getBookings: (req, res) => res.status(200).json({ success: true, data: [] }),
  getBooking: (req, res) => res.status(200).json({ success: true, data: {} }),
  createBooking: (req, res) => res.status(201).json({ success: true, data: {} }),
  updateBooking: (req, res) => res.status(200).json({ success: true, data: {} }),
  deleteBooking: (req, res) => res.status(200).json({ success: true, data: {} })
};

// Get all bookings
router.get('/', protect, getBookings);

// Get single booking
router.get('/:id', protect, getBooking);

// Create booking
router.post('/', protect, createBooking);

// Update booking
router.put('/:id', protect, updateBooking);

// Delete booking
router.delete('/:id', protect, authorize('admin', 'manager'), deleteBooking);

module.exports = router;