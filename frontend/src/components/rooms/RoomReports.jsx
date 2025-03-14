// src/components/rooms/RoomReports.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Tab,
  Tabs
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// สีสำหรับกราฟประเภทห้องพัก
const ROOM_TYPE_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

// สีสำหรับกราฟสถานะห้องพัก
const STATUS_COLORS = {
  'available': '#4caf50',
  'occupied': '#f44336',
  'reserved': '#2196f3',
  'maintenance': '#ff9800',
  'cleaning': '#03a9f4'
};

const RoomReports = ({ rooms = [] }) => {
  const [reportType, setReportType] = useState('occupancy');
  const [timeFrame, setTimeFrame] = useState('today');
  const [roomStatusData, setRoomStatusData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  
  useEffect(() => {
    // สร้างข้อมูลสำหรับกราฟสถานะห้องพัก
    const statusCount = {};
    const statusLabels = {
      'available': 'ว่าง',
      'occupied': 'มีผู้เข้าพัก',
      'reserved': 'จองแล้ว',
      'maintenance': 'ซ่อมบำรุง',
      'cleaning': 'กำลังทำความสะอาด'
    };
    
    rooms.forEach(room => {
      if (!statusCount[room.status]) {
        statusCount[room.status] = 0;
      }
      statusCount[room.status]++;
    });
    
    const roomStatusData = Object.keys(statusCount).map(status => ({
      name: statusLabels[status] || status,
      value: statusCount[status],
      status: status
    }));
    
    setRoomStatusData(roomStatusData);
    
    // สร้างข้อมูลสำหรับกราฟประเภทห้องพัก
    const typeCount = {};
    
    rooms.forEach(room => {
      if (!typeCount[room.type]) {
        typeCount[room.type] = { total: 0, available: 0, occupied: 0 };
      }
      typeCount[room.type].total++;
      
      if (room.status === 'available') {
        typeCount[room.type].available++;
      } else if (room.status === 'occupied') {
        typeCount[room.type].occupied++;
      }
    });
    
    const roomTypeData = Object.keys(typeCount).map(type => ({
      name: type,
      total: typeCount[type].total,
      available: typeCount[type].available,
      occupied: typeCount[type].occupied
    }));
    
    setRoomTypeData(roomTypeData);
    
    // สร้างข้อมูลจำลองสำหรับกราฟอัตราการเข้าพัก
    const mockOccupancyData = [
      { month: 'ม.ค.', occupancyRate: 72 },
      { month: 'ก.พ.', occupancyRate: 75 },
      { month: 'มี.ค.', occupancyRate: 68 },
      { month: 'เม.ย.', occupancyRate: 82 },
      { month: 'พ.ค.', occupancyRate: 85 },
      { month: 'มิ.ย.', occupancyRate: 78 },
      { month: 'ก.ค.', occupancyRate: 80 },
      { month: 'ส.ค.', occupancyRate: 82 },
      { month: 'ก.ย.', occupancyRate: 75 },
      { month: 'ต.ค.', occupancyRate: 70 },
      { month: 'พ.ย.', occupancyRate: 68 },
      { month: 'ธ.ค.', occupancyRate: 88 }
    ];
    
    setOccupancyData(mockOccupancyData);
  }, [rooms]);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };
  
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };
  
  const renderRoomStatusChart = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              สถานะห้องพักปัจจุบัน
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    labelLine={{ stroke: '#555', strokeWidth: 1 }}
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              สถานะห้องพักตามประเภท
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roomTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="จำนวนห้อง" fill="#8884d8" />
                  <Bar dataKey="available" name="ห้องว่าง" fill="#82ca9d" />
                  <Bar dataKey="occupied" name="มีผู้เข้าพัก" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              อัตราการเข้าพักรายเดือน
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={occupancyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="occupancyRate" name="อัตราการเข้าพัก" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  const renderRoomTypeChart = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              จำนวนห้องพักตามประเภท
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roomTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="จำนวนห้อง" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              สัดส่วนประเภทห้องพัก
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="name"
                    label={(entry) => `${entry.name}: ${entry.total}`}
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ROOM_TYPE_COLORS[index % ROOM_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              อัตราการเข้าพักตามประเภทห้อง
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roomTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value, name, props) => {
                    if (name === 'occupancyRate') return `${value}%`;
                    return value;
                  }} />
                  <Legend />
                  <Bar 
                    dataKey="occupied" 
                    name="อัตราการเข้าพัก" 
                    fill="#f44336"
                    // คำนวณเป็นเปอร์เซ็นต์
                    formatter={(value, entry, index) => (value / entry.payload.total * 100).toFixed(0)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  const renderSummaryStats = () => {
    // คำนวณสถิติสรุป
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(0) : 0;
    const availableRooms = rooms.filter(room => room.status === 'available').length;
    const availabilityRate = totalRooms > 0 ? (availableRooms / totalRooms * 100).toFixed(0) : 0;
    const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
    
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom align="center">
                {totalRooms}
              </Typography>
              <Typography color="text.secondary" align="center">
                จำนวนห้องทั้งหมด
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                กำลังใช้งาน: {totalRooms - maintenanceRooms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom align="center">
                {availableRooms} ({availabilityRate}%)
              </Typography>
              <Typography color="text.secondary" align="center">
                ห้องว่าง
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                พร้อมให้บริการ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom align="center">
                {occupiedRooms} ({occupancyRate}%)
              </Typography>
              <Typography color="text.secondary" align="center">
                มีผู้เข้าพัก
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                อัตราการเข้าพัก
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff8e1' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom align="center">
                {maintenanceRooms}
              </Typography>
              <Typography color="text.secondary" align="center">
                ซ่อมบำรุง
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                ไม่พร้อมให้บริการ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h6">
          รายงานห้องพัก
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>รูปแบบรายงาน</InputLabel>
            <Select
              value={reportType}
              onChange={handleReportTypeChange}
              label="รูปแบบรายงาน"
            >
              <MenuItem value="occupancy">อัตราการเข้าพัก</MenuItem>
              <MenuItem value="roomType">ประเภทห้องพัก</MenuItem>
              <MenuItem value="revenue">รายได้</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>ช่วงเวลา</InputLabel>
            <Select
              value={timeFrame}
              onChange={handleTimeFrameChange}
              label="ช่วงเวลา"
            >
              <MenuItem value="today">วันนี้</MenuItem>
              <MenuItem value="week">สัปดาห์นี้</MenuItem>
              <MenuItem value="month">เดือนนี้</MenuItem>
              <MenuItem value="quarter">ไตรมาสนี้</MenuItem>
              <MenuItem value="year">ปีนี้</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size="small"
          >
            ดาวน์โหลด
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            size="small"
          >
            พิมพ์
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            size="small"
          >
            รีเฟรช
          </Button>
        </Stack>
      </Box>
      
      {/* สถิติสรุป */}
      {renderSummaryStats()}
      
      {/* แท็บรายงาน */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="สถานะห้องพัก" />
          <Tab label="ประเภทห้องพัก" />
          <Tab label="อัตราการเข้าพัก" />
          <Tab label="รายได้" />
        </Tabs>
      </Box>
      
      {/* เนื้อหาแท็บ */}
      {currentTab === 0 && renderRoomStatusChart()}
      {currentTab === 1 && renderRoomTypeChart()}
      {currentTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            อัตราการเข้าพักรายเดือน
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupancyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(tick) => `${tick}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="occupancyRate" name="อัตราการเข้าพัก" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
      {currentTab === 3 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            ข้อมูลรายได้จากห้องพักจะแสดงที่นี่
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default RoomReports;