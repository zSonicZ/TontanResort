// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import AuthProvider from './contexts/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Register from './pages/auth/Register';

// Property Management System (PMS)
import Bookings from './pages/pms/Bookings';
import Rooms from './pages/pms/Rooms';
import Guests from './pages/pms/Guests';

// Warehouse Management System (WMS)
import Inventory from './pages/wms/Inventory';
import Supplies from './pages/wms/Supplies';
import Vendors from './pages/wms/Vendors';

// Back Office System (BOS)
import Accounting from './pages/bos/Accounting';
import Invoices from './pages/bos/Invoices';
import Expenses from './pages/bos/Expenses';

// Revenue Management System (RMS)
import Reports from './pages/rms/Reports';
import Analysis from './pages/rms/Analysis';
import Forecasting from './pages/rms/Forecasting';

// Settings
import Profile from './pages/settings/Profile';
import Users from './pages/settings/Users';
import SystemSettings from './pages/settings/SystemSettings';

// Error Pages
import NotFound from './pages/errors/NotFound';

// กำหนดธีมที่ใช้ในแอปพลิเคชัน
const theme = createTheme({
  palette: {
    mode: 'dark', // ธีมสีมืด
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: [
      'Prompt',
      'Kanit',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            {/* Route สำหรับหน้าที่ไม่ต้องเข้าสู่ระบบ */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Route สำหรับหน้าที่ต้องเข้าสู่ระบบ */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* PMS Routes */}
              <Route path="pms/bookings" element={<Bookings />} />
              <Route path="pms/rooms" element={<Rooms />} />
              <Route path="pms/guests" element={<Guests />} />

              {/* WMS Routes */}
              <Route path="wms/inventory" element={<Inventory />} />
              <Route path="wms/supplies" element={<Supplies />} />
              <Route path="wms/vendors" element={<Vendors />} />

              {/* BOS Routes */}
              <Route path="bos/accounting" element={<Accounting />} />
              <Route path="bos/invoices" element={<Invoices />} />
              <Route path="bos/expenses" element={<Expenses />} />

              {/* RMS Routes */}
              <Route path="rms/reports" element={<Reports />} />
              <Route path="rms/analysis" element={<Analysis />} />
              <Route path="rms/forecasting" element={<Forecasting />} />

              {/* Settings Routes */}
              <Route
                path="settings/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="settings/profile" element={<Profile />} />
              <Route
                path="settings/system"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;