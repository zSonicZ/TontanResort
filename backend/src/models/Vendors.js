// src/models/Vendor.js
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'กรุณาระบุรหัสผู้จัดจำหน่าย'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อผู้จัดจำหน่าย'],
    trim: true
  },
  contactPerson: {
    name: String,
    position: String,
    phone: String,
    email: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'ไทย' }
  },
  phone: {
    type: String,
    required: [true, 'กรุณาระบุเบอร์โทรศัพท์']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'กรุณาระบุอีเมลที่ถูกต้อง'
    ]
  },
  taxId: {
    type: String
  },
  website: String,
  category: {
    type: [String],
    enum: ['เครื่องดื่ม', 'อาหาร', 'ของใช้ห้องพัก', 'อุปกรณ์ทำความสะอาด', 'อุปกรณ์สำนักงาน', 'อื่นๆ'],
    default: ['อื่นๆ']
  },
  paymentTerms: {
    type: String,
    default: '30 วัน'
  },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    maxlength: [1000, 'หมายเหตุไม่ควรเกิน 1000 ตัวอักษร']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', VendorSchema);