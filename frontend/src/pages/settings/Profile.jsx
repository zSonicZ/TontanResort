// src/pages/settings/Profile.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, TextField, Button, 
  Divider, CircularProgress, Alert, Avatar, 
  Card, CardContent, CardActions 
} from '@mui/material';
import { Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import ImageUploader from '../../components/ui/ImageUploader';
import uploadService from '../../services/uploadService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
      });
      
      setProfileImage(user.profileImage || '');
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // ในแอปพลิเคชันจริง จะต้องเรียกใช้ API เพื่ออัปเดตข้อมูลผู้ใช้
      // const response = await axios.put(`${API_URL}/api/users/profile`, formData);
      
      // จำลองการส่งข้อมูลสำเร็จ
      setTimeout(() => {
        setSuccess('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      setLoading(false);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูล
    if (!formData.currentPassword) {
      setPasswordError('กรุณากรอกรหัสผ่านปัจจุบัน');
      return;
    }
    
    if (!formData.newPassword) {
      setPasswordError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordLoading(true);
    
    try {
      // ในแอปพลิเคชันจริง จะต้องเรียกใช้ API เพื่อเปลี่ยนรหัสผ่าน
      // const response = await authService.changePassword(formData.currentPassword, formData.newPassword);
      
      // จำลองการส่งข้อมูลสำเร็จ
      setTimeout(() => {
        setPasswordSuccess('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setPasswordLoading(false);
        
        // ล้างข้อมูลรหัสผ่าน
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      setPasswordLoading(false);
    }
  };
  
  const handleUploadSuccess = (data) => {
    if (data && data.user && data.user.profileImage) {
      setProfileImage(data.user.profileImage);
      toast.success('อัปโหลดรูปโปรไฟล์สำเร็จ');
    }
  };
  
  const handleUploadError = (error) => {
    toast.error(error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์');
  };
  
  if (authLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        ตั้งค่าโปรไฟล์
      </Typography>
      
      <Grid container spacing={3}>
        {/* ส่วนข้อมูลโปรไฟล์ */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={profileImage || ''}
                alt={formData.name}
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  border: '4px solid #3f51b5'
                }}
              >
                {!profileImage && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {formData.name || 'ชื่อผู้ใช้'}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {formData.email || 'อีเมล'}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                 user?.role === 'manager' ? 'ผู้จัดการ' : 
                 user?.role === 'staff' ? 'พนักงาน' : 'ผู้ใช้งาน'}
              </Typography>
            </CardContent>
            <CardActions>
              <ImageUploader 
                endpoint="/api/upload/profile"
                defaultImage={profileImage}
                title="อัปโหลดรูปโปรไฟล์"
                description="คลิกหรือลากรูปภาพที่ต้องการอัปโหลด"
                maxSize={2}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </CardActions>
          </Card>
        </Grid>
        
        {/* ส่วนแก้ไขข้อมูลโปรไฟล์ */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลส่วนตัว
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
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
            
            <Box component="form" onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ชื่อ-นามสกุล"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="อีเมล"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ชื่อผู้ใช้งาน"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="เบอร์โทรศัพท์"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'บันทึกข้อมูล'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              เปลี่ยนรหัสผ่าน
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleChangePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="รหัสผ่านปัจจุบัน"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="รหัสผ่านใหม่"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    helperText="รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ยืนยันรหัสผ่านใหม่"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? <CircularProgress size={24} /> : 'เปลี่ยนรหัสผ่าน'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;