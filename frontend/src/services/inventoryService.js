// src/services/inventoryService.js
import { api } from './authService';

const InventoryService = {
  // ดึงรายการสินค้าทั้งหมด
  getInventoryItems: async (filters = {}) => {
    try {
      // สร้าง query params จาก filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/inventory?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' };
    }
  },

  // ดึงข้อมูลสินค้าตาม ID
  getInventoryItemById: async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' };
    }
  },

  // สร้างสินค้าใหม่
  createInventoryItem: async (itemData) => {
    try {
      const response = await api.post('/inventory', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างสินค้า' };
    }
  },

  // อัปเดตข้อมูลสินค้า
  updateInventoryItem: async (id, itemData) => {
    try {
      const response = await api.put(`/inventory/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า' };
    }
  },

  // ลบสินค้า
  deleteInventoryItem: async (id) => {
    try {
      const response = await api.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการลบสินค้า' };
    }
  },

  // ปรับปริมาณสินค้า
  adjustInventoryStock: async (id, quantity, reason) => {
    try {
      const response = await api.patch(`/inventory/${id}/stock`, { quantity, reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการปรับปริมาณสินค้า' };
    }
  },

  // ดึงรายการเบิกจ่ายทั้งหมด
  getSupplyRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/supplies?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเบิกจ่าย' };
    }
  },

  // สร้างรายการเบิกจ่ายใหม่
  createSupplyRequest: async (requestData) => {
    try {
      const response = await api.post('/supplies', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างรายการเบิกจ่าย' };
    }
  },

  // อนุมัติรายการเบิกจ่าย
  approveSupplyRequest: async (id, approverData) => {
    try {
      const response = await api.post(`/supplies/${id}/approve`, approverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการอนุมัติรายการเบิกจ่าย' };
    }
  },

  // ปฏิเสธรายการเบิกจ่าย
  rejectSupplyRequest: async (id, rejectReason) => {
    try {
      const response = await api.post(`/supplies/${id}/reject`, { reason: rejectReason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการปฏิเสธรายการเบิกจ่าย' };
    }
  },

  // ดึงข้อมูลผู้จัดจำหน่าย
  getVendors: async () => {
    try {
      const response = await api.get('/vendors');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้จัดจำหน่าย' };
    }
  },

  // สร้างรายการสั่งซื้อ
  createPurchaseOrder: async (orderData) => {
    try {
      const response = await api.post('/purchase-orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการสร้างรายการสั่งซื้อ' };
    }
  },

  // รับสินค้าเข้าคลัง
  receiveInventory: async (id, receiveData) => {
    try {
      const response = await api.post(`/purchase-orders/${id}/receive`, receiveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'เกิดข้อผิดพลาดในการรับสินค้าเข้าคลัง' };
    }
  }
};

export default InventoryService;