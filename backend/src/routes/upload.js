const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { uploadProfile, uploadRoom, uploadInventory } = require('../config/cloudinary');
const { 
  uploadProfileImage, 
  uploadRoomImage, 
  uploadInventoryImage, 
  deleteImage 
} = require('../controllers/uploadController');

// Create custom middleware for handling multer error
const handleMulterError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'ขนาดไฟล์เกินกำหนด'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'ไม่รองรับประเภทไฟล์นี้'
    });
  }
  
  return next(err);
};

// Upload profile image
router.post(
  '/profile',
  protect,
  (err, req, res, next) => {
    if (err) return handleMulterError(err, req, res, next);
    next();
  },
  uploadProfile.single('image'),
  uploadProfileImage
);

// Upload room image
router.post(
  '/room/:id',
  protect,
  authorize('admin', 'manager'),
  (err, req, res, next) => {
    if (err) return handleMulterError(err, req, res, next);
    next();
  },
  uploadRoom.single('image'),
  uploadRoomImage
);

// Upload inventory image
router.post(
  '/inventory/:id',
  protect,
  authorize('admin', 'staff'),
  (err, req, res, next) => {
    if (err) return handleMulterError(err, req, res, next);
    next();
  },
  uploadInventory.single('image'),
  uploadInventoryImage
);

// Delete image
router.delete(
  '/:folder/:publicId',
  protect,
  authorize('admin'),
  deleteImage
);

module.exports = router;