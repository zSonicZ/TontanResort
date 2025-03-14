// src/services/roomService.js
import { api } from './authService';

const RoomService = {
  // ดึงรายการห้องพักทั้งหมด
  getRooms: async (filters = {}) => {
    try {
      // สร้าง query params จาก filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/rooms?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้องพัก' };
    }
  },

  // ดึงข้อมูลห้องพักตาม ID
  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้องพัก' };
    }
  },

  // สร้างห้องพักใหม่
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างห้องพัก' };
    }
  },

  // อัปเดตข้อมูลห้องพัก
  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลห้องพัก' };
    }
  },

  // ลบห้องพัก
  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการลบห้องพัก' };
    }
  },

  // เปลี่ยนสถานะห้องพัก
  changeRoomStatus: async (id, status) => {
    try {
      const response = await api.patch(`/rooms/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะห้องพัก' };
    }
  },

  // เปลี่ยนสถานะความสะอาดของห้องพัก
  changeCleaningStatus: async (id, cleaningStatus) => {
    try {
      const response = await api.patch(`/rooms/${id}/cleaning-status`, { cleaningStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะความสะอาด' };
    }
  },

  // ดึงข้อมูลประเภทห้องพัก
  getRoomTypes: async () => {
    try {
      const response = await api.get('/room-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทห้องพัก' };
    }
  },

  // ดึงรายงานสถานะห้องพัก
  getRoomReports: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/rooms/reports?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงรายงานห้องพัก' };
    }
  }
};

export default RoomService;