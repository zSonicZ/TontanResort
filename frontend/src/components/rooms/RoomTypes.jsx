// src/components/rooms/RoomTypes.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  IconButton, 
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import CloudinaryImage from '../ui/CloudinaryImage';
import ImageUploader from '../ui/ImageUploader';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// Mock data สำหรับประเภทห้องพัก
const defaultRoomTypes = [
  {
    id: '1',
    name: 'Deluxe',
    description: 'ห้องดีลักซ์ ขนาด 30 ตร.ม. พร้อมเตียงคิงไซส์',
    price: 2500,
    capacity: 2,
    size: 30,
    bedType: 'เตียงคิงไซส์ 1 เตียง',
    amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์'],
    image: '/api/placeholder/800/500',
    roomCount: 12,
    availableCount: 5
  },
  {
    id: '2',
    name: 'Superior',
    description: 'ห้องซูพีเรีย ขนาด 40 ตร.ม. พร้อมวิวสวน',
    price: 3500,
    capacity: 2,
    size: 40,
    bedType: 'เตียงควีนไซส์ 1 เตียง',
    amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ'],
    image: '/api/placeholder/800/500',
    roomCount: 8,
    availableCount: 2
  },
  {
    id: '3',
    name: 'Suite',
    description: 'ห้องสวีท ขนาด 55 ตร.ม. พร้อมห้องนั่งเล่นแยก',
    price: 5000,
    capacity: 3,
    size: 55,
    bedType: 'เตียงคิงไซส์ 1 เตียง และโซฟาเบด 1 ตัว',
    amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ', 'มินิบาร์'],
    image: '/api/placeholder/800/500',
    roomCount: 6,
    availableCount: 3
  },
  {
    id: '4',
    name: 'Family',
    description: 'ห้องแฟมิลี่ ขนาด 65 ตร.ม. เหมาะสำหรับครอบครัว',
    price: 6500,
    capacity: 4,
    size: 65,
    bedType: 'เตียงคิงไซส์ 1 เตียง และเตียงเดี่ยว 2 เตียง',
    amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ', 'มินิบาร์', 'อ่างอาบน้ำ'],
    image: '/api/placeholder/800/500',
    roomCount: 4,
    availableCount: 1
  }
];

// รายการสิ่งอำนวยความสะดวกที่มีให้เลือก
const allAmenities = [
  'เครื่องปรับอากาศ',
  'Wi-Fi',
  'ตู้เย็น',
  'เครื่องทำน้ำอุ่น',
  'โทรทัศน์',
  'ตู้เซฟ',
  'มินิบาร์',
  'อ่างอาบน้ำ',
  'ระเบียง/วิวสวน',
  'เครื่องชงกาแฟ',
  'ไมโครเวฟ',
  'ห้องนั่งเล่นแยก',
  'เครื่องเป่าผม',
  'เตารีด'
];

