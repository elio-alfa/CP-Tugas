const TOKEN_KEY = 'sembako_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    request<{ success: boolean; token: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () =>
    request<{ success: boolean; user: any }>('/auth/me'),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),

  switchDemoUser: (role: 'admin' | 'petugas') =>
    request<{ success: boolean; token: string; user: any; message: string }>('/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  // Dashboard
  getDashboardSummary: () =>
    request<{ success: boolean; data: any }>('/dashboard/summary'),

  // Products
  getProducts: (params?: { category_id?: string; stock_status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category_id) q.set('category_id', params.category_id);
    if (params?.stock_status) q.set('stock_status', params.stock_status);
    if (params?.search) q.set('search', params.search);
    return request<{ success: boolean; data: any[]; total: number }>(`/products?${q.toString()}`);
  },

  getProductDetail: (id: string) =>
    request<{ success: boolean; data: any }>(`/products/${id}`),

  createProduct: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    request<{ success: boolean; message: string; data: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleProductStatus: (id: string) =>
    request<{ success: boolean; message: string; data: any }>(`/products/${id}/toggle-status`, {
      method: 'PATCH',
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () =>
    request<{ success: boolean; data: any[] }>('/categories'),

  createCategory: (data: { name: string; description?: string }) =>
    request<{ success: boolean; message: string; data: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategory: (id: string, data: { name: string; description?: string }) =>
    request<{ success: boolean; message: string; data: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Suppliers
  getSuppliers: () =>
    request<{ success: boolean; data: any[] }>('/suppliers'),

  createSupplier: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSupplier: (id: string, data: any) =>
    request<{ success: boolean; message: string; data: any }>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Stock In
  getStockInList: (params?: { start_date?: string; end_date?: string }) => {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    return request<{ success: boolean; data: any[] }>(`/stock-in?${q.toString()}`);
  },

  createStockIn: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/stock-in', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelStockIn: (id: string, reason: string) =>
    request<{ success: boolean; message: string; data: any }>(`/stock-in/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Sales (POS)
  getSalesList: (params?: { start_date?: string; end_date?: string }) => {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    return request<{ success: boolean; data: any[] }>(`/sales?${q.toString()}`);
  },

  createSale: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelSale: (id: string, reason: string) =>
    request<{ success: boolean; message: string; data: any }>(`/sales/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Adjustments & Movements
  createStockAdjustment: (data: { product_id: string; physical_stock: number; reason: string }) =>
    request<{ success: boolean; message: string; data: any }>('/stock/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStockMovements: (params?: { product_id?: string; movement_type?: string; start_date?: string; end_date?: string }) => {
    const q = new URLSearchParams();
    if (params?.product_id) q.set('product_id', params.product_id);
    if (params?.movement_type) q.set('movement_type', params.movement_type);
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    return request<{ success: boolean; data: any[] }>(`/stock/movements?${q.toString()}`);
  },

  // Reports
  getCurrentStockReport: (category_id?: string) => {
    const q = new URLSearchParams();
    if (category_id) q.set('category_id', category_id);
    return request<{ success: boolean; data: any }>(`/reports/current-stock?${q.toString()}`);
  },

  getStockInReport: (params?: { start_date?: string; end_date?: string; supplier_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    if (params?.supplier_id) q.set('supplier_id', params.supplier_id);
    return request<{ success: boolean; data: any }>(`/reports/stock-in?${q.toString()}`);
  },

  getSalesReport: (params?: { start_date?: string; end_date?: string }) => {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    return request<{ success: boolean; data: any }>(`/reports/sales?${q.toString()}`);
  },

  getLowStockReport: () =>
    request<{ success: boolean; data: any }>('/reports/low-stock'),

  // Users & Settings (Admin)
  getUsers: () =>
    request<{ success: boolean; data: any[] }>('/users'),

  createUser: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleUserStatus: (id: string) =>
    request<{ success: boolean; message: string }>(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    }),

  resetPassword: (id: string, new_password: string) =>
    request<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password }),
    }),

  getSettings: () =>
    request<{ success: boolean; data: any }>('/settings'),

  updateSettings: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Test Runner
  runTests: () =>
    request<{ success: boolean; data: any }>('/tests/run', { method: 'POST' }),
};
