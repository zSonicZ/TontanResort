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

// src/models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'กรุณาระบุรหัสสินค้า'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อสินค้า'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'กรุณาระบุหมวดหมู่สินค้า'],
    enum: ['เครื่องดื่ม', 'อาหาร', 'ของใช้ห้องพัก', 'อุปกรณ์ทำความสะอาด', 'อุปกรณ์สำนักงาน', 'อื่นๆ']
  },
  unit: {
    type: String,
    required: [true, 'กรุณาระบุหน่วยนับ'],
    default: 'ชิ้น'
  },
  currentStock: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนคงเหลือ'],
    min: [0, 'จำนวนคงเหลือต้องไม่น้อยกว่า 0']
  },
  minStock: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    required: [true, 'กรุณาระบุราคาทุน']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'กรุณาระบุราคาขาย']
  },
  location: {
    type: String,
    default: 'คลังหลัก'
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor'
  },
  description: {
    type: String,
    maxlength: [500, 'คำอธิบายไม่ควรเกิน 500 ตัวอักษร']
  },
  image: {
    type: String,
    default: 'default-inventory.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  },
  lastRestocked: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index สำหรับการค้นหา
InventorySchema.index({ name: 'text', code: 'text', category: 'text' });

module.exports = mongoose.model('Inventory', InventorySchema);

// src/models/Invoice.js
const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'กรุณาระบุรายการ']
  },
  quantity: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวน'],
    min: [1, 'จำนวนต้องมากกว่า 0']
  },
  unitPrice: {
    type: Number,
    required: [true, 'กรุณาระบุราคาต่อหน่วย'],
    min: [0, 'ราคาต่อหน่วยต้องไม่น้อยกว่า 0']
  },
  amount: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนเงิน']
  },
  taxable: {
    type: Boolean,
    default: true
  }
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'กรุณาระบุเลขที่ใบแจ้งหนี้'],
    unique: true
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking'
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guest',
    required: [true, 'กรุณาระบุลูกค้า']
  },
  items: [InvoiceItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'กรุณาระบุยอดรวมก่อนภาษี']
  },
  taxRate: {
    type: Number,
    default: 7
  },
  taxAmount: {
    type: Number,
    required: [true, 'กรุณาระบุจำนวนภาษี']
  },
  total: {
    type: Number,
    required: [true, 'กรุณาระบุยอดรวมทั้งสิ้น']
  },
  dueDate: {
    type: Date,
    required: [true, 'กรุณาระบุวันครบกำหนดชำระ']
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'online', 'other'],
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'หมายเหตุไม่ควรเกิน 500 ตัวอักษร']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// สร้างเลขที่ใบแจ้งหนี้อัตโนมัติ
InvoiceSchema.pre('save', async function(next) {
  if (!this.isNew || this.invoiceNumber) {
    return next();
  }
  
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // หาเลขที่ใบแจ้งหนี้ล่าสุดของเดือนนี้
  const lastInvoice = await this.constructor.findOne({
    invoiceNumber: new RegExp(`^INV${year}${month}`)
  }).sort({ invoiceNumber: -1 });
  
  let sequenceNumber = 1;
  
  if (lastInvoice) {
    // ดึงเลขลำดับล่าสุดและเพิ่มอีก 1
    const lastSequence = parseInt(lastInvoice.invoiceNumber.substring(7));
    sequenceNumber = lastSequence + 1;
  }
  
  // สร้างเลขที่ใบแจ้งหนี้
  this.invoiceNumber = `INV${year}${month}${sequenceNumber.toString().padStart(4, '0')}`;
  
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);

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