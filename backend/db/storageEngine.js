const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure data and uploads directory exist
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}
if (!fs.existsSync(config.UPLOADS_DIR)) {
  fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });
}

class StorageEngine {
  constructor() {
    this.dataDir = config.DATA_DIR;
    this.cache = new Map();
    this.counters = {};
    this.initCounters();
  }

  getFilePath(collectionName) {
    return path.join(this.dataDir, `${collectionName}.json`);
  }

  initCounters() {
    const counterFile = path.join(this.dataDir, '_counters.json');
    if (fs.existsSync(counterFile)) {
      try {
        this.counters = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
      } catch (e) {
        this.counters = {};
      }
    } else {
      this.counters = {
        booking: 1001,
        pilgrim: 1001,
        invoice: 1001,
        receipt: 1001,
        voucher: 1001,
        visa: 1001,
        group: 101,
        journal: 5001
      };
      this.saveCounters();
    }
  }

  saveCounters() {
    const counterFile = path.join(this.dataDir, '_counters.json');
    fs.writeFileSync(counterFile, JSON.stringify(this.counters, null, 2), 'utf8');
  }

  getNextId(type, prefix) {
    if (!this.counters[type]) {
      this.counters[type] = 1001;
    }
    const num = this.counters[type]++;
    this.saveCounters();
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${String(num).padStart(4, '0')}`;
  }

  loadCollection(collectionName) {
    if (this.cache.has(collectionName)) {
      return this.cache.get(collectionName);
    }
    const filePath = this.getFilePath(collectionName);
    let items = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        items = JSON.parse(raw);
      } catch (err) {
        console.error(`Error reading ${collectionName}.json:`, err);
        items = [];
      }
    }
    this.cache.set(collectionName, items);
    return items;
  }

  persistCollection(collectionName) {
    const filePath = this.getFilePath(collectionName);
    const items = this.cache.get(collectionName) || [];
    // Atomic write using temporary file to prevent corruption
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(items, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  }

  find(collectionName, filter = {}) {
    const items = this.loadCollection(collectionName);
    return items.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (value === undefined || value === null || value === '') continue;
        if (typeof value === 'object' && value !== null) {
          if (value.$regex) {
            const re = new RegExp(value.$regex, value.$options || 'i');
            if (!re.test(String(item[key] || ''))) return false;
          } else if (value.$in && Array.isArray(value.$in)) {
            if (!value.$in.includes(item[key])) return false;
          } else if (value.$gte !== undefined && item[key] < value.$gte) {
            return false;
          } else if (value.$lte !== undefined && item[key] > value.$lte) {
            return false;
          }
        } else if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  findOne(collectionName, filter = {}) {
    const results = this.find(collectionName, filter);
    return results.length > 0 ? results[0] : null;
  }

  findById(collectionName, id) {
    const items = this.loadCollection(collectionName);
    return items.find(item => item.id === id || item._id === id) || null;
  }

  insert(collectionName, doc) {
    const items = this.loadCollection(collectionName);
    const now = new Date().toISOString();
    const newDoc = {
      id: doc.id || doc._id || 'id_' + Math.random().toString(36).substr(2, 9),
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: now
    };
    items.unshift(newDoc);
    this.persistCollection(collectionName);
    return newDoc;
  }

  insertMany(collectionName, docs) {
    const items = this.loadCollection(collectionName);
    const now = new Date().toISOString();
    const created = docs.map(doc => ({
      id: doc.id || doc._id || 'id_' + Math.random().toString(36).substr(2, 9),
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: now
    }));
    items.push(...created);
    this.persistCollection(collectionName);
    return created;
  }

  update(collectionName, id, updates) {
    const items = this.loadCollection(collectionName);
    const index = items.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: now
    };
    this.persistCollection(collectionName);
    return items[index];
  }

  delete(collectionName, id) {
    const items = this.loadCollection(collectionName);
    const index = items.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    this.persistCollection(collectionName);
    return true;
  }

  count(collectionName, filter = {}) {
    return this.find(collectionName, filter).length;
  }

  // Backup entire database to a single JSON payload
  createBackup() {
    const collections = [
      'users', 'pilgrims', 'bookings', 'packages', 'flights', 'pnrs',
      'hotels', 'rooms', 'vehicles', 'drivers', 'transfers', 'visas',
      'groups', 'ziyarat', 'accounts', 'transactions', 'expenses',
      'payments', 'suppliers', 'staff', 'agents', 'branches',
      'notifications', 'settings', 'auditLogs'
    ];
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      appName: 'HARMAIN ERP',
      data: {}
    };
    for (const col of collections) {
      backupData.data[col] = this.loadCollection(col);
    }
    backupData.counters = this.counters;
    return backupData;
  }

  restoreBackup(backupData) {
    if (!backupData || !backupData.data) throw new Error('Invalid backup file');
    for (const [col, items] of Object.entries(backupData.data)) {
      this.cache.set(col, items);
      this.persistCollection(col);
    }
    if (backupData.counters) {
      this.counters = backupData.counters;
      this.saveCounters();
    }
    return true;
  }
}

const storage = new StorageEngine();
module.exports = storage;
