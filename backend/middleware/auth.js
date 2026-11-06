const jwt = require('jsonwebtoken');
const config = require('../config');
const storage = require('../db/storageEngine');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token, check if there's a guest or customer portal request or return 401
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = storage.findById('users', decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or inactive.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (req.user.role === 'Super Admin' || allowedRoles.includes(req.user.role) || allowedRoles.includes('*')) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Insufficient role permissions.' });
  };
}

module.exports = {
  authenticate,
  authorizeRoles
};
