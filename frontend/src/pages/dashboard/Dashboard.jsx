// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Divider, Avatar, LinearProgress } from '@mui/material';
import { 
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    occupancyRate: 78,
    totalBookings: 124,
    totalGuests: 215,
    totalRevenue: 587950,
    inventoryStatus: 92,
    pendingTasks: 8
  });

  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // สร้างข้อมูลจำลองสำหรับ dashboard
    // ในแอปพลิเคชันจริง จะดึงข้อมูลจาก API
    const mockRevenueData = [
      { name: 'ม.ค.', ห้องพัก: 150000, อาหาร: 75000, บริการ: 45000 },
      { name: 'ก.พ.', ห้องพัก: 170000, อาหาร: 82000, บริการ: 48000 },
      { name: 'มี.ค.', ห้องพัก: 160000, อาหาร: 79000, บริการ: 47000 },
      { name: 'เม.ย.', ห้องพัก: 180000, อาหาร: 85000, บริการ: 52000 },
      { name: 'พ.ค.', ห้องพัก: 190000, อาหาร: 87000, บริการ: 55000 },
      { name: 'มิ.ย.', ห้องพัก: 175000, อาหาร: 83000, บริการ: 50000 }
    ];

    const mockOccupancyData = [
      { name: 'ม.ค.', อัตราการเข้าพัก: 72 },
      { name: 'ก.พ.', อัตราการเข้าพัก: 75 },
      { name: 'มี.ค.', อัตราการเข้าพัก: 68 },
      { name: 'เม.ย.', อัตราการเข้าพัก: 82 },
      { name: 'พ.ค.', อัตราการเข้าพัก: 85 },
      { name: 'มิ.ย.', อัตราการเข้าพัก: 78 }
    ];

    const mockInventoryData = [
      { name: 'เครื่องดื่ม', value: 32 },
      { name: 'อาหาร', value: 28 },
      { name: 'อุปกรณ์ห้องพัก', value: 24 },
      { name: 'ของใช้สิ้นเปลือง', value: 16 }
    ];

    setRevenueData(mockRevenueData);
    setOccupancyData(mockOccupancyData);
    setInventoryData(mockInventoryData);
    setLoading(false);
  }, []);

  // สำหรับกราฟวงกลม (Pie Chart)
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // ฟังก์ชันแปลงตัวเลขเป็นสกุลเงินบาท
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        แดชบอร์ด
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        สวัสดีคุณ {user?.name || 'ผู้ใช้'}, นี่คือภาพรวมการดำเนินงานของโรงแรม Tontan Resort
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#1a237e', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                อัตราการเข้าพัก
              </Typography>
              <Typography variant="h3" component="div">
                {stats.occupancyRate}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  เพิ่มขึ้น 5% จากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#283593', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                การจองทั้งหมด
              </Typography>
              <Typography variant="h3" component="div">
                {stats.totalBookings}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  เพิ่มขึ้น 12 จองจากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#303f9f', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                รายได้รวม
              </Typography>
              <Typography variant="h3" component="div">
                {formatCurrency(stats.totalRevenue)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  เพิ่มขึ้น 7.3% จากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3949ab', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                คลังสินค้า
              </Typography>
              <Typography variant="h3" component="div">
                {stats.inventoryStatus}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowDownwardIcon sx={{ color: '#ff9800', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  ลดลง 3% จากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              รายได้เปรียบเทียบรายเดือน
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="ห้องพัก" stackId="a" fill="#8884d8" />
                <Bar dataKey="อาหาร" stackId="a" fill="#82ca9d" />
                <Bar dataKey="บริการ" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupancy Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              สัดส่วนสินค้าคงคลัง
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupancy Trend Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              แนวโน้มอัตราการเข้าพัก
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={occupancyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="อัตราการเข้าพัก"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              การจองล่าสุด
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {['นายสมชาย ใจดี', 'นางสาวสมหญิง มั่นคง', 'Mr. John Smith', 'Ms. Sarah Johnson'][item - 1]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {['2 ห้อง - 3 คืน', '1 ห้อง - 2 คืน', '1 ห้อง - 5 คืน', '3 ห้อง - 1 คืน'][item - 1]} | {['เช็คอิน: 15 มี.ค.', 'เช็คอิน: 16 มี.ค.', 'เช็คอิน: 18 มี.ค.', 'เช็คอิน: 20 มี.ค.'][item - 1]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              งานที่ต้องทำ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">
                    {['ทำความสะอาดห้อง 101', 'ซ่อมแซมเครื่องปรับอากาศ ห้อง 205', 'เติมสินค้าในมินิบาร์', 'ตรวจสอบอุปกรณ์ห้องประชุม'][item - 1]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {['มอบหมายให้: แผนกแม่บ้าน', 'มอบหมายให้: แผนกซ่อมบำรุง', 'มอบหมายให้: แผนกบริการ', 'มอบหมายให้: แผนกสิ่งอำนวยความสะดวก'][item - 1]}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={[75, 30, 100, 50][item - 1]} 
                    sx={{ mt: 1, mb: 1, height: 8, borderRadius: 5 }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;