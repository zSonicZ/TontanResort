// src/services/guestService.js
import { api } from './authService';

const GuestService = {
  // ดึงรายการลูกค้าทั้งหมด
  getGuests: async (filters = {}) => {
    try {
      // สร้าง query params จาก filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/guests?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า' };
    }
  },

  // ดึงข้อมูลลูกค้าตาม ID
  getGuestById: async (id) => {
    try {
      const response = await api.get(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า' };
    }
  },

  // ค้นหาลูกค้า
  searchGuests: async (query) => {
    try {
      const response = await api.get(`/guests/search?query=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการค้นหาลูกค้า' };
    }
  },

  // สร้างลูกค้าใหม่
  createGuest: async (guestData) => {
    try {
      const response = await api.post('/guests', guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างข้อมูลลูกค้า' };
    }
  },

  // อัปเดตข้อมูลลูกค้า
  updateGuest: async (id, guestData) => {
    try {
      const response = await api.put(`/guests/${id}`, guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลลูกค้า' };
    }
  },

  // ลบลูกค้า
  deleteGuest: async (id) => {
    try {
      const response = await api.delete(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า' };
    }
  },

  // ดึงประวัติการเข้าพัก
  getGuestStayHistory: async (id) => {
    try {
      const response = await api.get(`/guests/${id}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงประวัติการเข้าพัก' };
    }
  },

  // ดึงข้อมูลการใช้จ่าย
  getGuestExpenses: async (id) => {
    try {
      const response = await api.get(`/guests/${id}/expenses`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการใช้จ่าย' };
    }
  },

  // อัปโหลดเอกสารลูกค้า
  uploadGuestDocument: async (id, documentType, file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await api.post(`/guests/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร' };
    }
  }
};

export default GuestService;