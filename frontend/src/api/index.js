/**
 * Every backend endpoint the app talks to, in one place.
 * Components call these functions rather than writing URLs inline, so a route
 * change on the server is a one-line change here.
 */
import { http } from './client';

export { API_BASE_URL, ApiError, assetUrl, downloadFile } from './client';

/* --- Public catalogue ---------------------------------------------------- */

export const catalogApi = {
  listProducts: (options) => http.get('/api/products', options),
  getProduct: (id, options) => http.get(`/api/products/${id}`, options),
  listServices: (options) => http.get('/api/services', options),
  listTechnologies: (options) => http.get('/api/technologies', options),
  listProcessSteps: (options) => http.get('/api/process-steps', options),
  listGallery: (options) => http.get('/api/gallery', options),
  getCompanyInfo: (options) => http.get('/api/company-info', options),
};

/* --- Authentication ------------------------------------------------------ */

export const authApi = {
  // The admin form used to POST /api/auth/login, which does not exist on the
  // server — every admin sign-in failed with a 404.
  adminLogin: (credentials) => http.post('/api/admin/login', credentials),
  customerLogin: (credentials) => http.post('/api/customers/login', credentials),
  customerRegister: (details) => http.post('/api/customers/register', details),
  forgotPassword: (email) => http.post('/api/customers/forgot-password', { email }),
  resetPassword: (token, password) => http.post('/api/customers/reset-password', { token, password }),
};

/* --- Orders, quotes and enquiries ---------------------------------------- */

export const ordersApi = {
  checkout: (order, options) => http.post('/api/orders/checkout', order, options),
  listMine: (options) => http.get('/api/customers/orders', options),
};

export const enquiriesApi = {
  submitContact: (message) => http.post('/api/contact', message),
  submitQuote: (quote) => http.post('/api/quotes', quote),
};

/* --- Admin --------------------------------------------------------------- */

/** Maps a content type to its admin REST collection. */
export const ADMIN_COLLECTIONS = {
  product: 'products',
  service: 'services',
  gallery: 'gallery',
  technology: 'technologies',
  process: 'process-steps',
};

export const adminApi = {
  stats: (options) => http.get('/api/admin/stats', options),

  // The catalogue with each product's internal price (the public list has none).
  listProducts: (options) => http.get('/api/admin/products', options),

  listOrders: (options) => http.get('/api/admin/orders', options),
  getOrder: (id, options) => http.get(`/api/admin/orders/${id}`, options),
  updateOrderStatus: (id, status, options) =>
    http.put(`/api/admin/orders/${id}/status`, { status }, options),
  deleteOrder: (id, options) => http.del(`/api/admin/orders/${id}`, options),

  getQuotation: (orderId, options) => http.get(`/api/admin/orders/${orderId}/quotation`, options),
  saveQuotation: (orderId, body, options) => http.put(`/api/admin/orders/${orderId}/quotation`, body, options),
  previewQuotation: (orderId, body, options) =>
    http.post(`/api/admin/orders/${orderId}/quotation/preview`, body, options),
  sendQuotation: (orderId, body, options) =>
    http.post(`/api/admin/orders/${orderId}/quotation/send`, body, options),

  listContacts: (options) => http.get('/api/admin/contacts', options),
  markContactRead: (id, options) => http.put(`/api/admin/contacts/${id}/read`, undefined, options),
  deleteContact: (id, options) => http.del(`/api/admin/contacts/${id}`, options),

  listQuotes: (options) => http.get('/api/admin/quotes', options),

  // Company info is an admin-only write; the dashboard used to PUT the public
  // read-only path, so saving always failed with 405.
  updateCompanyInfo: (info, options) => http.put('/api/admin/company-info', info, options),

  createItem: (type, payload, options) =>
    http.post(`/api/admin/${ADMIN_COLLECTIONS[type]}`, payload, options),
  updateItem: (type, id, payload, options) =>
    http.put(`/api/admin/${ADMIN_COLLECTIONS[type]}/${id}`, payload, options),
  deleteItem: (type, id, options) =>
    http.del(`/api/admin/${ADMIN_COLLECTIONS[type]}/${id}`, options),

  uploadImage: (file, options) => {
    const form = new FormData();
    form.append('image', file);
    return http.post('/api/admin/upload', form, options);
  },
};

/* --- Business system (staff) ---------------------------------------------- */

const qs = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
};

export const bmsApi = {
  me: (options) => http.get('/api/bms/me', options),
  dashboard: (options) => http.get('/api/bms/dashboard', options),

  listInvoices: (params, options) => http.get(`/api/bms/invoices${qs(params)}`, options),
  readyToInvoice: (options) => http.get('/api/bms/invoices/ready', options),
  getInvoice: (id, options) => http.get(`/api/bms/invoices/${id}`, options),
  createInvoice: (body, options) => http.post('/api/bms/invoices', body, options),
  invoiceFromOrder: (orderId, body, options) =>
    http.post(`/api/bms/invoices/from-order/${orderId}`, body || {}, options),
  voidInvoice: (id, options) => http.post(`/api/bms/invoices/${id}/void`, undefined, options),
  sendInvoice: (id, options) => http.post(`/api/bms/invoices/${id}/send`, undefined, options),
  recordPayment: (id, body, options) => http.post(`/api/bms/invoices/${id}/payments`, body, options),
  removePayment: (id, paymentId, options) => http.del(`/api/bms/invoices/${id}/payments/${paymentId}`, options),

  listCustomers: (params, options) => http.get(`/api/bms/customers${qs(params)}`, options),
  getCustomer: (email, options) => http.get(`/api/bms/customers/detail${qs({ email })}`, options),
  addNote: (email, body, options) => http.post(`/api/bms/customers/notes${qs({ email })}`, { body }, options),
  deleteNote: (id, options) => http.del(`/api/bms/customers/notes/${id}`, options),

  listStock: (options) => http.get('/api/bms/stock', options),
  stockMovements: (id, options) => http.get(`/api/bms/stock/${id}/movements`, options),
  adjustStock: (id, body, options) => http.post(`/api/bms/stock/${id}/adjust`, body, options),
  setReorderLevel: (id, reorderLevel, options) =>
    http.put(`/api/bms/stock/${id}/reorder-level`, { reorderLevel }, options),

  listSuppliers: (options) => http.get('/api/bms/suppliers', options),
  createSupplier: (body, options) => http.post('/api/bms/suppliers', body, options),
  updateSupplier: (id, body, options) => http.put(`/api/bms/suppliers/${id}`, body, options),

  listPurchaseOrders: (params, options) => http.get(`/api/bms/purchase-orders${qs(params)}`, options),
  createPurchaseOrder: (body, options) => http.post('/api/bms/purchase-orders', body, options),
  updatePurchaseOrder: (id, body, options) => http.put(`/api/bms/purchase-orders/${id}`, body, options),
  purchaseOrderAction: (id, action, options) =>
    http.post(`/api/bms/purchase-orders/${id}/${action}`, undefined, options),

  summary: (params, options) => http.get(`/api/bms/reports/summary${qs(params)}`, options),
  invoicesCsvPath: (params) => `/api/bms/reports/invoices.csv${qs(params)}`,

  listStaff: (options) => http.get('/api/bms/staff', options),
  createStaff: (body, options) => http.post('/api/bms/staff', body, options),
  updateStaff: (id, body, options) => http.patch(`/api/bms/staff/${id}`, body, options),
};
