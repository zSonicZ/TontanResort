// src/components/ui/CloudinaryImage.jsx
import React, { useState } from 'react';
import { Skeleton, Box } from '@mui/material';

const CloudinaryImage = ({ 
  src, 
  alt = 'Image', 
  width = 'auto', 
  height = 'auto', 
  borderRadius = 0,
  quality = 'auto',
  crop = 'fill',
  lazy = true,
  placeholder = true,
  onClick = null
}) => {
  const [loaded, setLoaded] = useState(false);
  
  // ไม่แสดงรูปภาพถ้าไม่มี src
  if (!src) {
    return null;
  }
  
  // ตรวจสอบว่าเป็น URL ของ Cloudinary หรือไม่
  const isCloudinaryUrl = src.includes('cloudinary.com');
  
  // ปรับแต่งรูปภาพจาก Cloudinary
  const transformImage = () => {
    if (!isCloudinaryUrl) {
      return src;
    }
    
    // แยกส่วนของ URL
    const parts = src.split('/upload/');
    
    if (parts.length < 2) {
      return src;
    }
    
    // สร้าง transformation parameters
    const transformations = `q_${quality},c_${crop}`;
    
    // สร้าง URL ใหม่
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  };
  
  // URL ที่ถูกปรับแต่งแล้ว
  const imageUrl = transformImage();
  
  // Handler เมื่อโหลดรูปภาพเสร็จ
  const handleImageLoad = () => {
    setLoaded(true);
  };
  
  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: width, 
        height: height,
        overflow: 'hidden',
        borderRadius: borderRadius,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {placeholder && !loaded && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave" 
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      
      <img
        src={imageUrl}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleImageLoad}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loaded ? 'block' : 'block',
          visibility: loaded ? 'visible' : 'hidden',
          borderRadius: borderRadius
        }}
      />
    </Box>
  );
};

export default CloudinaryImage;