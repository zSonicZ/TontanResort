// src/services/accountingService.js
import { api } from './authService';

const AccountingService = {
  // ดึงรายการใบแจ้งหนี้
  getInvoices: async (filters = {}) => {
    try {
      // สร้าง query params จาก filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/invoices?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบแจ้งหนี้' };
    }
  },

  // ดึงข้อมูลใบแจ้งหนี้ตาม ID
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบแจ้งหนี้' };
    }
  },

  // สร้างใบแจ้งหนี้
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างใบแจ้งหนี้' };
    }
  },

  // อัปเดตใบแจ้งหนี้
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปเดตใบแจ้งหนี้' };
    }
  },

  // ลบใบแจ้งหนี้
  deleteInvoice: async (id) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการลบใบแจ้งหนี้' };
    }
  },

  // บันทึกการชำระเงิน
  recordPayment: async (invoiceId, paymentData) => {
    try {
      const response = await api.post(`/invoices/${invoiceId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการบันทึกการชำระเงิน' };
    }
  },

  // ส่งใบแจ้งหนี้ทางอีเมล
  sendInvoiceByEmail: async (invoiceId, emailData) => {
    try {
      const response = await api.post(`/invoices/${invoiceId}/send-email`, emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการส่งใบแจ้งหนี้ทางอีเมล' };
    }
  },

  // ดาวน์โหลดใบแจ้งหนี้เป็น PDF
  downloadInvoicePdf: async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดาวน์โหลดใบแจ้งหนี้' };
    }
  },

  // ดึงรายการรายรับรายจ่าย
  getTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายรับรายจ่าย' };
    }
  },

  // บันทึกรายรับ
  recordIncome: async (incomeData) => {
    try {
      const response = await api.post('/transactions/income', incomeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการบันทึกรายรับ' };
    }
  },

  // บันทึกรายจ่าย
  recordExpense: async (expenseData) => {
    try {
      const response = await api.post('/transactions/expense', expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการบันทึกรายจ่าย' };
    }
  },

  // อนุมัติรายจ่าย
  approveExpense: async (id, approvalData) => {
    try {
      const response = await api.post(`/transactions/expense/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอนุมัติรายจ่าย' };
    }
  },

  // ดึงรายงานทางการเงิน
  getFinancialReports: async (reportType, dateRange) => {
    try {
      const params = new URLSearchParams({ reportType, ...dateRange });
      const response = await api.get(`/reports/financial?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงรายงานทางการเงิน' };
    }
  },

  // ดึงข้อมูลสรุปทางการเงิน (สำหรับแดชบอร์ด)
  getFinancialSummary: async (period = 'month') => {
    try {
      const response = await api.get(`/reports/financial/summary?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุปทางการเงิน' };
    }
  }
};

export default AccountingService;