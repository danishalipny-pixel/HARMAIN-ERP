const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('rooms'));

// GET /api/rooms
router.get('/', (req, res) => {
  const { hotelId, status, type } = req.query;
  let items = storage.loadCollection('rooms');

  if (hotelId) {
    items = items.filter(r => r.hotelId === hotelId);
  }
  if (status) {
    items = items.filter(r => r.status === status);
  }
  if (type) {
    items = items.filter(r => r.type && r.type.toLowerCase().includes(type.toLowerCase()));
  }

  return res.json({ success: true, count: items.length, rooms: items });
});

// POST /api/rooms
router.post('/', (req, res) => {
  const capacity = parseInt(req.body.capacity || 2, 10);
  const newRoom = {
    hotelId: req.body.hotelId,
    hotelName: req.body.hotelName || 'Hotel',
    roomNumber: String(req.body.roomNumber),
    floor: parseInt(req.body.floor || 1, 10),
    type: req.body.type || 'Double',
    capacity,
    occupiedBeds: 0,
    assignedPilgrims: [],
    checkInDate: req.body.checkInDate || '',
    checkOutDate: req.body.checkOutDate || '',
    status: 'Available'
  };

  const created = storage.insert('rooms', newRoom);
  return res.status(201).json({ success: true, message: 'Room created', room: created });
});

// POST /api/rooms/allocate
router.post('/allocate', (req, res) => {
  const { roomId, pilgrimId } = req.body;
  if (!roomId || !pilgrimId) {
    return res.status(400).json({ success: false, message: 'Room ID and Pilgrim ID required' });
  }

  const room = storage.findById('rooms', roomId);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

  const pilgrim = storage.findById('pilgrims', pilgrimId);
  if (!pilgrim) return res.status(404).json({ success: false, message: 'Pilgrim not found' });

  if (room.occupiedBeds >= room.capacity) {
    return res.status(400).json({ success: false, message: 'Room has reached maximum bed capacity!' });
  }

  // Check gender segregation for non-empty rooms
  if (room.assignedPilgrims && room.assignedPilgrims.length > 0) {
    const existingGenders = room.assignedPilgrims.map(p => p.gender);
    const hasDifferentGender = existingGenders.some(g => g !== pilgrim.gender);
    // If not a family booking, prevent male-female mixing in sharing room
    if (hasDifferentGender && (!pilgrim.mahramId && !room.assignedPilgrims.some(p => p.pilgrimId === pilgrim.mahramId))) {
      return res.status(400).json({
        success: false,
        message: 'Islamic Gender Segregation Alert: Cannot place male and female pilgrims in the same sharing room without confirmed Mahram relationship.'
      });
    }
  }

  // Allocate bed
  const assigned = room.assignedPilgrims || [];
  assigned.push({
    pilgrimId: pilgrim.id,
    name: pilgrim.fullName,
    gender: pilgrim.gender
  });

  const occupiedBeds = assigned.length;
  const status = occupiedBeds >= room.capacity ? 'Occupied' : 'Partially Available';

  const updatedRoom = storage.update('rooms', room.id, {
    assignedPilgrims: assigned,
    occupiedBeds,
    status
  });

  // Update pilgrim profile with hotel & room
  if (room.hotelName.toLowerCase().includes('makkah')) {
    storage.update('pilgrims', pilgrim.id, { makkahHotel: room.hotelName, makkahRoomNo: room.roomNumber });
  } else {
    storage.update('pilgrims', pilgrim.id, { madinahHotel: room.hotelName, madinahRoomNo: room.roomNumber });
  }

  return res.json({ success: true, message: `Bed allocated to ${pilgrim.fullName}`, room: updatedRoom });
});

// POST /api/rooms/deallocate
router.post('/deallocate', (req, res) => {
  const { roomId, pilgrimId } = req.body;
  const room = storage.findById('rooms', roomId);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

  const assigned = (room.assignedPilgrims || []).filter(p => p.pilgrimId !== pilgrimId);
  const occupiedBeds = assigned.length;
  const status = occupiedBeds === 0 ? 'Available' : 'Partially Available';

  const updatedRoom = storage.update('rooms', room.id, {
    assignedPilgrims: assigned,
    occupiedBeds,
    status
  });

  return res.json({ success: true, message: 'Bed deallocated', room: updatedRoom });
});

// PUT /api/rooms/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('rooms', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Room not found' });
  return res.json({ success: true, message: 'Room updated', room: updated });
});

// DELETE /api/rooms/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('rooms', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Room not found' });
  return res.json({ success: true, message: 'Room deleted' });
});

module.exports = router;
