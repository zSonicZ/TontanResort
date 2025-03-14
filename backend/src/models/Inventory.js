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