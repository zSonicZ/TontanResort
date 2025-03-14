// src/components/rooms/RoomFloorPlan.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip, 
  Tooltip, 
  ButtonGroup, 
  Button
} from '@mui/material';

const RoomFloorPlan = ({ rooms = [], onRoomClick }) => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  
  // จัดกลุ่มห้องตามชั้น
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});
  
  // รวบรวมรายการชั้นทั้งหมด
  const floors = Object.keys(roomsByFloor).map(Number).sort((a, b) => a - b);
  
  // กำหนดสีตามสถานะห้อง
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return { bgcolor: '#4caf50', color: 'white' };
      case 'occupied':
        return { bgcolor: '#f44336', color: 'white' };
      case 'reserved':
        return { bgcolor: '#2196f3', color: 'white' };
      case 'maintenance':
        return { bgcolor: '#ff9800', color: 'white' };
      case 'cleaning':
        return { bgcolor: '#03a9f4', color: 'white' };
      default:
        return { bgcolor: '#e0e0e0', color: 'text.primary' };
    }
  };
  
  // ดึงข้อความสถานะห้อง
  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'ว่าง';
      case 'occupied':
        return 'มีผู้เข้าพัก';
      case 'reserved':
        return 'จองแล้ว';
      case 'maintenance':
        return 'ซ่อมบำรุง';
      case 'cleaning':
        return 'กำลังทำความสะอาด';
      default:
        return status;
    }
  };
  
  // ดึงสัญลักษณ์สถานะความสะอาด
  const getCleaningStatusSymbol = (status) => {
    switch (status) {
      case 'clean':
        return '✓';
      case 'dirty':
        return '✗';
      case 'cleaning':
        return '⟳';
      default:
        return '';
    }
  };
  
  // ดึงไอคอนประเภทห้อง
  const getRoomTypeIcon = (type) => {
    switch (type) {
      case 'Deluxe':
        return '🛏️';
      case 'Superior':
        return '🛌';
      case 'Suite':
        return '🏠';
      case 'Family':
        return '👨‍👩‍👧‍👦';
      default:
        return '';
    }
  };
  
  // จัดระเบียบห้องในชั้นที่เลือก
  const organizeRoomsInGrid = (floorRooms) => {
    if (!floorRooms || floorRooms.length === 0) {
      return [];
    }
    
    // จัดเรียงห้องตามหมายเลข
    const sortedRooms = [...floorRooms].sort((a, b) => a.number - b.number);
    
    // สร้างตารางแผนผังห้อง (จำลอง 5 คอลัมน์)
    const grid = [];
    const columns = 5;
    
    for (let i = 0; i < sortedRooms.length; i += columns) {
      const row = sortedRooms.slice(i, i + columns);
      grid.push(row);
    }
    
    return grid;
  };
  
  // ห้องในชั้นที่เลือก
  const floorRooms = roomsByFloor[selectedFloor] || [];
  
  // แผนผังห้อง
  const roomGrid = organizeRoomsInGrid(floorRooms);
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          แผนผังห้องพัก - ชั้น {selectedFloor}
        </Typography>
        
        <ButtonGroup variant="outlined" size="small">
          {floors.map(floor => (
            <Button 
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              variant={selectedFloor === floor ? 'contained' : 'outlined'}
            >
              ชั้น {floor}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          bgcolor: 'background.default',
          minHeight: 400,
          position: 'relative'
        }}
      >
        {/* สัญลักษณ์ทิศทาง */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 1,
            boxShadow: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" display="block">ทิศเหนือ</Typography>
          <Box sx={{ fontSize: '1.5rem', lineHeight: 1 }}>⬆</Box>
        </Box>
        
        {/* คำอธิบายสัญลักษณ์ */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            right: 16, 
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            สถานะห้อง:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip size="small" label="ว่าง" sx={{ bgcolor: '#4caf50', color: 'white' }} />
            <Chip size="small" label="มีผู้เข้าพัก" sx={{ bgcolor: '#f44336', color: 'white' }} />
            <Chip size="small" label="จองแล้ว" sx={{ bgcolor: '#2196f3', color: 'white' }} />
            <Chip size="small" label="ซ่อมบำรุง" sx={{ bgcolor: '#ff9800', color: 'white' }} />
            <Chip size="small" label="ทำความสะอาด" sx={{ bgcolor: '#03a9f4', color: 'white' }} />
          </Box>
        </Box>
        
        {/* แผนผังห้อง */}
        <Box sx={{ mt: 2 }}>
          {roomGrid.length > 0 ? (
            <Grid container spacing={2}>
              {roomGrid.map((row, rowIndex) => (
                <Grid item xs={12} key={rowIndex}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {row.map((room) => {
                      const statusColor = getStatusColor(room.status);
                      
                      return (
                        <Tooltip 
                          key={room.id}
                          title={
                            <>
                              <Typography variant="body2">ห้อง {room.number}</Typography>
                              <Typography variant="body2">ประเภท: {room.type}</Typography>
                              <Typography variant="body2">สถานะ: {getStatusText(room.status)}</Typography>
                              {room.status === 'occupied' && (
                                <Typography variant="body2">ผู้เข้าพัก: {room.currentGuest}</Typography>
                              )}
                            </>
                          }
                        >
                          <Box
                            onClick={() => onRoomClick && onRoomClick(room)}
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: statusColor.bgcolor,
                              color: statusColor.color,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                              cursor: 'pointer',
                              position: 'relative',
                              border: '1px solid rgba(0,0,0,0.12)',
                              boxShadow: 1,
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 3
                              }
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {room.number}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              {getRoomTypeIcon(room.type)} {room.type}
                            </Typography>
                            
                            {/* สัญลักษณ์สถานะความสะอาด */}
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: 5, 
                                right: 5, 
                                fontSize: '0.75rem',
                                width: 16,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                bgcolor: 
                                  room.cleaningStatus === 'clean' ? 'success.main' :
                                  room.cleaningStatus === 'dirty' ? 'error.main' : 'info.main',
                                color: 'white'
                              }}
                            >
                              {getCleaningStatusSymbol(room.cleaningStatus)}
                            </Box>
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Typography variant="body1" color="text.secondary">
                ไม่พบข้อมูลห้องพักในชั้นนี้
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RoomFloorPlan;