// src/services/index.js
import AuthService, { api } from './authService';
import RoomService from './roomService';
import BookingService from './bookingService';
import GuestService from './guestService';
import InventoryService from './inventoryService';
import AccountingService from './accountingService';
import DashboardService from './dashboardService';

export {
  api,
  AuthService,
  RoomService,
  BookingService,
  GuestService,
  InventoryService,
  AccountingService,
  DashboardService
};