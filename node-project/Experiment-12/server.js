const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
const LOCK_TTL_MS = 60 * 1000;

const seats = new Map();

const NUM_SEATS = 20;
for (let i = 1; i <= NUM_SEATS; i++) {
  seats.set(String(i), { id: String(i), status: 'available' });
}

function expireLock(seatId) {
  const seat = seats.get(String(seatId));
  if (!seat) return;
  if (seat.status === 'locked') {
    if (!seat.lockExpiresAt || seat.lockExpiresAt <= Date.now()) {
      seat.status = 'available';
      delete seat.lockOwner;
      delete seat.lockToken;
      delete seat.lockExpiresAt;
      if (seat.lockTimer) {
        clearTimeout(seat.lockTimer);
        delete seat.lockTimer;
      }
      console.log(`Lock expired: seat ${seatId}`);
    }
  }
}

app.get('/seats', (req, res) => {
  const list = Array.from(seats.values()).map(s => {
    const out = { ...s };
    delete out.lockToken;
    delete out.lockTimer;
    return out;
  });
  res.json({ seats: list });
});

app.get('/seat/:id', (req, res) => {
  const seat = seats.get(req.params.id);
  if (!seat) return res.status(404).json({ error: 'Seat not found' });
  const out = { ...seat };
  delete out.lockToken;
  delete out.lockTimer;
  res.json(out);
});

app.post('/lock', (req, res) => {
  const { seatId, userId } = req.body;
  if (!seatId || !userId) return res.status(400).json({ error: 'seatId and userId are required' });

  const seat = seats.get(String(seatId));
  if (!seat) return res.status(404).json({ error: 'Seat not found' });

  if (seat.status === 'booked') {
    return res.status(409).json({ error: 'Seat already booked' });
  }

  if (seat.status === 'locked') {
    if (seat.lockExpiresAt && seat.lockExpiresAt > Date.now()) {
      return res.status(409).json({
        error: 'Seat is currently locked by another user',
        lockedUntil: new Date(seat.lockExpiresAt).toISOString(),
        lockOwner: seat.lockOwner
      });
    } else {
      if (seat.lockTimer) {
        clearTimeout(seat.lockTimer);
        delete seat.lockTimer;
      }
      seat.status = 'available';
      delete seat.lockOwner;
      delete seat.lockToken;
      delete seat.lockExpiresAt;
    }
  }

  const token = uuidv4();
  seat.status = 'locked';
  seat.lockOwner = userId;
  seat.lockToken = token;
  seat.lockExpiresAt = Date.now() + LOCK_TTL_MS;
  if (seat.lockTimer) clearTimeout(seat.lockTimer);
  seat.lockTimer = setTimeout(() => expireLock(String(seatId)), LOCK_TTL_MS);

  res.json({
    message: 'Seat locked',
    seatId: seat.id,
    lockOwner: seat.lockOwner,
    lockExpiresAt: new Date(seat.lockExpiresAt).toISOString(),
    lockToken: token
  });
});

app.post('/confirm', (req, res) => {
  const { seatId, userId, lockToken } = req.body;
  if (!seatId || !userId || !lockToken) return res.status(400).json({ error: 'seatId, userId and lockToken are required' });

  const seat = seats.get(String(seatId));
  if (!seat) return res.status(404).json({ error: 'Seat not found' });

  if (seat.status !== 'locked') return res.status(409).json({ error: 'Seat is not locked' });

  if (seat.lockExpiresAt && seat.lockExpiresAt <= Date.now()) {
    if (seat.lockTimer) clearTimeout(seat.lockTimer);
    seat.status = 'available';
    delete seat.lockOwner; delete seat.lockToken; delete seat.lockExpiresAt; delete seat.lockTimer;
    return res.status(410).json({ error: 'Lock expired' });
  }

  if (seat.lockOwner !== userId || seat.lockToken !== lockToken) {
    return res.status(403).json({ error: 'Invalid lock owner or token' });
  }

  seat.status = 'booked';
  seat.bookedBy = userId;
  seat.bookedAt = new Date().toISOString();
  if (seat.lockTimer) { clearTimeout(seat.lockTimer); delete seat.lockTimer; }
  delete seat.lockOwner;
  delete seat.lockToken;
  delete seat.lockExpiresAt;

  res.json({ message: 'Seat booked', seatId: seat.id, bookedBy: seat.bookedBy, bookedAt: seat.bookedAt });
});

app.post('/unlock', (req, res) => {
  const { seatId, userId, lockToken } = req.body;
  if (!seatId || !userId) return res.status(400).json({ error: 'seatId and userId are required' });
  const seat = seats.get(String(seatId));
  if (!seat) return res.status(404).json({ error: 'Seat not found' });
  if (seat.status !== 'locked') return res.status(409).json({ error: 'Seat is not locked' });
  if (seat.lockOwner !== userId || (lockToken && seat.lockToken !== lockToken)) {
    return res.status(403).json({ error: 'Not authorized to unlock this seat' });
  }

  if (seat.lockTimer) clearTimeout(seat.lockTimer);
  seat.status = 'available';
  delete seat.lockOwner; delete seat.lockToken; delete seat.lockExpiresAt; delete seat.lockTimer;
  res.json({ message: 'Lock released' });
});

app.listen(PORT, () => console.log(`Seat-lock server running on http://localhost:${PORT}`));
