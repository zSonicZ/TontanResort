// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // แสดง Loader ระหว่างที่ยังโหลดข้อมูลผู้ใช้
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // ตรวจสอบว่าผู้ใช้ได้ล็อกอินหรือไม่
  if (!isAuthenticated) {
    // ถ้ายังไม่ได้ล็อกอิน, เก็บ URL ปัจจุบันแล้วเปลี่ยนเส้นทางไปยังหน้าล็อกอิน
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // ตรวจสอบสิทธิ์ role ถ้ามีการระบุ
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role);
    
    if (!hasRequiredRole) {
      // ถ้าไม่มีสิทธิ์ที่เหมาะสม ส่งกลับไปยังหน้าหลัก
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ถ้าผ่านการตรวจสอบทั้งหมด ให้แสดงเนื้อหา
  return children;
};

export default ProtectedRoute;