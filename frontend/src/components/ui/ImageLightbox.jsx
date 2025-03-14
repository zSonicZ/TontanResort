// src/components/ui/ImageLightbox.jsx
import React from 'react';
import { 
  Dialog, 
  IconButton, 
  Box, 
  CircularProgress, 
  Zoom 
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';

const ImageLightbox = ({ 
  open, 
  onClose, 
  src, 
  alt = 'Image',
  backgroundColor = 'rgba(0, 0, 0, 0.9)'
}) => {
  const [loading, setLoading] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  
  // รีเซ็ต state เมื่อเปิด/ปิด modal
  React.useEffect(() => {
    if (open) {
      setLoading(true);
      setZoom(1);
    }
  }, [open]);
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  const handleZoomIn = (e) => {
    e.stopPropagation();
    if (zoom < 3) {
      setZoom(zoom + 0.5);
    }
  };
  
  const handleZoomOut = (e) => {
    e.stopPropagation();
    if (zoom > 0.5) {
      setZoom(zoom - 0.5);
    }
  };
  
  // ตรวจสอบว่าเป็น URL ของ Cloudinary หรือไม่
  const isCloudinaryUrl = src && src.includes('cloudinary.com');
  
  // ปรับแต่งรูปภาพจาก Cloudinary ให้มีคุณภาพสูงขึ้น
  const getHighQualityImage = () => {
    if (!isCloudinaryUrl) {
      return src;
    }
    
    // แยกส่วนของ URL
    const parts = src.split('/upload/');
    
    if (parts.length < 2) {
      return src;
    }
    
    // สร้าง URL ใหม่ที่มีคุณภาพสูง
    return `${parts[0]}/upload/q_100/${parts[1]}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          bgcolor: backgroundColor,
          boxShadow: 'none',
          position: 'relative',
          m: 0,
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center',
        }
      }}
      onClick={onClose}
    >
      {/* ปุ่มปิด */}
      <IconButton
        color="error"
        size="large"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.8)'
          }
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      
      {/* ปุ่มซูม */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          color="primary"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOutIcon />
        </IconButton>
        
        <IconButton
          color="primary"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
          onClick={handleZoomIn}
          disabled={zoom >= 3}
        >
          <ZoomInIcon />
        </IconButton>
      </Box>
      
      {/* แสดง Loading */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      
      {/* รูปภาพ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getHighQualityImage()}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease',
            cursor: 'grab'
          }}
          onLoad={handleImageLoad}
        />
      </Box>
    </Dialog>
  );
};

export default ImageLightbox;