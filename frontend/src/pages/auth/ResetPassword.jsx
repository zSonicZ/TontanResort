// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Alert, 
  CircularProgress, InputAdornment, IconButton 
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบรหัสผ่าน
    if (!password) {
      setFormError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }
    
    if (password.length < 6) {
      setFormError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    
    setFormError('');
    setSuccessMessage('');
    
    // เรียกใช้ฟังก์ชัน resetPassword
    const result = await resetPassword(token, password);
    
    if (result.success) {
      setSuccessMessage(result.message || 'รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว');
      // รอสักครู่ก่อนที่จะนำผู้ใช้ไปยังหน้าล็อกอิน
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } else {
      setFormError(result.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        รีเซ็ตรหัสผ่าน
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        กรุณากรอกรหัสผ่านใหม่ของคุณ
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
      
      {/* รหัสผ่านใหม่ */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="รหัสผ่านใหม่"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {/* ยืนยันรหัสผ่านใหม่ */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="ยืนยันรหัสผ่านใหม่"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleToggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {/* ปุ่มรีเซ็ตรหัสผ่าน */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#1a237e' }}
        disabled={loading || successMessage !== ''}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'รีเซ็ตรหัสผ่าน'
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

export default ResetPassword;