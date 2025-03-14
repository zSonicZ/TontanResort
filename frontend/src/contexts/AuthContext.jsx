// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// สร้าง Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ตั้งค่า headers สำหรับการส่งคำขอ API
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ตรวจสอบ token และโหลดข้อมูลผู้ใช้เมื่อเริ่มแอปพลิเคชัน
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // ตรวจสอบว่า token หมดอายุหรือไม่
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token หมดอายุ
            logout();
          } else {
            // ดึงข้อมูลผู้ใช้จาก API
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
            setUser(response.data.data);
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ฟังก์ชันล็อกอิน
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { 
        username, 
        password 
      });
      
      const { token: newToken, user: userData } = response.data;
      
      // เก็บ token ลงใน localStorage
      localStorage.setItem('token', newToken);
      
      // ตั้งค่า state
      setToken(newToken);
      setUser(userData);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      return { success: false, error: err.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  };

  // ฟังก์ชันล็อกเอาท์
  const logout = () => {
    // ล้าง localStorage
    localStorage.removeItem('token');
    
    // รีเซ็ต state
    setToken(null);
    setUser(null);
    setError(null);
  };

  // ฟังก์ชันเปลี่ยนรหัสผ่าน
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/auth/changepassword`, {
        currentPassword,
        newPassword
      });
      
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        error: err.response?.data?.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' 
      };
    }
  };

  // ฟังก์ชันส่งอีเมลรีเซ็ตรหัสผ่าน
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgotpassword`, {
        email
      });
      
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        error: err.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน' 
      };
    }
  };

  // ฟังก์ชันรีเซ็ตรหัสผ่าน
  const resetPassword = async (resetToken, password) => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/resetpassword/${resetToken}`,
        { password }
      );
      
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        error: err.response?.data?.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' 
      };
    }
  };

  // ส่งค่า Context
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;