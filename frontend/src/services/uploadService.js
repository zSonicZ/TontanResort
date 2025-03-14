// src/services/uploadService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// อัปโหลดรูปภาพโปรไฟล์
const uploadProfileImage = async (file) => {
  try {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_URL}/api/upload/profile`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์' 
    };
  }
};

// อัปโหลดรูปภาพห้องพัก
const uploadRoomImage = async (roomId, file) => {
  try {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_URL}/api/upload/room/${roomId}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปห้องพัก' 
    };
  }
};

// อัปโหลดรูปภาพสินค้า
const uploadInventoryImage = async (inventoryId, file) => {
  try {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_URL}/api/upload/inventory/${inventoryId}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปสินค้า' 
    };
  }
};

// ลบรูปภาพ
const deleteImage = async (folder, publicId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      `${API_URL}/api/upload/${folder}/${publicId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบรูปภาพ' 
    };
  }
};

// ดึง public_id จาก URL ของ Cloudinary
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  // URL มีรูปแบบ: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
  // แยกนามสกุลไฟล์ออก
  return filename.split('.')[0];
};

export default {
  uploadProfileImage,
  uploadRoomImage,
  uploadInventoryImage,
  deleteImage,
  getPublicIdFromUrl
};