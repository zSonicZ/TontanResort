// src/models/Guest.js
const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['นาย', 'นาง', 'นางสาว', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'อื่นๆ'],
    default: 'นาย'
  },
  firstName: {
    type: String,
    required: [true, 'กรุณาระบุชื่อ']
  },
  lastName: {
    type: String,
    required: [true, 'กรุณาระบุนามสกุล']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'กรุณาระบุอีเมลที่ถูกต้อง'
    ]
  },
  phone: {
    type: String,
    required: [true, 'กรุณาระบุเบอร์โทรศัพท์'],
    match: [/^[0-9]{9,15}$/, 'กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง']
  },
  idType: {
    type: String,
    enum: ['บัตรประชาชน', 'พาสปอร์ต', 'ใบขับขี่', 'อื่นๆ'],
    default: 'บัตรประชาชน'
  },
  idNumber: {
    type: String
  },
  nationality: {
    type: String,
    default: 'ไทย'
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'ไทย' }
  },
  dateOfBirth: {
    type: Date
  },
  vip: {
    type: Boolean,
    default: false
  },
  preferences: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    maxlength: [1000, 'หมายเหตุไม่ควรเกิน 1000 ตัวอักษร']
  },
  lastVisit: {
    type: Date
  },
  visitCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual เพื่อรวมชื่อและนามสกุล
GuestSchema.virtual('fullName').get(function() {
  return `${this.title} ${this.firstName} ${this.lastName}`;
});

// Virtual เพื่อหาการจองทั้งหมดของลูกค้า
GuestSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'guest',
  justOne: false
});

module.exports = mongoose.model('Guest', GuestSchema);