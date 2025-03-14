// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, IconButton, Typography, Divider, 
  List, ListItem, ListItemIcon, ListItemText, ListItemButton, Menu, 
  MenuItem, Avatar, Tooltip, Badge, styled, useMediaQuery, useTheme,
  ListSubheader
} from '@mui/material';
import { 
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  CalendarMonth as BookingIcon,
  Person as GuestIcon,
  Inventory as InventoryIcon,
  ShoppingCart as SuppliesIcon,
  Business as VendorIcon,
  ReceiptLong as InvoiceIcon,
  MonetizationOn as AccountingIcon,
  Paid as ExpensesIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportIcon,
  Insights as ForecastIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  People as UsersIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  MeetingRoom as RoomIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

// Drawer Width
const drawerWidth = 260;

// Styled components
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navigateTo = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  // หากมีการเปลี่ยน resolution (เช่น หมุนมือถือ)
  React.useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    } else if (!isMobile && !open) {
      setOpen(true);
    }
  }, [isMobile]);

  // แยกเมนูตามระบบ
  const menuItems = [
    {
      title: 'หน้าหลัก',
      items: [
        { text: 'แดชบอร์ด', icon: <DashboardIcon />, path: '/dashboard' }
      ]
    },
    {
      title: 'ระบบจัดการโรงแรม (PMS)',
      items: [
        { text: 'การจอง', icon: <BookingIcon />, path: '/pms/bookings' },
        { text: 'ห้องพัก', icon: <RoomIcon />, path: '/pms/rooms' },
        { text: 'ลูกค้า', icon: <GuestIcon />, path: '/pms/guests' }
      ]
    },
    {
      title: 'ระบบคลังสินค้า (WMS)',
      items: [
        { text: 'สินค้าคงคลัง', icon: <InventoryIcon />, path: '/wms/inventory' },
        { text: 'การเบิกจ่าย', icon: <SuppliesIcon />, path: '/wms/supplies' },
        { text: 'ผู้จัดจำหน่าย', icon: <VendorIcon />, path: '/wms/vendors' }
      ]
    },
    {
      title: 'ระบบบัญชี (BOS)',
      items: [
        { text: 'บัญชี', icon: <AccountingIcon />, path: '/bos/accounting' },
        { text: 'ใบแจ้งหนี้', icon: <InvoiceIcon />, path: '/bos/invoices' },
        { text: 'ค่าใช้จ่าย', icon: <ExpensesIcon />, path: '/bos/expenses' }
      ]
    },
    {
      title: 'ระบบบริหารรายได้ (RMS)',
      items: [
        { text: 'วิเคราะห์', icon: <AnalyticsIcon />, path: '/rms/analysis' },
        { text: 'รายงาน', icon: <ReportIcon />, path: '/rms/reports' },
        { text: 'การพยากรณ์', icon: <ForecastIcon />, path: '/rms/forecasting' }
      ]
    },
    {
      title: 'ตั้งค่า',
      items: [
        { text: 'ผู้ใช้งาน', icon: <UsersIcon />, path: '/settings/users', roles: ['admin'] },
        { text: 'โปรไฟล์', icon: <ProfileIcon />, path: '/settings/profile' },
        { text: 'ตั้งค่าระบบ', icon: <SettingsIcon />, path: '/settings/system', roles: ['admin'] }
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          bgcolor: '#1a237e',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tontan Resort Management System
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" onClick={handleOpenNotifications}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Tooltip title="เปิดเมนูผู้ใช้">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
              <Avatar alt={user?.name || 'User'} src={user?.profileImage || ''} />
            </IconButton>
          </Tooltip>

          {/* Notifications Menu */}
          <Menu
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            sx={{ mt: '45px' }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleCloseNotifications}>
              <Typography textAlign="center">การจองใหม่: ห้อง 101</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              <Typography textAlign="center">กำหนดเช็คเอาท์: ห้อง 205</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              <Typography textAlign="center">สินค้าใกล้หมด: น้ำดื่ม</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              <Typography textAlign="center">แจ้งชำระเงิน: INV-0001</Typography>
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => navigateTo('/settings/profile')}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">โปรไฟล์</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigateTo('/settings/system')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">ตั้งค่า</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">ออกจากระบบ</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              px: 2,
            }}
          >
            <HotelIcon sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap>
              Tontan Resort
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Menu Lists */}
        <Box sx={{ overflow: 'auto' }}>
          {menuItems.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              <List
                subheader={
                  <ListSubheader component="div" id={`section-${sectionIndex}`}>
                    {section.title}
                  </ListSubheader>
                }
              >
                {section.items.map((item, itemIndex) => {
                  // Check for role-based permissions
                  if (item.roles && !item.roles.includes(user?.role)) {
                    return null;
                  }

                  return (
                    <ListItem key={itemIndex} disablePadding>
                      <ListItemButton
                        selected={location.pathname === item.path}
                        onClick={() => navigateTo(item.path)}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              {sectionIndex < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;