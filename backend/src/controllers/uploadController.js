const { cloudinary } = require('../config/cloudinary');
const User = require('../models/User');
const Room = require('../models/Room');
const Inventory = require('../models/Inventory');

// @desc    อัปโหลดรูปภาพโปรไฟล์ผู้ใช้
// @route   POST /api/upload/profile
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาอัปโหลดไฟล์รูปภาพ'
      });
    }

    // อัปเดตรูปภาพโปรไฟล์ของผู้ใช้ในฐานข้อมูล
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    );

    // หากมีรูปภาพเดิมอยู่และไม่ใช่รูปภาพเริ่มต้น ให้ลบออกจาก Cloudinary
    if (user.profileImage && user.profileImage !== 'default-avatar.jpg' && user.profileImage !== req.file.path) {
      // ดึง public_id จาก URL ของ Cloudinary
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tontan-resort/profiles/${publicId}`);
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage
        }
      }
    });
  } catch (err) {
    console.error('อัปโหลดรูปภาพโปรไฟล์ล้มเหลว:', err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพโปรไฟล์'
    });
  }
};

// @desc    อัปโหลดรูปภาพห้องพัก
// @route   POST /api/upload/room/:id
// @access  Private (Admin & Manager)
exports.uploadRoomImage = async (req, res) => {
  try {
    // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาอัปโหลดไฟล์รูปภาพ'
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลห้องพัก'
      });
    }

    // หากมีรูปภาพเดิมอยู่และไม่ใช่รูปภาพเริ่มต้น ให้ลบออกจาก Cloudinary
    if (room.image && room.image !== 'default-room.jpg' && room.image !== req.file.path) {
      // ดึง public_id จาก URL ของ Cloudinary
      const publicId = room.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tontan-resort/rooms/${publicId}`);
    }

    // อัปเดตรูปภาพห้องพักในฐานข้อมูล
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        room: updatedRoom
      }
    });
  } catch (err) {
    console.error('อัปโหลดรูปภาพห้องพักล้มเหลว:', err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพห้องพัก'
    });
  }
};

// @desc    อัปโหลดรูปภาพสินค้า
// @route   POST /api/upload/inventory/:id
// @access  Private (Admin & Staff)
exports.uploadInventoryImage = async (req, res) => {
  try {
    // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาอัปโหลดไฟล์รูปภาพ'
      });
    }

    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลสินค้า'
      });
    }

    // หากมีรูปภาพเดิมอยู่และไม่ใช่รูปภาพเริ่มต้น ให้ลบออกจาก Cloudinary
    if (inventory.image && inventory.image !== 'default-inventory.jpg' && inventory.image !== req.file.path) {
      // ดึง public_id จาก URL ของ Cloudinary
      const publicId = inventory.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tontan-resort/inventory/${publicId}`);
    }

    // อัปเดตรูปภาพสินค้าในฐานข้อมูล
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        inventory: updatedInventory
      }
    });
  } catch (err) {
    console.error('อัปโหลดรูปภาพสินค้าล้มเหลว:', err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพสินค้า'
    });
  }
};

// @desc    ลบรูปภาพจาก Cloudinary
// @route   DELETE /api/upload/:folder/:publicId
// @access  Private (Admin)
exports.deleteImage = async (req, res) => {
  try {
    const { folder, publicId } = req.params;
    
    // ตรวจสอบว่าโฟลเดอร์ที่ระบุถูกต้องหรือไม่
    const validFolders = ['profiles', 'rooms', 'inventory'];
    if (!validFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        error: 'โฟลเดอร์ไม่ถูกต้อง'
      });
    }

    // ลบรูปภาพจาก Cloudinary
    const result = await cloudinary.uploader.destroy(`tontan-resort/${folder}/${publicId}`);

    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถลบรูปภาพได้'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('ลบรูปภาพล้มเหลว:', err);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการลบรูปภาพ'
    });
  }
};