// src/models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'กรุณาระบุหมายเลขห้อง'],
    unique: true
  },
  floor: {
    type: Number,
    required: [true, 'กรุณาระบุชั้น']
  },
  type: {
    type: String,
    required: [true, 'กรุณาระบุประเภทห้อง'],
    enum: ['Deluxe', 'Superior', 'Suite', 'Family']
  },
  price: {
    type: Number,
    required: [true, 'กรุณาระบุราคาห้อง']
  },
  capacity: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนผู้เข้าพักสูงสุด'],
    default: 2
  },
  description: {
    type: String,
    maxlength: [500, 'คำอธิบายห้องไม่ควรเกิน 500 ตัวอักษร']
  },
  amenities: {
    type: [String],
    default: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์']
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance', 'cleaning'],
    default: 'available'
  },
  cleaningStatus: {
    type: String,
    enum: ['clean', 'dirty', 'cleaning'],
    default: 'clean'
  },
  lastCleaned: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: 'default-room.jpg'
  },
  notes: {
    type: String,
    maxlength: [1000, 'หมายเหตุไม่ควรเกิน 1000 ตัวอักษร']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);