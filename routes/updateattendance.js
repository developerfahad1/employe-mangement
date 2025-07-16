// routes/updateAttendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const { verifyToken, requireHR } = require('../middleware/authMiddleware');

// ✅ Attendance update route (only HR allowed)
router.put('/update/:id', verifyToken, requireHR, async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(200).json({
      message: 'Attendance updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating attendance', error: err.message });
  }
});

module.exports = router;
