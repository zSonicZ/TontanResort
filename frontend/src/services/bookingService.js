// src/services/bookingService.js
import { api } from './authService';

const BookingService = {
  // ดึงรายการการจองทั้งหมด
  getBookings: async (filters = {}) => {
    try {
      // สร้าง query params จาก filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/bookings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' };
    }
  },

  // ดึงข้อมูลการจองตาม ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' };
    }
  },

  // สร้างการจองใหม่
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างการจอง' };
    }
  },

  // อัปเดตข้อมูลการจอง
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจอง' };
    }
  },

  // ลบการจอง
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการลบการจอง' };
    }
  },

  // เปลี่ยนสถานะการจอง
  changeBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะการจอง' };
    }
  },

  // เช็คอิน
  checkIn: async (id, checkInData) => {
    try {
      const response = await api.post(`/bookings/${id}/check-in`, checkInData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเช็คอิน' };
    }
  },

  // เช็คเอาท์
  checkOut: async (id, checkOutData) => {
    try {
      const response = await api.post(`/bookings/${id}/check-out`, checkOutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเช็คเอาท์' };
    }
  },

  // ค้นหาห้องว่างสำหรับการจอง
  searchAvailableRooms: async (searchParams) => {
    try {
      const response = await api.get('/bookings/available-rooms', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการค้นหาห้องว่าง' };
    }
  },

  // ดึงข้อมูลสรุปการจอง (สำหรับแดชบอร์ด)
  getBookingSummary: async (timeFrame = 'day') => {
    try {
      const response = await api.get(`/bookings/summary?timeFrame=${timeFrame}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุปการจอง' };
    }
  }
};

export default BookingService;