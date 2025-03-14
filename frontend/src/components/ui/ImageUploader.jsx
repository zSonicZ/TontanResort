// src/components/ui/ImageUploader.jsx
import React, { useState, useRef } from 'react';
import { 
  Box, Button, CircularProgress, Typography, 
  Paper, IconButton, Tooltip 
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import axios from 'axios';

const ImageUploader = ({ 
  endpoint, 
  onUploadSuccess, 
  onUploadError, 
  defaultImage = null,
  title = 'อัปโหลดรูปภาพ', 
  description = 'คลิกหรือลากไฟล์รูปภาพมาที่นี่', 
  acceptTypes = 'image/jpeg, image/png',
  maxSize = 2 // in MB
}) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(defaultImage);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) {
      setDragging(true);
    }
  };

  const validateFile = (file) => {
    // ตรวจสอบประเภทไฟล์
    const validTypes = acceptTypes.split(',').map(type => type.trim());
    if (!validTypes.includes(file.type)) {
      setError(`ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ ${acceptTypes}`);
      return false;
    }

    // ตรวจสอบขนาดไฟล์
    const fileSize = file.size / 1024 / 1024; // แปลงเป็น MB
    if (fileSize > maxSize) {
      setError(`ขนาดไฟล์เกิน ${maxSize} MB กรุณาอัปโหลดไฟล์ที่มีขนาดเล็กกว่า`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (!validateFile(file)) {
      return;
    }

    // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // สร้าง FormData สำหรับส่งไฟล์
    const formData = new FormData();
    formData.append('image', file);

    uploadFile(formData, objectUrl);
  };

  const uploadFile = async (formData, previewUrl) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setLoading(false);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.data);
      }
    } catch (err) {
      setLoading(false);
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(defaultImage);
      
      const errorMsg = err.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์';
      setError(errorMsg);
      
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      
      {!previewUrl ? (
        <Paper
          variant="outlined"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            border: dragging ? '2px dashed #3f51b5' : '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: dragging ? 'rgba(63, 81, 181, 0.05)' : 'transparent',
            transition: 'all 0.3s',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => fileInputRef.current.click()}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: '#3f51b5', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                สนับสนุนไฟล์: {acceptTypes}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ขนาดสูงสุด: {maxSize} MB
              </Typography>
              <input
                type="file"
                accept={acceptTypes}
                onChange={handleFileInput}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </>
          )}
        </Paper>
      ) : (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            margin: '0 auto'
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              borderRadius: 8,
              display: 'block'
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1
            }}
          >
            <Tooltip title="เปลี่ยนรูปภาพ">
              <IconButton
                size="small"
                color="primary"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="ลบรูปภาพ">
              <IconButton
                size="small"
                color="error"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                onClick={handleRemoveImage}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 2
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileInput}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;