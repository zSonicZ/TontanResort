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