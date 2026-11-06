const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const initializeDatabase = require('./db/initDb');

const app = express();

// Initialize data persistence and seed defaults
initializeDatabase();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(config.UPLOADS_DIR));

// Mount ERP API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/pilgrims', require('./routes/pilgrim.routes'));
app.use('/api/packages', require('./routes/package.routes'));
app.use('/api/flights', require('./routes/flight.routes'));
app.use('/api/pnrs', require('./routes/pnr.routes'));
app.use('/api/hotels', require('./routes/hotel.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/transport', require('./routes/transport.routes'));
app.use('/api/transfers', require('./routes/transfer.routes'));
app.use('/api/visas', require('./routes/visa.routes'));
app.use('/api/groups', require('./routes/group.routes'));
app.use('/api/ziyarat', require('./routes/ziyarat.routes'));
app.use('/api/accounts', require('./routes/account.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/suppliers', require('./routes/supplier.routes'));
app.use('/api/staff', require('./routes/staff.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/documents', require('./routes/document.routes'));
app.use('/api/portal', require('./routes/portal.routes'));
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/settings', require('./routes/setting.routes'));
app.use('/api/audit', require('./routes/audit.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'HARMAIN ERP',
    tagline: 'ONE PLATFORM. EVERY JOURNEY.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend in Production
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[HARMAIN ERP Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Enterprise Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  HARMAIN ERP Server running on http://localhost:${PORT}`);
  console.log(`  ONE PLATFORM. EVERY JOURNEY.`);
  console.log(`====================================================`);
});
