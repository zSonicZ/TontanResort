// src/components/rooms/RoomGallery.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Card,
  CardMedia,
  CardActionArea,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoLibrary as GalleryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import ImageUploader from '../ui/ImageUploader';
import CloudinaryImage from '../ui/CloudinaryImage';
import ImageLightbox from '../ui/ImageLightbox';
import { useAuth } from '../../hooks/useAuth';
import uploadService from '../../services/uploadService';
import { toast } from 'react-toastify';

const RoomGallery = ({ 
  roomId, 
  images = [], 
  mainImage = null, 
  onImageUpload = null, 
  onImageDelete = null 
}) => {
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  // ตรวจสอบสิทธิ์ในการจัดการรูปภาพ
  const canManageImages = user && (user.role === 'admin' || user.role === 'manager');
  
  // เรียงรูปภาพให้รูปหลักอยู่ข้างหน้า
  const sortedImages = [
    ...(mainImage ? [mainImage] : []), 
    ...images.filter(img => img !== mainImage)
  ];
  
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };
  
  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };
  
  const handleUploadSuccess = (data) => {
    toast.success('อัปโหลดรูปภาพสำเร็จ');
    setShowUploader(false);
    
    if (onImageUpload) {
      onImageUpload(data);
    }
  };
  
  const handleUploadError = (error) => {
    toast.error(error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
  };
  
  const handleDeleteImage = async (image) => {
    if (!window.confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) {
      return;
    }
    
    try {
      const publicId = uploadService.getPublicIdFromUrl(image);
      
      if (!publicId) {
        toast.error('ไม่สามารถระบุรูปภาพที่ต้องการลบได้');
        return;
      }
      
      const result = await uploadService.deleteImage('rooms', publicId);
      
      if (result.success) {
        toast.success('ลบรูปภาพสำเร็จ');
        
        if (onImageDelete) {
          onImageDelete(image);
        }
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการลบรูปภาพ');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลบรูปภาพ');
      console.error('Delete image error:', error);
    }
  };
  
  // แสดงข้อความว่าไม่มีรูปภาพ
  if (sortedImages.length === 0 && !showUploader) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          รูปภาพห้องพัก
        </Typography>
        
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <GalleryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            ยังไม่มีรูปภาพห้องพัก
          </Typography>
          
          {canManageImages && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowUploader(true)}
              sx={{ mt: 2 }}
            >
              เพิ่มรูปภาพ
            </Button>
          )}
        </Paper>
      </Box>
    );
  }
  
  // แสดงหน้าอัปโหลดรูปภาพ
  if (showUploader) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            อัปโหลดรูปภาพห้องพัก
          </Typography>
          
          <Button
            variant="outlined"
            onClick={() => setShowUploader(false)}
          >
            ยกเลิก
          </Button>
        </Box>
        
        <Paper sx={{ p: 3 }}>
          <ImageUploader
            endpoint={`/api/upload/room/${roomId}`}
            title="อัปโหลดรูปภาพห้องพัก"
            description="คลิกหรือลากไฟล์รูปภาพมาที่นี่"
            maxSize={5}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </Paper>
      </Box>
    );
  }
  
  // แสดงแกลเลอรี่รูปภาพ
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          รูปภาพห้องพัก
        </Typography>
        
        {canManageImages && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setShowUploader(true)}
          >
            เพิ่มรูปภาพ
          </Button>
        )}
      </Box>
      
      <Grid container spacing={2}>
        {sortedImages.map((image, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card 
              variant="outlined"
              sx={{ 
                position: 'relative',
                height: 200,
                '&:hover .action-buttons': {
                  opacity: 1
                }
              }}
            >
              <CardActionArea onClick={() => handleImageClick(image)}>
                <CloudinaryImage
                  src={image}
                  alt={`Room image ${index + 1}`}
                  width="100%"
                  height="200px"
                  borderRadius={1}
                  crop="fill"
                  quality="auto:good"
                />
              </CardActionArea>
              
              {/* ปุ่มจัดการรูปภาพ */}
              {canManageImages && (
                <Box 
                  className="action-buttons"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 1,
                    p: 0.5
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="ลบรูปภาพ">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteImage(image)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              
              {/* แสดงป้ายบอกว่าเป็นรูปหลัก */}
              {mainImage === image && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    fontSize: '0.75rem',
                    textAlign: 'center'
                  }}
                >
                  รูปภาพหลัก
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Lightbox สำหรับดูรูปภาพขนาดใหญ่ */}
      <ImageLightbox
        open={showLightbox}
        onClose={handleCloseLightbox}
        src={selectedImage}
        alt="Room image"
      />
    </Box>
  );
};

export default RoomGallery;