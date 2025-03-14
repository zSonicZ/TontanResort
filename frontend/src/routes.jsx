// src/routes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Authentication Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// PMS (Property Management System)
import Bookings from './pages/pms/Bookings';
import Rooms from './pages/pms/Rooms';
import Guests from './pages/pms/Guests';

// WMS (Warehouse Management System)
import Inventory from './pages/wms/Inventory';
import Supplies from './pages/wms/Supplies';
import Vendors from './pages/wms/Vendors';

// BOS (Back Office System)
import Accounting from './pages/bos/Accounting';
import Invoices from './pages/bos/Invoices';
import Expenses from './pages/bos/Expenses';

// RMS (Revenue Management System)
import Analysis from './pages/rms/Analysis';
import Reports from './pages/rms/Reports';
import Forecasting from './pages/rms/Forecasting';

// Settings
import Users from './pages/settings/Users';
import Profile from './pages/settings/Profile';
import SystemSettings from './pages/settings/SystemSettings';

// Error Pages
import NotFound from './pages/errors/NotFound';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      
      // PMS Routes
      { 
        path: 'pms/bookings', 
        element: <ProtectedRoute><Bookings /></ProtectedRoute> 
      },
      { 
        path: 'pms/rooms', 
        element: <ProtectedRoute><Rooms /></ProtectedRoute> 
      },
      { 
        path: 'pms/guests', 
        element: <ProtectedRoute><Guests /></ProtectedRoute> 
      },
      
      // WMS Routes
      { 
        path: 'wms/inventory', 
        element: <ProtectedRoute><Inventory /></ProtectedRoute> 
      },
      { 
        path: 'wms/supplies', 
        element: <ProtectedRoute><Supplies /></ProtectedRoute> 
      },
      { 
        path: 'wms/vendors', 
        element: <ProtectedRoute><Vendors /></ProtectedRoute> 
      },
      
      // BOS Routes
      { 
        path: 'bos/accounting', 
        element: <ProtectedRoute><Accounting /></ProtectedRoute> 
      },
      { 
        path: 'bos/invoices', 
        element: <ProtectedRoute><Invoices /></ProtectedRoute> 
      },
      { 
        path: 'bos/expenses', 
        element: <ProtectedRoute><Expenses /></ProtectedRoute> 
      },
      
      // RMS Routes
      { 
        path: 'rms/analysis', 
        element: <ProtectedRoute><Analysis /></ProtectedRoute> 
      },
      { 
        path: 'rms/reports', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'rms/forecasting', 
        element: <ProtectedRoute><Forecasting /></ProtectedRoute> 
      },
      
      // Settings Routes
      { 
        path: 'settings/users', 
        element: <ProtectedRoute roles={['admin']}><Users /></ProtectedRoute> 
      },
      { 
        path: 'settings/profile', 
        element: <ProtectedRoute><Profile /></ProtectedRoute> 
      },
      { 
        path: 'settings/system', 
        element: <ProtectedRoute roles={['admin']}><SystemSettings /></ProtectedRoute> 
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;