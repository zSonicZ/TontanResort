const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// กำหนดค่า configuration ของ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// สร้าง storage engine สำหรับเก็บรูปภาพโปรไฟล์ผู้ใช้
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tontan-resort/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// สร้าง storage engine สำหรับเก็บรูปภาพห้องพัก
const roomStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tontan-resort/rooms',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// สร้าง storage engine สำหรับเก็บรูปภาพสินค้า
const inventoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tontan-resort/inventory',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

// สร้าง middleware สำหรับอัปโหลดรูปภาพโปรไฟล์
const uploadProfile = multer({ 
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // จำกัดขนาดไฟล์ไม่เกิน 2MB
});

// สร้าง middleware สำหรับอัปโหลดรูปภาพห้องพัก
const uploadRoom = multer({ 
  storage: roomStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // จำกัดขนาดไฟล์ไม่เกิน 5MB
});

// สร้าง middleware สำหรับอัปโหลดรูปภาพสินค้า
const uploadInventory = multer({ 
  storage: inventoryStorage,
  limits: { fileSize: 3 * 1024 * 1024 } // จำกัดขนาดไฟล์ไม่เกิน 3MB
});

module.exports = {
  cloudinary,
  uploadProfile,
  uploadRoom,
  uploadInventory
};