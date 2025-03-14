// backend/src/scripts/createAdminUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // เชื่อมต่อกับฐานข้อมูล
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // ตรวจสอบว่ามีผู้ใช้แอดมินอยู่แล้วหรือไม่
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // สร้างผู้ใช้แอดมิน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      name: 'ผู้ดูแลระบบ',
      email: 'admin@tontanresort.com',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      department: 'admin',
      position: 'System Administrator',
      status: 'active'
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();