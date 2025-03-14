// src/services/dashboardService.js
import { api } from './authService';

const DashboardService = {
  // ดึงข้อมูลแดชบอร์ดทั้งหมด
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแดชบอร์ด' };
    }
  },

  // ดึงข้อมูลอัตราการเข้าพัก
  getOccupancyData: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/occupancy?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลอัตราการเข้าพัก' };
    }
  },

  // ดึงข้อมูลรายได้
  getRevenueData: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายได้' };
    }
  },

  // ดึงข้อมูลสถานะห้องพัก
  getRoomStatusData: async () => {
    try {
      const response = await api.get('/dashboard/room-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถานะห้องพัก' };
    }
  },

  // ดึงข้อมูลการจองที่กำลังจะเข้าพัก
  getUpcomingBookings: async (days = 7) => {
    try {
      const response = await api.get(`/dashboard/upcoming-bookings?days=${days}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่กำลังจะเข้าพัก' };
    }
  },

  // ดึงข้อมูลการจองที่กำลังจะเช็คเอาท์
  getUpcomingCheckouts: async (days = 3) => {
    try {
      const response = await api.get(`/dashboard/upcoming-checkouts?days=${days}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่กำลังจะเช็คเอาท์' };
    }
  },

  // ดึงข้อมูลงานที่ต้องทำ
  getTasks: async () => {
    try {
      const response = await api.get('/dashboard/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงานที่ต้องทำ' };
    }
  },

  // ดึงข้อมูลสินค้าที่ใกล้หมด
  getLowStockItems: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/low-stock?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ใกล้หมด' };
    }
  },

  // ดึงข้อมูลการแจ้งเตือน
  getNotifications: async () => {
    try {
      const response = await api.get('/dashboard/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน' };
    }
  },

  // อ่านการแจ้งเตือน
  markNotificationAsRead: async (id) => {
    try {
      const response = await api.put(`/dashboard/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอ่านการแจ้งเตือน' };
    }
  }
};

export default DashboardService;