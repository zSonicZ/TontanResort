const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Get all rooms
router.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Get all rooms',
    data: []
  });
});

// Get single room
router.get('/:id', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Get room with id ${req.params.id}`,
    data: {}
  });
});

// Create room
router.post('/', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Room created',
    data: req.body
  });
});

// Update room
router.put('/:id', protect, authorize('admin', 'manager'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Room ${req.params.id} updated`,
    data: { id: req.params.id, ...req.body }
  });
});

// Delete room
router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Room ${req.params.id} deleted`,
    data: {}
  });
});

module.exports = router;