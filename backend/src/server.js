const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tontan Resort API - Diagnostic Mode' });
});

// Try to load routes individually to identify the problematic one
try {
  console.log('Testing auth route...');
  const authRouter = require('./routes/auth');
  app.use('/api/auth', authRouter);
  console.log('✓ Auth route loaded successfully');
} catch (error) {
  console.error('✗ Error loading auth route:', error.message);
}

try {
  console.log('Testing users route...');
  const usersRouter = require('./routes/users');
  app.use('/api/users', usersRouter);
  console.log('✓ Users route loaded successfully');
} catch (error) {
  console.error('✗ Error loading users route:', error.message);
}

try {
  console.log('Testing rooms route...');
  const roomsRouter = require('./routes/rooms');
  app.use('/api/rooms', roomsRouter);
  console.log('✓ Rooms route loaded successfully');
} catch (error) {
  console.error('✗ Error loading rooms route:', error.message);
}

try {
  console.log('Testing bookings route...');
  const bookingsRouter = require('./routes/bookings');
  app.use('/api/bookings', bookingsRouter);
  console.log('✓ Bookings route loaded successfully');
} catch (error) {
  console.error('✗ Error loading bookings route:', error.message);
}

try {
  console.log('Testing inventory route...');
  const inventoryRouter = require('./routes/inventory');
  app.use('/api/inventory', inventoryRouter);
  console.log('✓ Inventory route loaded successfully');
} catch (error) {
  console.error('✗ Error loading inventory route:', error.message);
}

try {
  console.log('Testing upload route...');
  const uploadRouter = require('./routes/upload');
  app.use('/api/upload', uploadRouter);
  console.log('✓ Upload route loaded successfully');
} catch (error) {
  console.error('✗ Error loading upload route:', error.message);
}

try {
  console.log('Testing accounting route...');
  const accountingRouter = require('./routes/accounting');
  app.use('/api/accounting', accountingRouter);
  console.log('✓ Accounting route loaded successfully');
} catch (error) {
  console.error('✗ Error loading accounting route:', error.message);
}

try {
  console.log('Testing reports route...');
  const reportsRouter = require('./routes/reports');
  app.use('/api/reports', reportsRouter);
  console.log('✓ Reports route loaded successfully');
} catch (error) {
  console.error('✗ Error loading reports route:', error.message);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Diagnostic server running on port ${PORT}`);
});