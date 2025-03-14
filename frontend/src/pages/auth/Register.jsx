// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Alert, 
  CircularProgress, Paper, Grid, InputAdornment, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Badge as BadgeIcon,
  WorkOutline as WorkOutlineIcon
} from '@mui/icons-material';
import { AuthService } from '../../services';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    department: 'front_desk'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validateForm = () => {
    // ตรวจสอบชื่อ
    if (!formData.name.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล');
      return false;
    }
    
    // ตรวจสอบอีเมล
    if (!formData.email.trim()) {
      setError('กรุณากรอกอีเมล');
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }
    
    // ตรวจสอบชื่อผู้ใช้
    if (!formData.username.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้');
      return false;
    }
    
    // ตรวจสอบรหัสผ่าน
    if (!formData.password) {
      setError('กรุณากรอกรหัสผ่าน');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return false;
    }
    
    // ตรวจสอบยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await AuthService.register(formData);
      
      setSuccess('ลงทะเบียนเรียบร้อยแล้ว! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...');
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'staff',
        department: 'front_desk'
      });
      
      // รอสักครู่ก่อนที่จะนำผู้ใช้ไปยังหน้าล็อกอิน
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err.error || 'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      noValidate 
      sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}
    >
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        สมัครสมาชิก
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        กรุณากรอกข้อมูลเพื่อสมัครสมาชิกใหม่
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="ชื่อ-นามสกุล"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="email"
            label="อีเมล"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="username"
            label="ชื่อผู้ใช้"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password"
            label="รหัสผ่าน"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
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
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
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
                    onClick={handleToggleConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="role-label">บทบาท</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="บทบาท"
              onChange={handleChange}
              disabled={loading}
              startAdornment={
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="staff">พนักงาน</MenuItem>
              <MenuItem value="manager">ผู้จัดการ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="department-label">แผนก</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={formData.department}
              label="แผนก"
              onChange={handleChange}
              disabled={loading}
              startAdornment={
                <InputAdornment position="start">
                  <WorkOutlineIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="front_desk">แผนกต้อนรับ</MenuItem>
              <MenuItem value="housekeeping">แผนกแม่บ้าน</MenuItem>
              <MenuItem value="restaurant">แผนกร้านอาหาร</MenuItem>
              <MenuItem value="maintenance">แผนกซ่อมบำรุง</MenuItem>
              <MenuItem value="accounting">แผนกบัญชี</MenuItem>
              <MenuItem value="warehouse">แผนกคลังสินค้า</MenuItem>
              <MenuItem value="management">แผนกบริหาร</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
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
          'สมัครสมาชิก'
        )}
      </Button>
      
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/auth/login" style={{ textDecoration: 'none', color: '#1a237e' }}>
            เข้าสู่ระบบ
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;