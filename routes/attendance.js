const express = require("express");
const router = express.Router(); // ✅ spelling fixed
const { verifyToken, requireHR } = require('../middleware/authMiddleware'); // ✅ Correct
const Attendance = require("../models/attendance");

// ✅ Attendance mark route
router.post("/mark", verifyToken, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const newAttendance = new Attendance({
      user: req.user.userId, // ✅ spelling fixed
      status: status,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully!",
      data: newAttendance,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: err.message });
  }
});




// GET attendance route (Protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Current logged-in user ka data fetch karo
    const attendanceRecords = await Attendance.find({ user: req.user.userId }).populate('user', 'name email role');

    res.status(200).json({
      message: 'Attendance records fetched successfully',
      data: attendanceRecords
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
});



// delete attendance only hr delete karsakta ha ya wo route ha 

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
