// src/pages/pms/Rooms.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, Card, CardContent, CardActions, 
  Button, IconButton, Chip, Badge, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Tooltip, InputAdornment, Tabs, Tab, Divider, Switch, FormControlLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  CleaningServices as CleaningIcon,
  DoNotDisturb as DoNotDisturbIcon,
  CheckCircleOutline as AvailableIcon,
  EventBusy as OccupiedIcon,
  Event as ReservedIcon
} from '@mui/icons-material';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    // สร้างข้อมูลจำลองสำหรับห้องพัก
    // ในแอปพลิเคชันจริง จะดึงข้อมูลจาก API
    const roomTypes = [
      { 
        type: 'Deluxe', 
        price: 2500, 
        capacity: 2, 
        description: 'ห้องดีลักซ์ ขนาด 30 ตร.ม. พร้อมเตียงคิงไซส์',
        amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์']
      },
      { 
        type: 'Superior', 
        price: 3500, 
        capacity: 2, 
        description: 'ห้องซูพีเรีย ขนาด 40 ตร.ม. พร้อมวิวสวน',
        amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ']
      },
      { 
        type: 'Suite', 
        price: 5000, 
        capacity: 3, 
        description: 'ห้องสวีท ขนาด 55 ตร.ม. พร้อมห้องนั่งเล่นแยก',
        amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ', 'มินิบาร์']
      },
      { 
        type: 'Family', 
        price: 6500, 
        capacity: 4, 
        description: 'ห้องแฟมิลี่ ขนาด 65 ตร.ม. เหมาะสำหรับครอบครัว',
        amenities: ['เครื่องปรับอากาศ', 'Wi-Fi', 'ตู้เย็น', 'เครื่องทำน้ำอุ่น', 'โทรทัศน์', 'ตู้เซฟ', 'มินิบาร์', 'อ่างอาบน้ำ']
      }
    ];
    
    const statuses = ['available', 'occupied', 'reserved', 'maintenance', 'cleaning'];
    const cleaningStatuses = ['clean', 'dirty', 'cleaning'];
    
    const floors = [1, 2, 3, 4];
    
    // สร้างห้องพักจำลอง
    const mockRooms = [];
    
    floors.forEach(floor => {
      // สร้างห้องจำนวน 10 ห้องต่อชั้น
      for (let i = 1; i <= 10; i++) {
        const roomNumber = floor * 100 + i; // เช่น 101, 102, ... 201, 202, ...
        
        // สุ่มประเภทห้อง
        const randomTypeIndex = Math.floor(Math.random() * roomTypes.length);
        const roomType = roomTypes[randomTypeIndex];
        
        // สุ่มสถานะห้อง
        const randomStatusIndex = Math.floor(Math.random() * statuses.length);
        const status = statuses[randomStatusIndex];
        
        // สุ่มสถานะความสะอาด
        const randomCleaningIndex = Math.floor(Math.random() * cleaningStatuses.length);
        const cleaningStatus = cleaningStatuses[randomCleaningIndex];
        
        // สร้างข้อมูลห้อง
        mockRooms.push({
          id: roomNumber.toString(),
          number: roomNumber,
          floor: floor,
          type: roomType.type,
          price: roomType.price,
          capacity: roomType.capacity,
          description: roomType.description,
          amenities: roomType.amenities,
          status: status,
          cleaningStatus: cleaningStatus,
          lastCleaned: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 7))),
          currentGuest: status === 'occupied' ? `Guest-${Math.floor(Math.random() * 1000)}` : null,
          checkIn: status === 'occupied' ? new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 5))) : null,
          checkOut: status === 'occupied' ? new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 5) + 1)) : null,
          notes: '',
          image: '/api/placeholder/300/200'
        });
      }
    });
    
    setRooms(mockRooms);
  }, []);

  const openRoomModal = (room = null) => {
    setSelectedRoom(room);
    setOpenModal(true);
  };

  const closeRoomModal = () => {
    setOpenModal(false);
    setSelectedRoom(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleFloorFilterChange = (event) => {
    setFloorFilter(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'available':
        return { label: 'ว่าง', color: 'success', icon: <AvailableIcon /> };
      case 'occupied':
        return { label: 'มีผู้เข้าพัก', color: 'error', icon: <OccupiedIcon /> };
      case 'reserved':
        return { label: 'จองแล้ว', color: 'primary', icon: <ReservedIcon /> };
      case 'maintenance':
        return { label: 'ซ่อมบำรุง', color: 'warning', icon: <DoNotDisturbIcon /> };
      case 'cleaning':
        return { label: 'กำลังทำความสะอาด', color: 'info', icon: <CleaningIcon /> };
      default:
        return { label: status, color: 'default', icon: null };
    }
  };

  const getCleaningStatusIcon = (status) => {
    switch (status) {
      case 'clean':
        return { icon: <CheckCircleIcon color="success" />, tooltip: 'สะอาด' };
      case 'dirty':
        return { icon: <DoNotDisturbIcon color="error" />, tooltip: 'รอทำความสะอาด' };
      case 'cleaning':
        return { icon: <CleaningIcon color="info" />, tooltip: 'กำลังทำความสะอาด' };
      default:
        return { icon: null, tooltip: '' };
    }
  };

  // กรองข้อมูลห้องพัก
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.toString().includes(searchQuery) ||
                         room.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  // รวบรวมข้อมูลสำหรับตัวเลือกตัวกรอง
  const roomTypes = [...new Set(rooms.map(room => room.type))];
  const floors = [...new Set(rooms.map(room => room.floor))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        ห้องพัก
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="ภาพรวม" />
          <Tab label="แผนผังห้องพัก" />
          <Tab label="ประเภทห้องพัก" />
          <Tab label="รายงาน" />
        </Tabs>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="ค้นหาห้องพัก..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>สถานะ</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="สถานะ"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="available">ว่าง</MenuItem>
                <MenuItem value="occupied">มีผู้เข้าพัก</MenuItem>
                <MenuItem value="reserved">จองแล้ว</MenuItem>
                <MenuItem value="maintenance">ซ่อมบำรุง</MenuItem>
                <MenuItem value="cleaning">กำลังทำความสะอาด</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>ประเภทห้อง</InputLabel>
              <Select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                label="ประเภทห้อง"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                {roomTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>ชั้น</InputLabel>
              <Select
                value={floorFilter}
                onChange={handleFloorFilterChange}
                label="ชั้น"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                {floors.map(floor => (
                  <MenuItem key={floor} value={floor.toString()}>ชั้น {floor}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'grid'}
                  onChange={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                />
              }
              label="Grid"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => openRoomModal()}
            >
              เพิ่มห้องพัก
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Room Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.filter(room => room.status === 'available').length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                ห้องว่าง
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.filter(room => room.status === 'occupied').length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                มีผู้เข้าพัก
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.filter(room => room.status === 'reserved').length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                จองแล้ว
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#fff8e1' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.filter(room => room.status === 'maintenance').length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                ซ่อมบำรุง
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#e1f5fe' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.filter(room => room.status === 'cleaning').length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                ทำความสะอาด
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h5" component="div" align="center">
                {rooms.length}
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2">
                ห้องทั้งหมด
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Room Grid */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {filteredRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  position: 'relative',
                  border: '1px solid',
                  borderColor: theme => {
                    switch (room.status) {
                      case 'available': return theme.palette.success.light;
                      case 'occupied': return theme.palette.error.light;
                      case 'reserved': return theme.palette.primary.light;
                      case 'maintenance': return theme.palette.warning.light;
                      case 'cleaning': return theme.palette.info.light;
                      default: return theme.palette.divider;
                    }
                  }
                }}
              >
                <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                  <Tooltip title={getCleaningStatusIcon(room.cleaningStatus).tooltip}>
                    {getCleaningStatusIcon(room.cleaningStatus).icon}
                  </Tooltip>
                </Box>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    ห้อง {room.number}
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Chip
                      size="small"
                      label={getStatusChipProps(room.status).label}
                      color={getStatusChipProps(room.status).color}
                      icon={getStatusChipProps(room.status).icon}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ประเภท: {room.type} - ชั้น {room.floor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ราคา: {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 0
                    }).format(room.price)} / คืน
                  </Typography>
                  {room.status === 'occupied' && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        ผู้เข้าพัก: {room.currentGuest}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        เช็คเอาท์: {room.checkOut.toLocaleDateString('th-TH')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => openRoomModal(room)}>
                    ดูรายละเอียด
                  </Button>
                  <Button size="small" color="primary">
                    {room.status === 'available' ? 'เช็คอิน' : 'จัดการ'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {filteredRooms.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  ไม่พบข้อมูลห้องพักที่ตรงตามเงื่อนไขการค้นหา
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Room Modal */}
      <Dialog open={openModal} onClose={closeRoomModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRoom ? `รายละเอียดห้อง ${selectedRoom.number}` : 'เพิ่มห้องพักใหม่'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRoom ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <img 
                  src={selectedRoom.image} 
                  alt={`Room ${selectedRoom.number}`} 
                  style={{ width: '100%', borderRadius: 8 }}
                />
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    label={getStatusChipProps(selectedRoom.status).label}
                    color={getStatusChipProps(selectedRoom.status).color}
                    icon={getStatusChipProps(selectedRoom.status).icon}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ความสะอาด: {
                      selectedRoom.cleaningStatus === 'clean' ? 'สะอาด' :
                      selectedRoom.cleaningStatus === 'dirty' ? 'รอทำความสะอาด' : 'กำลังทำความสะอาด'
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  ห้อง {selectedRoom.number} - {selectedRoom.type}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedRoom.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    ข้อมูลห้อง
                  </Typography>
                  <Typography variant="body2">ชั้น: {selectedRoom.floor}</Typography>
                  <Typography variant="body2">จำนวนผู้เข้าพักสูงสุด: {selectedRoom.capacity} คน</Typography>
                  <Typography variant="body2">
                    ราคา: {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 0
                    }).format(selectedRoom.price)} / คืน
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    สิ่งอำนวยความสะดวก
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedRoom.amenities.map((amenity, index) => (
                      <Grid item key={index}>
                        <Chip size="small" label={amenity} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {selectedRoom.status === 'occupied' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ข้อมูลผู้เข้าพัก
                    </Typography>
                    <Typography variant="body2">ชื่อผู้เข้าพัก: {selectedRoom.currentGuest}</Typography>
                    <Typography variant="body2">เช็คอิน: {selectedRoom.checkIn.toLocaleDateString('th-TH')}</Typography>
                    <Typography variant="body2">เช็คเอาท์: {selectedRoom.checkOut.toLocaleDateString('th-TH')}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="หมายเหตุ"
                  multiline
                  rows={3}
                  value={selectedRoom.notes}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="หมายเลขห้อง"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>ประเภทห้อง</InputLabel>
                  <Select label="ประเภทห้อง">
                    <MenuItem value="Deluxe">Deluxe</MenuItem>
                    <MenuItem value="Superior">Superior</MenuItem>
                    <MenuItem value="Suite">Suite</MenuItem>
                    <MenuItem value="Family">Family</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>ชั้น</InputLabel>
                  <Select label="ชั้น">
                    {floors.map(floor => (
                      <MenuItem key={floor} value={floor}>{floor}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ราคาต่อคืน (บาท)"
                  type="number"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="จำนวนผู้เข้าพักสูงสุด"
                  type="number"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>สถานะห้อง</InputLabel>
                  <Select label="สถานะห้อง">
                    <MenuItem value="available">ว่าง</MenuItem>
                    <MenuItem value="maintenance">ซ่อมบำรุง</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="รายละเอียดห้อง"
                  multiline
                  rows={3}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRoomModal} color="inherit">
            ยกเลิก
          </Button>
          {selectedRoom ? (
            <Button variant="contained" color="primary">
              บันทึกการเปลี่ยนแปลง
            </Button>
          ) : (
            <Button variant="contained" color="primary">
              เพิ่มห้องพัก
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rooms;