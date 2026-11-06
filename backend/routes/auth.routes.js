const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storage = require('../db/storageEngine');
const config = require('../config');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = storage.findOne('users', { email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  const { passwordHash, ...safeUser } = user;

  // Log successful login
  storage.insert('auditLogs', {
    action: 'LOGIN_SUCCESS',
    module: 'AUTH',
    performedBy: `${user.email} (${user.name})`,
    ipAddress: req.ip || '127.0.0.1',
    details: `User logged in with role: ${user.role}`,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: 'Welcome to HARMAIN ERP',
    token,
    user: safeUser
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No active session' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = storage.findById('users', decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
});

// POST /api/auth/switch-role (Convenience role switcher for testing all personas)
router.post('/switch-role', (req, res) => {
  const { role } = req.body;
  const user = storage.findOne('users', { role });
  if (!user) {
    return res.status(404).json({ success: false, message: `No preconfigured user found for role: ${role}` });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
  const { passwordHash, ...safeUser } = user;
  return res.json({
    success: true,
    message: `Switched active role to ${role}`,
    token,
    user: safeUser
  });
});

module.exports = router;
