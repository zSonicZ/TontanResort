const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Get all inventory items
router.get('/', protect, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Get all inventory items',
    data: []
  });
});

// Get single inventory item
router.get('/:id', protect, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Get inventory item with id ${req.params.id}`,
    data: {}
  });
});

// Create inventory item
router.post('/', protect, authorize('admin', 'staff'), (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Inventory item created',
    data: req.body
  });
});

// Update inventory item
router.put('/:id', protect, authorize('admin', 'staff'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Inventory item ${req.params.id} updated`,
    data: { id: req.params.id, ...req.body }
  });
});

// Delete inventory item
router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Inventory item ${req.params.id} deleted`,
    data: {}
  });
});

module.exports = router;