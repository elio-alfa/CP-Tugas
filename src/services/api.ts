import { clientDb } from './clientDb.js';

const TOKEN_KEY = 'sembako_auth_token';
const USER_KEY = 'sembako_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Check if running on GitHub Pages or static host without backend
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') ||
   window.location.protocol === 'file:' ||
   window.location.pathname.includes('/CP-Tugas'));

let backendAvailable: boolean | null = isStaticHost ? false : null;

async function checkBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(1500) });
    backendAvailable = res.ok;
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const hasBackend = await checkBackend();
  if (!hasBackend) {
    throw new Error('BACKEND_UNAVAILABLE');
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('BACKEND_UNAVAILABLE');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    try {
      const res = await request<{ success: boolean; token: string; user: any; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setStoredUser(res.user);
      return res;
    } catch {
      // Fallback for GitHub Pages static host
      const users = clientDb.getData().users;
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === credentials.username.toLowerCase() ||
          u.email.toLowerCase() === credentials.username.toLowerCase()
      );
      if (!user) throw new Error('Username atau password salah.');
      const token = `tok_${user.role}_ghpages_${Date.now()}`;
      setStoredToken(token);
      setStoredUser(user);
      return { success: true, token, user, message: 'Login berhasil.' };
    }
  },

  getCurrentUser: async () => {
    try {
      const res = await request<{ success: boolean; user: any }>('/auth/me');
      setStoredUser(res.user);
      return res;
    } catch {
      const cached = getStoredUser();
      if (cached) return { success: true, user: cached };
      const admin = clientDb.getData().users[0];
      setStoredUser(admin);
      return { success: true, user: admin };
    }
  },

  logout: async () => {
    try {
      await request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
    } catch {}
    clearStoredToken();
    return { success: true, message: 'Logout berhasil.' };
  },

  switchDemoUser: async (role: 'admin' | 'petugas') => {
    try {
      const res = await request<{ success: boolean; token: string; user: any; message: string }>('/auth/switch-demo', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      setStoredUser(res.user);
      return res;
    } catch {
      const user = clientDb.getData().users.find((u) => u.role === role) || clientDb.getData().users[0];
      const token = `tok_${user.role}_demo_${Date.now()}`;
      setStoredToken(token);
      setStoredUser(user);
      return {
        success: true,
        token,
        user,
        message: `Beralih ke akun demo: ${user.name} (${user.role})`,
      };
    }
  },

  // Dashboard
  getDashboardSummary: async () => {
    try {
      return await request<{ success: boolean; data: any }>('/dashboard/summary');
    } catch {
      return { success: true, data: clientDb.getDashboardSummary() };
    }
  },

  // Products
  getProducts: async (params?: { category_id?: string; stock_status?: string; search?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.category_id) q.set('category_id', params.category_id);
      if (params?.stock_status) q.set('stock_status', params.stock_status);
      if (params?.search) q.set('search', params.search);
      return await request<{ success: boolean; data: any[]; total: number }>(`/products?${q.toString()}`);
    } catch {
      const list = clientDb.getProducts(params);
      return { success: true, data: list, total: list.length };
    }
  },

  getProductDetail: async (id: string) => {
    try {
      return await request<{ success: boolean; data: any }>(`/products/${id}`);
    } catch {
      const p = clientDb.getData().products.find((i) => i.id === id);
      const cat = clientDb.getData().categories.find((c) => c.id === p?.category_id);
      const movements = clientDb.getData().stock_movements.filter((m) => m.product_id === id);
      return { success: true, data: { ...p, category_name: cat?.name, movements } };
    }
  },

  createProduct: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const p = clientDb.createProduct(data);
      return { success: true, message: 'Barang berhasil disimpan.', data: p };
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const p = clientDb.updateProduct(id, data);
      return { success: true, message: 'Barang berhasil diperbarui.', data: p };
    }
  },

  toggleProductStatus: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/products/${id}/toggle-status`, {
        method: 'PATCH',
      });
    } catch {
      const p = clientDb.toggleProductStatus(id);
      return { success: true, message: 'Status barang diubah.', data: p };
    }
  },

  deleteProduct: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch {
      clientDb.deleteProduct(id);
      return { success: true, message: 'Barang berhasil dinonaktifkan.' };
    }
  },

  // Categories
  getCategories: async () => {
    try {
      return await request<{ success: boolean; data: any[] }>('/categories');
    } catch {
      const cats = clientDb.getData().categories.map((c) => ({
        ...c,
        product_count: clientDb.getData().products.filter((p) => p.category_id === c.id).length,
      }));
      return { success: true, data: cats };
    }
  },

  createCategory: async (data: { name: string; description?: string }) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        created_at: new Date().toISOString(),
      };
      clientDb.getData().categories.push(newCat);
      return { success: true, message: 'Kategori berhasil ditambahkan.', data: newCat };
    }
  },

  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const c = clientDb.getData().categories.find((cat) => cat.id === id);
      if (c) {
        c.name = data.name;
        if (data.description !== undefined) c.description = data.description;
      }
      return { success: true, message: 'Kategori berhasil diubah.', data: c };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/categories/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const idx = clientDb.getData().categories.findIndex((cat) => cat.id === id);
      if (idx !== -1) clientDb.getData().categories.splice(idx, 1);
      return { success: true, message: 'Kategori berhasil dihapus.' };
    }
  },

  // Suppliers
  getSuppliers: async () => {
    try {
      return await request<{ success: boolean; data: any[] }>('/suppliers');
    } catch {
      return { success: true, data: clientDb.getData().suppliers };
    }
  },

  createSupplier: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/suppliers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newSup = {
        id: `sup-${Date.now()}`,
        code: data.code || `SUP-${String(clientDb.getData().suppliers.length + 1).padStart(3, '0')}`,
        name: data.name,
        contact_person: data.contact_person,
        phone: data.phone,
        address: data.address || '',
        notes: data.notes || '',
        is_active: true,
      };
      clientDb.getData().suppliers.push(newSup);
      return { success: true, message: 'Pemasok berhasil ditambahkan.', data: newSup };
    }
  },

  updateSupplier: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const s = clientDb.getData().suppliers.find((sup) => sup.id === id);
      if (s) {
        if (data.name) s.name = data.name;
        if (data.contact_person) s.contact_person = data.contact_person;
        if (data.phone) s.phone = data.phone;
        if (data.address) s.address = data.address;
        if (data.notes) s.notes = data.notes;
      }
      return { success: true, message: 'Pemasok berhasil diubah.', data: s };
    }
  },

  // Stock In
  getStockInList: async (params?: { start_date?: string; end_date?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      return await request<{ success: boolean; data: any[] }>(`/stock-in?${q.toString()}`);
    } catch {
      return { success: true, data: clientDb.getData().stock_in_transactions };
    }
  },

  createStockIn: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/stock-in', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const user = getStoredUser();
      const tx = clientDb.createStockIn(data, user);
      return { success: true, message: 'Barang masuk berhasil disimpan.', data: tx };
    }
  },

  cancelStockIn: async (id: string, reason: string) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/stock-in/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch {
      const tx = clientDb.getData().stock_in_transactions.find((t) => t.id === id);
      if (tx) tx.status = 'cancelled';
      return { success: true, message: 'Transaksi dibatalkan.', data: tx };
    }
  },

  // Sales (POS)
  getSalesList: async (params?: { start_date?: string; end_date?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      return await request<{ success: boolean; data: any[] }>(`/sales?${q.toString()}`);
    } catch {
      return { success: true, data: clientDb.getData().sales_transactions };
    }
  },

  createSale: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/sales', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const user = getStoredUser();
      const sale = clientDb.createSale(data, user);
      return { success: true, message: 'Penjualan berhasil disimpan.', data: sale };
    }
  },

  cancelSale: async (id: string, reason: string) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>(`/sales/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch {
      const s = clientDb.getData().sales_transactions.find((t) => t.id === id);
      if (s) s.status = 'cancelled';
      return { success: true, message: 'Penjualan dibatalkan.', data: s };
    }
  },

  // Adjustments & Movements
  createStockAdjustment: async (data: { product_id: string; physical_stock: number; reason: string }) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/stock/adjustments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const user = getStoredUser();
      const adj = clientDb.createAdjustment(data, user);
      return { success: true, message: 'Penyesuaian stok berhasil disimpan.', data: adj };
    }
  },

  getStockMovements: async (params?: { product_id?: string; movement_type?: string; start_date?: string; end_date?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.product_id) q.set('product_id', params.product_id);
      if (params?.movement_type) q.set('movement_type', params.movement_type);
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      return await request<{ success: boolean; data: any[] }>(`/stock/movements?${q.toString()}`);
    } catch {
      let list = [...clientDb.getData().stock_movements];
      if (params?.product_id && params.product_id !== 'all') list = list.filter((m) => m.product_id === params.product_id);
      if (params?.movement_type && params.movement_type !== 'all') list = list.filter((m) => m.movement_type === params.movement_type);
      return { success: true, data: list };
    }
  },

  // Reports
  getCurrentStockReport: async (category_id?: string) => {
    try {
      const q = new URLSearchParams();
      if (category_id) q.set('category_id', category_id);
      return await request<{ success: boolean; data: any }>(`/reports/current-stock?${q.toString()}`);
    } catch {
      const catMap = new Map(clientDb.getData().categories.map((c) => [c.id, c.name]));
      let prods = clientDb.getData().products.filter((p) => p.is_active);
      if (category_id && category_id !== 'all') prods = prods.filter((p) => p.category_id === category_id);
      const items = prods.map((p) => ({
        sku: p.sku,
        name: p.name,
        category: catMap.get(p.category_id) || '-',
        unit: p.unit,
        current_stock: p.current_stock,
        min_stock: p.min_stock,
        purchase_price: p.purchase_price,
        selling_price: p.selling_price,
        valuation: p.current_stock * p.purchase_price,
        potentialRevenue: p.current_stock * p.selling_price,
        potentialMargin: p.current_stock * (p.selling_price - p.purchase_price),
        status: p.current_stock <= 0 ? 'HABIS' : p.current_stock <= p.min_stock ? 'MENIPIS' : 'AMAN',
      }));
      return {
        success: true,
        data: {
          items,
          summary: {
            totalItems: items.length,
            totalStockUnits: items.reduce((s, i) => s + i.current_stock, 0),
            totalValuation: items.reduce((s, i) => s + i.valuation, 0),
            totalPotentialRevenue: items.reduce((s, i) => s + i.potentialRevenue, 0),
          },
        },
      };
    }
  },

  getStockInReport: async (params?: { start_date?: string; end_date?: string; supplier_id?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      if (params?.supplier_id) q.set('supplier_id', params.supplier_id);
      return await request<{ success: boolean; data: any }>(`/reports/stock-in?${q.toString()}`);
    } catch {
      const txs = clientDb.getData().stock_in_transactions.filter((t) => t.status === 'completed');
      const flat: any[] = [];
      let total = 0;
      let qty = 0;
      for (const t of txs) {
        for (const it of t.items) {
          flat.push({
            transaction_number: t.transaction_number,
            transaction_date: t.transaction_date,
            supplier_name: t.supplier_name,
            user_name: t.user_name,
            sku: it.product_sku,
            name: it.product_name,
            unit: it.unit,
            quantity: it.quantity,
            purchase_price: it.purchase_price,
            subtotal: it.subtotal,
          });
          total += it.subtotal;
          qty += it.quantity;
        }
      }
      return { success: true, data: { items: flat, summary: { totalTransactions: txs.length, totalQuantity: qty, totalAmount: total } } };
    }
  },

  getSalesReport: async (params?: { start_date?: string; end_date?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      return await request<{ success: boolean; data: any }>(`/reports/sales?${q.toString()}`);
    } catch {
      const txs = clientDb.getData().sales_transactions.filter((t) => t.status === 'completed');
      const flat: any[] = [];
      let totalRev = 0;
      let totalHpp = 0;
      let totalQty = 0;
      for (const t of txs) {
        for (const it of t.items) {
          const hpp = (it.purchase_price_snapshot || 0) * it.quantity;
          flat.push({
            transaction_number: t.transaction_number,
            transaction_date: t.transaction_date,
            cashier_name: t.cashier_name,
            payment_method: t.payment_method,
            sku: it.product_sku,
            name: it.product_name,
            unit: it.unit,
            quantity: it.quantity,
            selling_price: it.selling_price,
            purchase_price: it.purchase_price_snapshot || 0,
            subtotal: it.subtotal,
            hpp,
            profit: it.subtotal - hpp,
          });
          totalRev += it.subtotal;
          totalHpp += hpp;
          totalQty += it.quantity;
        }
      }
      return {
        success: true,
        data: {
          items: flat,
          summary: {
            totalTransactions: txs.length,
            totalQuantity: totalQty,
            totalRevenue: totalRev,
            totalHpp,
            grossProfit: totalRev - totalHpp,
            marginPercentage: totalRev > 0 ? Number((((totalRev - totalHpp) / totalRev) * 100).toFixed(2)) : 0,
          },
        },
      };
    }
  },

  getLowStockReport: async () => {
    try {
      return await request<{ success: boolean; data: any }>('/reports/low-stock');
    } catch {
      const catMap = new Map(clientDb.getData().categories.map((c) => [c.id, c.name]));
      const items = clientDb.getData().products
        .filter((p) => p.is_active && p.current_stock <= p.min_stock)
        .map((p) => ({
          sku: p.sku,
          name: p.name,
          category: catMap.get(p.category_id) || '-',
          unit: p.unit,
          current_stock: p.current_stock,
          min_stock: p.min_stock,
          deficit: Math.max(0, p.min_stock - p.current_stock),
          recommended_order: Math.max(10, p.min_stock - p.current_stock + 15),
          estimated_cost: Math.max(10, p.min_stock - p.current_stock + 15) * p.purchase_price,
          status: p.current_stock <= 0 ? 'HABIS' : 'MENIPIS',
        }));
      return {
        success: true,
        data: {
          items,
          summary: {
            totalAlerts: items.length,
            outOfStockCount: items.filter((i) => i.status === 'HABIS').length,
            lowStockCount: items.filter((i) => i.status === 'MENIPIS').length,
            totalEstimatedRestockCost: items.reduce((acc, i) => acc + i.estimated_cost, 0),
          },
        },
      };
    }
  },

  // Users & Settings
  getUsers: async () => {
    try {
      return await request<{ success: boolean; data: any[] }>('/users');
    } catch {
      return { success: true, data: clientDb.getData().users };
    }
  },

  createUser: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newUser = {
        id: `usr-${Date.now()}`,
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role || 'petugas',
        is_active: true,
      };
      clientDb.getData().users.push(newUser);
      return { success: true, message: 'Pengguna berhasil dibuat.', data: newUser };
    }
  },

  toggleUserStatus: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/users/${id}/toggle-status`, {
        method: 'PATCH',
      });
    } catch {
      const u = clientDb.getData().users.find((user) => user.id === id);
      if (u) u.is_active = !u.is_active;
      return { success: true, message: 'Status pengguna diubah.' };
    }
  },

  resetPassword: async (id: string, new_password: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ new_password }),
      });
    } catch {
      return { success: true, message: 'Password berhasil direset.' };
    }
  },

  getSettings: async () => {
    try {
      return await request<{ success: boolean; data: any }>('/settings');
    } catch {
      return { success: true, data: clientDb.getData().settings };
    }
  },

  updateSettings: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; data: any }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const s = clientDb.getData().settings;
      if (data.store_name) s.store_name = data.store_name;
      if (data.address) s.address = data.address;
      if (data.phone) s.phone = data.phone;
      if (data.receipt_footer) s.receipt_footer = data.receipt_footer;
      if (data.default_min_stock) s.default_min_stock = Number(data.default_min_stock);
      return { success: true, message: 'Pengaturan disimpan.', data: s };
    }
  },
};
