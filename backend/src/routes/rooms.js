const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// These should point to your actual controller functions
// If they don't exist yet, create placeholder functions
const { 
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController') || {
  // Placeholder controller functions if yours aren't available
  getRooms: (req, res) => res.status(200).json({ success: true, data: [] }),
  getRoom: (req, res) => res.status(200).json({ success: true, data: {} }),
  createRoom: (req, res) => res.status(201).json({ success: true, data: {} }),
  updateRoom: (req, res) => res.status(200).json({ success: true, data: {} }),
  deleteRoom: (req, res) => res.status(200).json({ success: true, data: {} })
};

// Get all rooms
router.get('/', getRooms);

// Get single room
router.get('/:id', getRoom);

// Create room
router.post('/', protect, authorize('admin', 'manager'), createRoom);

// Update room
router.put('/:id', protect, authorize('admin', 'manager'), updateRoom);

// Delete room
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;