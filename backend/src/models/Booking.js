// src/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guest',
    required: [true, 'กรุณาระบุข้อมูลลูกค้า']
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'กรุณาระบุห้องพัก']
  },
  checkIn: {
    type: Date,
    required: [true, 'กรุณาระบุวันที่เช็คอิน']
  },
  checkOut: {
    type: Date,
    required: [true, 'กรุณาระบุวันที่เช็คเอาท์']
  },
  nights: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนคืน']
  },
  adults: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนผู้ใหญ่'],
    default: 1
  },
  children: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนเงินทั้งหมด']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'online', 'other'],
    default: 'cash'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'คำขอพิเศษไม่ควรเกิน 500 ตัวอักษร']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['direct', 'website', 'phone', 'email', 'ota', 'walkin', 'other'],
    default: 'direct'
  },
  notes: {
    type: String,
    maxlength: [1000, 'หมายเหตุไม่ควรเกิน 1000 ตัวอักษร']
  }
}, {
  timestamps: true
});

// สร้างเลขการจองอัตโนมัติ
BookingSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // หาเลขการจองล่าสุดของเดือนนี้
  const lastBooking = await this.constructor.findOne({
    bookingNumber: new RegExp(`^BK${year}${month}`)
  }).sort({ bookingNumber: -1 });
  
  let sequenceNumber = 1;
  
  if (lastBooking) {
    // ดึงเลขลำดับล่าสุดและเพิ่มอีก 1
    const lastSequence = parseInt(lastBooking.bookingNumber.substring(6));
    sequenceNumber = lastSequence + 1;
  }
  
  // สร้างเลขการจอง
  this.bookingNumber = `BK${year}${month}${sequenceNumber.toString().padStart(4, '0')}`;
  
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);