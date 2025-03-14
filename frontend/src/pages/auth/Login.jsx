// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Box, Button, TextField, FormControlLabel, Checkbox, 
  Typography, Alert, CircularProgress, InputAdornment, IconButton 
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  
  // ถ้ามีการเปลี่ยนเส้นทางมาจากเส้นทางอื่น ให้กลับไปยังเส้นทางนั้นหลังจากล็อกอิน
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลฟอร์ม
    if (!username.trim()) {
      setFormError('กรุณากรอกชื่อผู้ใช้หรืออีเมล');
      return;
    }
    
    if (!password) {
      setFormError('กรุณากรอกรหัสผ่าน');
      return;
    }
    
    setFormError('');
    
    // เรียกใช้ฟังก์ชันล็อกอิน
    const result = await login(username, password);
    
    if (result.success) {
      // ล็อกอินสำเร็จ นำผู้ใช้ไปยังหน้าที่ต้องการ
      navigate(from, { replace: true });
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        เข้าสู่ระบบ
      </Typography>
      
      {/* แสดงข้อความผิดพลาด */}
      {(formError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || error}
        </Alert>
      )}
      
      {/* ชื่อผู้ใช้หรืออีเมล */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="ชื่อผู้ใช้หรืออีเมล"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {/* รหัสผ่าน */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="รหัสผ่าน"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
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
      
      {/* จดจำการเข้าสู่ระบบ */}
      <FormControlLabel
        control={
          <Checkbox 
            value="remember" 
            color="primary" 
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
        }
        label="จดจำการเข้าสู่ระบบ"
      />
      
      {/* ปุ่มเข้าสู่ระบบ */}
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
          'เข้าสู่ระบบ'
        )}
      </Button>
      
      {/* ลิงก์ลืมรหัสผ่าน */}
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Link to="/auth/forgot-password" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            ลืมรหัสผ่าน?
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Login;