const RoomTypes = () => {
  const { user } = useAuth();
  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    size: '',
    bedType: '',
    amenities: []
  });
  
  // ตรวจสอบสิทธิ์ในการจัดการประเภทห้องพัก
  const canManageRoomTypes = user && (user.role === 'admin' || user.role === 'manager');
  
  const handleOpenModal = (roomType = null) => {
    if (roomType) {
      setSelectedType(roomType);
      setFormData({
        name: roomType.name,
        description: roomType.description,
        price: roomType.price,
        capacity: roomType.capacity,
        size: roomType.size,
        bedType: roomType.bedType,
        amenities: roomType.amenities
      });
    } else {
      setSelectedType(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        capacity: '',
        size: '',
        bedType: '',
        amenities: []
      });
    }
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedType(null);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAmenityChange = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };
  
  const handleSubmit = () => {
    // ตรวจสอบข้อมูลในฟอร์ม
    if (!formData.name || !formData.price || !formData.capacity) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }
    
    if (selectedType) {
      // อัปเดตประเภทห้องพักที่มีอยู่แล้ว
      const updatedRoomTypes = roomTypes.map(type => {
        if (type.id === selectedType.id) {
          return {
            ...type,
            ...formData,
            price: Number(formData.price),
            capacity: Number(formData.capacity),
            size: Number(formData.size) || type.size
          };
        }
        return type;
      });
      
      setRoomTypes(updatedRoomTypes);
      toast.success('อัปเดตประเภทห้องพักเรียบร้อยแล้ว');
    } else {
      // เพิ่มประเภทห้องพักใหม่
      const newRoomType = {
        id: `${roomTypes.length + 1}`,
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        size: Number(formData.size) || 0,
        image: '/api/placeholder/800/500',
        roomCount: 0,
        availableCount: 0
      };
      
      setRoomTypes([...roomTypes, newRoomType]);
      toast.success('เพิ่มประเภทห้องพักเรียบร้อยแล้ว');
    }
    
    handleCloseModal();
  };
  
  const handleUploadSuccess = (roomTypeId, data) => {
    if (data && data.url) {
      // อัปเดตรูปภาพของประเภทห้องพัก
      const updatedRoomTypes = roomTypes.map(type => {
        if (type.id === roomTypeId) {
          return {
            ...type,
            image: data.url
          };
        }
        return type;
      });
      
      setRoomTypes(updatedRoomTypes);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          ประเภทห้องพัก
        </Typography>
        
        {canManageRoomTypes && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            เพิ่มประเภทห้องพัก
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {roomTypes.map((roomType) => (
          <Grid item xs={12} md={6} key={roomType.id}>
            <Card variant="outlined">
              <Grid container>
                <Grid item xs={12} md={5}>
                  <CloudinaryImage
                    src={roomType.image}
                    alt={roomType.name}
                    width="100%"
                    height="100%"
                    borderRadius={0}
                    quality="auto:good"
                    crop="fill"
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div">
                        {roomType.name}
                      </Typography>
                      
                      {canManageRoomTypes && (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenModal(roomType)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Typography color="text.secondary" gutterBottom>
                      {new Intl.NumberFormat('th-TH', {
                        style: 'currency',
                        currency: 'THB',
                        minimumFractionDigits: 0
                      }).format(roomType.price)} / คืน
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      {roomType.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" component="div" color="text.secondary">
                          ขนาด
                        </Typography>
                        <Typography variant="body2">
                          {roomType.size} ตร.ม.
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" component="div" color="text.secondary">
                          ความจุ
                        </Typography>
                        <Typography variant="body2">
                          {roomType.capacity} คน
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" component="div" color="text.secondary">
                          เตียง
                        </Typography>
                        <Typography variant="body2">
                          {roomType.bedType}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="caption" component="div" color="text.secondary">
                      สิ่งอำนวยความสะดวก
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {roomType.amenities.slice(0, 5).map((amenity, index) => (
                        <Chip key={index} size="small" label={amenity} />
                      ))}
                      {roomType.amenities.length > 5 && (
                        <Chip 
                          size="small" 
                          label={`+${roomType.amenities.length - 5}`} 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        จำนวนห้อง: {roomType.roomCount}
                      </Typography>
                      <Typography variant="body2" color={roomType.availableCount > 0 ? 'success.main' : 'error.main'}>
                        ว่าง: {roomType.availableCount}
                      </Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Modal แก้ไข/เพิ่มประเภทห้องพัก */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedType ? `แก้ไขประเภทห้องพัก: ${selectedType.name}` : 'เพิ่มประเภทห้องพัก'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ชื่อประเภทห้องพัก"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="คำอธิบาย"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="ราคาต่อคืน"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">฿</InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="ความจุสูงสุด (คน)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="ขนาด (ตร.ม.)"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="ประเภทเตียง"
                name="bedType"
                value={formData.bedType}
                onChange={handleChange}
                margin="normal"
                placeholder="เช่น เตียงคิงไซส์ 1 เตียง"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                สิ่งอำนวยความสะดวก
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 1, mt: 1 }}>
                <List dense>
                  {allAmenities.map((amenity) => (
                    <ListItem key={amenity} dense disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">{amenity}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              {selectedType && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    รูปภาพห้องพัก
                  </Typography>
                  <ImageUploader
                    endpoint={`/api/upload/roomtype/${selectedType.id}`}
                    defaultImage={selectedType.image}
                    title="อัปโหลดรูปภาพห้องพัก"
                    description="คลิกหรือลากรูปภาพมาที่นี่"
                    maxSize={5}
                    onUploadSuccess={(data) => handleUploadSuccess(selectedType.id, data)}
                    onUploadError={(error) => toast.error(error)}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            ยกเลิก
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<DoneIcon />}
            onClick={handleSubmit}
          >
            {selectedType ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มประเภทห้องพัก'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomTypes;