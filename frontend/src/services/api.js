const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('harmain_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  switchRole: (role) => request('/auth/switch-role', { method: 'POST', body: JSON.stringify({ role }) }),

  // Dashboard
  getDashboard: () => request('/dashboard'),
  getRates: () => request('/dashboard/rates'),

  // Pilgrims
  getPilgrims: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/pilgrims${query ? `?${query}` : ''}`);
  },
  getPilgrim: (id) => request(`/pilgrims/${id}`),
  createPilgrim: (data) => request('/pilgrims', { method: 'POST', body: JSON.stringify(data) }),
  updatePilgrim: (id, data) => request(`/pilgrims/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePilgrim: (id) => request(`/pilgrims/${id}`, { method: 'DELETE' }),
  getPilgrimCard: (id) => request(`/pilgrims/${id}/card`),

  // Packages
  getPackages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/packages${query ? `?${query}` : ''}`);
  },
  getPackage: (id) => request(`/packages/${id}`),
  createPackage: (data) => request('/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) => request(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) => request(`/packages/${id}`, { method: 'DELETE' }),

  // Flights & PNRs
  getFlights: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/flights${query ? `?${query}` : ''}`);
  },
  createFlight: (data) => request('/flights', { method: 'POST', body: JSON.stringify(data) }),
  updateFlight: (id, data) => request(`/flights/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFlight: (id) => request(`/flights/${id}`, { method: 'DELETE' }),

  getPnrs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/pnrs${query ? `?${query}` : ''}`);
  },
  createPnr: (data) => request('/pnrs', { method: 'POST', body: JSON.stringify(data) }),
  updatePnr: (id, data) => request(`/pnrs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePnr: (id) => request(`/pnrs/${id}`, { method: 'DELETE' }),

  // Hotels & Rooms
  getHotels: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hotels${query ? `?${query}` : ''}`);
  },
  getHotel: (id) => request(`/hotels/${id}`),
  createHotel: (data) => request('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  updateHotel: (id, data) => request(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotel: (id) => request(`/hotels/${id}`, { method: 'DELETE' }),

  getRooms: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/rooms${query ? `?${query}` : ''}`);
  },
  createRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  allocateRoomBed: (data) => request('/rooms/allocate', { method: 'POST', body: JSON.stringify(data) }),
  deallocateRoomBed: (data) => request('/rooms/deallocate', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Ground Transport & Transfers
  getVehicles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transport/vehicles${query ? `?${query}` : ''}`);
  },
  createVehicle: (data) => request('/transport/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id, data) => request(`/transport/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicle: (id) => request(`/transport/vehicles/${id}`, { method: 'DELETE' }),

  getDrivers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transport/drivers${query ? `?${query}` : ''}`);
  },
  createDriver: (data) => request('/transport/drivers', { method: 'POST', body: JSON.stringify(data) }),
  updateDriver: (id, data) => request(`/transport/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDriver: (id) => request(`/transport/drivers/${id}`, { method: 'DELETE' }),

  getTransfers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transfers${query ? `?${query}` : ''}`);
  },
  createTransfer: (data) => request('/transfers', { method: 'POST', body: JSON.stringify(data) }),
  updateTransfer: (id, data) => request(`/transfers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransfer: (id) => request(`/transfers/${id}`, { method: 'DELETE' }),

  // Visas
  getVisas: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/visas${query ? `?${query}` : ''}`);
  },
  createVisa: (data) => request('/visas', { method: 'POST', body: JSON.stringify(data) }),
  updateVisa: (id, data) => request(`/visas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVisa: (id) => request(`/visas/${id}`, { method: 'DELETE' }),

  // Groups & Manifest
  getGroups: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/groups${query ? `?${query}` : ''}`);
  },
  getGroup: (id) => request(`/groups/${id}`),
  createGroup: (data) => request('/groups', { method: 'POST', body: JSON.stringify(data) }),
  updateGroup: (id, data) => request(`/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGroup: (id) => request(`/groups/${id}`, { method: 'DELETE' }),
  getGroupManifest: (id) => request(`/groups/${id}/manifest`),

  // Ziyarat Tours
  getZiyaratTours: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/ziyarat${query ? `?${query}` : ''}`);
  },
  createZiyaratTour: (data) => request('/ziyarat', { method: 'POST', body: JSON.stringify(data) }),
  updateZiyaratTour: (id, data) => request(`/ziyarat/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteZiyaratTour: (id) => request(`/ziyarat/${id}`, { method: 'DELETE' }),

  // Accounts & Finance
  getChartOfAccounts: () => request('/accounts/chart'),
  getProfitAndLoss: () => request('/accounts/profit-loss'),
  getBalanceSheet: () => request('/accounts/balance-sheet'),

  // Expenses
  getExpenses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/expenses${query ? `?${query}` : ''}`);
  },
  createExpense: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/payments${query ? `?${query}` : ''}`);
  },
  getReceipt: (id) => request(`/payments/${id}/receipt`),
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),
  deletePayment: (id) => request(`/payments/${id}`, { method: 'DELETE' }),

  // Suppliers
  getSuppliers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/suppliers${query ? `?${query}` : ''}`);
  },
  createSupplier: (data) => request('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  paySupplier: (id, data) => request(`/suppliers/${id}/pay`, { method: 'POST', body: JSON.stringify(data) }),
  deleteSupplier: (id) => request(`/suppliers/${id}`, { method: 'DELETE' }),

  // Staff
  getStaff: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/staff${query ? `?${query}` : ''}`);
  },
  createStaff: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),

  // Agents
  getAgents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/agents${query ? `?${query}` : ''}`);
  },
  createAgent: (data) => request('/agents', { method: 'POST', body: JSON.stringify(data) }),
  payoutAgent: (id, data) => request(`/agents/${id}/payout`, { method: 'POST', body: JSON.stringify(data) }),
  deleteAgent: (id) => request(`/agents/${id}`, { method: 'DELETE' }),

  // Bookings
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/bookings${query ? `?${query}` : ''}`);
  },
  getBooking: (id) => request(`/bookings/${id}`),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id, data) => request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),

  // Documents
  getVoucherDoc: (bookingId) => request(`/documents/voucher/${bookingId}`),
  getPilgrimCardDoc: (pilgrimId) => request(`/documents/pilgrim-card/${pilgrimId}`),
  getItineraryDoc: (bookingId) => request(`/documents/itinerary/${bookingId}`),

  // Portal
  portalLookup: (query) => request(`/portal/lookup?query=${encodeURIComponent(query)}`),

  // Branches
  getBranches: () => request('/branches'),
  createBranch: (data) => request('/branches', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'POST' }),

  // Reports
  getReportsSales: () => request('/reports/sales'),
  getReportsReceivables: () => request('/reports/receivables'),
  getReportsPayables: () => request('/reports/payables'),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Audit & Backup
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audit${query ? `?${query}` : ''}`);
  },
  downloadBackupUrl: '/api/audit/backup',
  restoreBackup: (data) => request('/audit/restore', { method: 'POST', body: JSON.stringify(data) }),

  // Image & Document Uploads
  uploadFile: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const token = localStorage.getItem('harmain_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: fd
    });
    return res.json();
  },
  uploadBase64: (base64Data) => request('/upload', { method: 'POST', body: JSON.stringify({ base64Data }) })
};
