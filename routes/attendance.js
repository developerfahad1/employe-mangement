const express = require("express");
const router = express.Router();
const { verifyToken, requireHR } = require('../middleware/authMiddleware');
const Attendance = require("../models/attendance");

// ✅ Attendance mark route
router.post("/mark", verifyToken, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    // ✅ Check if attendance is already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zero time for date match

    const alreadyMarked = await Attendance.findOne({
      user: req.user.userId,
      createdAt: { $gte: today }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked today" });
    }

    // ✅ Save new attendance
    const newAttendance = new Attendance({
      user: req.user.userId,
      status: status,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully!",
      data: newAttendance,
    });
  } catch (err) {
    res.status(500).json({ message: "Error marking attendance", error: err.message });
  }
});

// ✅ GET attendance route (Protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ user: req.user.userId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json({
      message: 'Attendance records fetched successfully',
      data: attendanceRecords
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
});

// ✅ Delete attendance (HR only)
router.delete('/:id', verifyToken, requireHR, async (req, res) => {
  try {
    const attendanceId = req.params.id;

    const deleted = await Attendance.findByIdAndDelete(attendanceId);

    if (!deleted) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(200).json({
      message: 'Attendance deleted successfully',
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting attendance', error: err.message });
  }
});

module.exports = router;
