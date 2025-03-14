const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { check } = require('express-validator');

// Import user controller
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getUser);

// @route   POST /api/users
// @desc    Create user
// @access  Private/Admin
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    check('name', 'กรุณาระบุชื่อ').not().isEmpty(),
    check('email', 'กรุณาระบุอีเมลที่ถูกต้อง').isEmail(),
    check('username', 'กรุณาระบุชื่อผู้ใช้').not().isEmpty(),
    check('password', 'กรุณาระบุรหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร').isLength({ min: 6 })
  ],
  createUser
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;