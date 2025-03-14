const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, username, password, role, department } = req.body;

  try {
    // Check if user already exists
    let userByEmail = await User.findOne({ email });
    let userByUsername = await User.findOne({ username });

    if (userByEmail) {
      return res.status(400).json({
        success: false,
        error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว'
      });
    }

    if (userByUsername) {
      return res.status(400).json({
        success: false,
        error: 'ชื่อผู้ใช้นี้ถูกใช้งานในระบบแล้ว'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      username,
      password,
      role: role || 'staff',
      department: department || 'front_desk'
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // Check if email is already taken by another user
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว'
        });
      }
    }

    // Check if username is already taken by another user
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'ชื่อผู้ใช้นี้ถูกใช้งานในระบบแล้ว'
        });
      }
    }

    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: 'ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้'
        });
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้'
    });
  }
};