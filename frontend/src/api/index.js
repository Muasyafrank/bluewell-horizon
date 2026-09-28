/**
 * Every backend endpoint the app talks to, in one place.
 * Components call these functions rather than writing URLs inline, so a route
 * change on the server is a one-line change here.
 */
import { http } from './client';

export { API_BASE_URL, ApiError, assetUrl } from './client';

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

  listOrders: (options) => http.get('/api/admin/orders', options),
  getOrder: (id, options) => http.get(`/api/admin/orders/${id}`, options),
  updateOrderStatus: (id, status, options) =>
    http.put(`/api/admin/orders/${id}/status`, { status }, options),
  deleteOrder: (id, options) => http.del(`/api/admin/orders/${id}`, options),

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
