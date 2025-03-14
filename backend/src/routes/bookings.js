const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Get all bookings
router.get('/', protect, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Get all bookings',
    data: []
  });
});

// Get single booking
router.get('/:id', protect, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Get booking with id ${req.params.id}`,
    data: {}
  });
});

// Create booking
router.post('/', protect, (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Booking created',
    data: req.body
  });
});

// Update booking
router.put('/:id', protect, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Booking ${req.params.id} updated`,
    data: { id: req.params.id, ...req.body }
  });
});

// Delete booking
router.delete('/:id', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Booking ${req.params.id} deleted`,
    data: {}
  });
});

module.exports = router;