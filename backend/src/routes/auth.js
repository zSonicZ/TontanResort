const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Register user
router.post(
  '/register',
  [
    check('name', 'กรุณาระบุชื่อ').not().isEmpty(),
    check('email', 'กรุณาระบุอีเมลที่ถูกต้อง').isEmail(),
    check('username', 'กรุณาระบุชื่อผู้ใช้').not().isEmpty(),
    check('password', 'กรุณาระบุรหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร').isLength({ min: 6 })
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    check('username', 'กรุณาระบุชื่อผู้ใช้หรืออีเมล').not().isEmpty(),
    check('password', 'กรุณาระบุรหัสผ่าน').exists()
  ],
  login
);

// Get current user
router.get('/me', protect, getMe);

// Forgot password
router.post(
  '/forgotpassword',
  [
    check('email', 'กรุณาระบุอีเมลที่ถูกต้อง').isEmail()
  ],
  forgotPassword
);

// Reset password
router.put(
  '/resetpassword/:resettoken',
  [
    check('password', 'กรุณาระบุรหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร').isLength({ min: 6 })
  ],
  resetPassword
);

// Change password
router.put(
  '/changepassword',
  protect,
  [
    check('currentPassword', 'กรุณาระบุรหัสผ่านปัจจุบัน').not().isEmpty(),
    check('newPassword', 'กรุณาระบุรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 6 ตัวอักษร').isLength({ min: 6 })
  ],
  changePassword
);

// Logout
router.get('/logout', protect, logout);

module.exports = router;