const storage = require('../db/storageEngine');

function auditLogger(moduleName) {
  return (req, res, next) => {
    // Only log modifying actions: POST, PUT, DELETE, PATCH
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const originalSend = res.send;
      res.send = function (data) {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const userIdentifier = req.user ? `${req.user.email} (${req.user.name})` : 'System / Portal Client';
            const logEntry = {
              action: `${req.method}_${moduleName.toUpperCase()}`,
              module: moduleName.toUpperCase(),
              performedBy: userIdentifier,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
              details: `${req.method} request to ${req.originalUrl}`,
              timestamp: new Date().toISOString()
            };
            storage.insert('auditLogs', logEntry);
          }
        } catch (err) {
          console.error('Audit log recording error:', err);
        }
        return originalSend.apply(res, arguments);
      };
    }
    next();
  };
}

module.exports = auditLogger;
