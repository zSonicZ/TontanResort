// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Hotel as HotelIcon } from '@mui/icons-material';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1a237e 0%, #121858 100%)',
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 2 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              mb: 3,
            }}
          >
            <HotelIcon sx={{ fontSize: 40, color: '#1a237e', mb: 1 }} />
            <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 700, color: '#1a237e' }}>
              Tontan Resort
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              ระบบบริหารจัดการโรงแรม
            </Typography>
          </Box>

          {/* แสดงเนื้อหาจาก child routes */}
          <Outlet />
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="white">
            &copy; {new Date().getFullYear()} Tontan Resort Management System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;