// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// สร้าง instance ของ axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// เพิ่ม interceptor สำหรับเพิ่ม token ในทุกคำขอ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// เพิ่ม interceptor สำหรับจัดการข้อผิดพลาด
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // หาก token หมดอายุ ให้ออกจากระบบ
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  // เข้าสู่ระบบ
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  },

  // ออกจากระบบ
  logout: () => {
    localStorage.removeItem('token');
  },

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' };
    }
  },

  // ลืมรหัสผ่าน
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgotpassword', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน' };
    }
  },

  // รีเซ็ตรหัสผ่าน
  resetPassword: async (token, password) => {
    try {
      const response = await api.put(`/auth/resetpassword/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' };
    }
  },

  // เปลี่ยนรหัสผ่าน
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/changepassword', { 
        currentPassword, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' };
    }
  },

  // ตรวจสอบว่ามีการเข้าสู่ระบบหรือไม่
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
export { api };