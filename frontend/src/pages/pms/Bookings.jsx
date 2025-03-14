// src/pages/pms/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Chip, Button, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Grid, MenuItem, FormControl, InputLabel, Select, Tooltip, InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const Bookings = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // สร้างข้อมูลจำลองสำหรับการจอง
    // ในแอปพลิเคชันจริง จะดึงข้อมูลจาก API
    const mockBookings = Array(25).fill().map((_, index) => {
      const statuses = ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'pending'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 14));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
      
      const guests = Math.floor(Math.random() * 4) + 1;
      const roomTypes = ['Deluxe', 'Superior', 'Suite', 'Family'];
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      
      const roomNumber = Math.floor(Math.random() * 400) + 100;
      
      const firstNames = ['สมชาย', 'สมหญิง', 'วีระ', 'ศิริรัตน์', 'อนุชา', 'John', 'Sarah', 'Michael', 'Lily', 'David'];
      const lastNames = ['ใจดี', 'มีสุข', 'แสนดี', 'เจริญศรี', 'วงศ์สวัสดิ์', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const totalAmount = (Math.floor(Math.random() * 10) + 1) * 1000;
      
      return {
        id: `BK${(index + 1).toString().padStart(5, '0')}`,
        guestName: `${firstName} ${lastName}`,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
        roomType,
        roomNumber,
        guests,
        status,
        totalAmount,
        paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
        createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30)))
      };
    });
    
    setBookings(mockBookings);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const openBookingModal = (booking = null) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const closeBookingModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'confirmed':
        return { label: 'ยืนยันแล้ว', color: 'primary' };
      case 'checked-in':
        return { label: 'เช็คอินแล้ว', color: 'success' };
      case 'checked-out':
        return { label: 'เช็คเอาท์แล้ว', color: 'info' };
      case 'cancelled':
        return { label: 'ยกเลิก', color: 'error' };
      case 'pending':
        return { label: 'รอดำเนินการ', color: 'warning' };
      default:
        return { label: status, color: 'default' };
    }
  };

  const getPaymentStatusChipProps = (status) => {
    switch (status) {
      case 'paid':
        return { label: 'ชำระแล้ว', color: 'success' };
      case 'pending':
        return { label: 'รอชำระ', color: 'warning' };
      default:
        return { label: status, color: 'default' };
    }
  };

  const formatThaiDate = (date) => {
    return format(date, 'd MMM yyyy', { locale: th });
  };

  // กรองข้อมูลจากการค้นหาและสถานะ
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.roomNumber.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // จัดเตรียมข้อมูลสำหรับแสดงผลในตาราง
  const displayedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        การจอง
      </Typography>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="ค้นหาการจอง..."
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
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>สถานะ</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="สถานะ"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="confirmed">ยืนยันแล้ว</MenuItem>
                <MenuItem value="checked-in">เช็คอินแล้ว</MenuItem>
                <MenuItem value="checked-out">เช็คเอาท์แล้ว</MenuItem>
                <MenuItem value="cancelled">ยกเลิก</MenuItem>
                <MenuItem value="pending">รอดำเนินการ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>เรียงตาม</InputLabel>
              <Select
                defaultValue="checkin-asc"
                label="เรียงตาม"
              >
                <MenuItem value="checkin-asc">วันเช็คอิน (ล่าสุด)</MenuItem>
                <MenuItem value="checkin-desc">วันเช็คอิน (เก่าสุด)</MenuItem>
                <MenuItem value="created-asc">วันที่สร้าง (ล่าสุด)</MenuItem>
                <MenuItem value="created-desc">วันที่สร้าง (เก่าสุด)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => openBookingModal()}
            >
              สร้างการจอง
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Booking Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>รหัสการจอง</TableCell>
                <TableCell>ชื่อผู้เข้าพัก</TableCell>
                <TableCell>วันที่เช็คอิน</TableCell>
                <TableCell>วันที่เช็คเอาท์</TableCell>
                <TableCell>ห้อง</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>การชำระเงิน</TableCell>
                <TableCell align="right">จำนวนเงิน</TableCell>
                <TableCell align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell component="th" scope="row">
                    {booking.id}
                  </TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{formatThaiDate(booking.checkIn)}</TableCell>
                  <TableCell>{formatThaiDate(booking.checkOut)}</TableCell>
                  <TableCell>{`${booking.roomNumber} (${booking.roomType})`}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small"
                      label={getStatusChipProps(booking.status).label}
                      color={getStatusChipProps(booking.status).color}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small"
                      label={getPaymentStatusChipProps(booking.paymentStatus).label}
                      color={getPaymentStatusChipProps(booking.paymentStatus).color}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 0
                    }).format(booking.totalAmount)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="ดูรายละเอียด">
                      <IconButton size="small" color="primary" onClick={() => openBookingModal(booking)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="แก้ไข">
                      <IconButton size="small" color="secondary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ยกเลิก">
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {displayedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" sx={{ py: 5 }}>
                      ไม่พบข้อมูลการจอง
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="แสดง:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </Paper>

      {/* Booking Modal */}
      <Dialog open={openModal} onClose={closeBookingModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBooking ? `รายละเอียดการจอง: ${selectedBooking.id}` : 'สร้างการจอง'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">ชื่อผู้เข้าพัก</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.guestName}</Typography>
                
                <Typography variant="subtitle2">วันที่เช็คอิน</Typography>
                <Typography variant="body1" gutterBottom>{formatThaiDate(selectedBooking.checkIn)}</Typography>
                
                <Typography variant="subtitle2">วันที่เช็คเอาท์</Typography>
                <Typography variant="body1" gutterBottom>{formatThaiDate(selectedBooking.checkOut)}</Typography>
                
                <Typography variant="subtitle2">จำนวนคืน</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.nights} คืน</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">ประเภทห้อง</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.roomType}</Typography>
                
                <Typography variant="subtitle2">หมายเลขห้อง</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.roomNumber}</Typography>
                
                <Typography variant="subtitle2">จำนวนผู้เข้าพัก</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.guests} คน</Typography>
                
                <Typography variant="subtitle2">ยอดชำระ</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Intl.NumberFormat('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                    minimumFractionDigits: 0
                  }).format(selectedBooking.totalAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <Chip 
                    label={getStatusChipProps(selectedBooking.status).label}
                    color={getStatusChipProps(selectedBooking.status).color}
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={getPaymentStatusChipProps(selectedBooking.paymentStatus).label}
                    color={getPaymentStatusChipProps(selectedBooking.paymentStatus).color}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ชื่อผู้เข้าพัก"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="อีเมล"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="จำนวนผู้เข้าพัก"
                  type="number"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="วันที่เช็คอิน"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="วันที่เช็คเอาท์"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
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
                  <InputLabel>หมายเลขห้อง</InputLabel>
                  <Select label="หมายเลขห้อง">
                    <MenuItem value="101">101</MenuItem>
                    <MenuItem value="102">102</MenuItem>
                    <MenuItem value="103">103</MenuItem>
                    <MenuItem value="201">201</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="หมายเหตุ"
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
          <Button onClick={closeBookingModal} color="inherit">
            ยกเลิก
          </Button>
          {selectedBooking ? (
            <Button variant="contained" color="primary">
              อัปเดตการจอง
            </Button>
          ) : (
            <Button variant="contained" color="primary">
              สร้างการจอง
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;
                