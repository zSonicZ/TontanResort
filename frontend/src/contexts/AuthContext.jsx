// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services';
import { toast } from 'react-toastify';

// สร้าง Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // เช็คว่ามี token หรือไม่
    if (AuthService.isAuthenticated()) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // ฟังก์ชันโหลดข้อมูลผู้ใช้
  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Error loading user data:', err);
      setUser(null);
      setIsAuthenticated(false);
      // หาก token ไม่ถูกต้องหรือหมดอายุ ให้ล้าง token ออก
      AuthService.logout();
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.register(userData);
      toast.success('ลงทะเบียนสำเร็จแล้ว กรุณาเข้าสู่ระบบ');
      
      return { 
        success: true, 
        message: response.message || 'ลงทะเบียนสำเร็จแล้ว กรุณาเข้าสู่ระบบ' 
      };
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      toast.error(err.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      
      return { 
        success: false, 
        error: err.error || 'เกิดข้อผิดพลาดในการลงทะเบียน' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเข้าสู่ระบบ
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(username, password);
      
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('เข้าสู่ระบบสำเร็จ');
        return { success: true };
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      toast.error(err.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      return { 
        success: false, 
        error: err.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    toast.info('ออกจากระบบแล้ว');
  };

  // ฟังก์ชันลืมรหัสผ่าน
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.forgotPassword(email);
      toast.success(response.message || 'ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว');
      
      return { 
        success: true, 
        message: response.message 
      };
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
      toast.error(err.error || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
      
      return { 
        success: false, 
        error: err.error || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันรีเซ็ตรหัสผ่าน
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.resetPassword(token, password);
      toast.success(response.message || 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว');
      
      return { 
        success: true, 
        message: response.message 
      };
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      toast.error(err.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      
      return { 
        success: false, 
        error: err.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปลี่ยนรหัสผ่าน
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.changePassword(currentPassword, newPassword);
      toast.success(response.message || 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
      
      return { 
        success: true, 
        message: response.message 
      };
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      toast.error(err.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      
      return { 
        success: false, 
        error: err.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' 
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;