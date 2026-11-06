const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/harmain_erp',
  JWT_SECRET: process.env.JWT_SECRET || 'HARMAIN_ERP_ENTERPRISE_SECRET_KEY_2026',
  JWT_EXPIRES_IN: '7d',
  DATA_DIR: path.join(__dirname, 'data'),
  UPLOADS_DIR: path.join(__dirname, 'uploads'),
  DEFAULT_CURRENCIES: {
    PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rateToPKR: 1 },
    SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rateToPKR: 74.50 },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToPKR: 278.50 }
  }
};
