// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Alert, 
  CircularProgress, InputAdornment, Paper 
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบอีเมล
    if (!email.trim()) {
      setFormError('กรุณากรอกอีเมลของคุณ');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }
    
    setFormError('');
    setSuccessMessage('');
    
    // เรียกใช้ฟังก์ชัน forgotPassword
    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccessMessage(result.message || 'อีเมลสำหรับรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลของคุณ');
      setEmail(''); // ล้างฟอร์ม
    } else {
      setFormError(result.error || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        ลืมรหัสผ่าน
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        กรุณากรอกอีเมลของคุณเพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน
      </Typography>
      
      {/* แสดงข้อความผิดพลาด */}
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      
      {/* แสดงข้อความสำเร็จ */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {/* อีเมล */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="อีเมล"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {/* ปุ่มส่งคำขอรีเซ็ตรหัสผ่าน */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#1a237e' }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'ส่งคำขอรีเซ็ตรหัสผ่าน'
        )}
      </Button>
      
      {/* ลิงก์กลับไปหน้าล็อกอิน */}
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            กลับไปหน้าเข้าสู่ระบบ
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPassword;