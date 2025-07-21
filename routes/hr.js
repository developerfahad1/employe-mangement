const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Attendance = require("../models/attendance"); // ✅ Required to fetch attendance

const { verifyToken, requireHR } = require('../middleware/authMiddleware'); // ✅ Import both middleware

// ✅ HR Dashboard Route (Fix: Fetch full HR info from DB)
router.get("/dashboard", verifyToken, requireHR, async (req, res) => {
  try {
    const hr = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      message: "Welcome HR!",
      user: hr
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch HR info", error: err.message });
  }
});


// ✅ Get all employees (Only HR can access this)
router.get("/employees", verifyToken, requireHR, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json({
      message: "All employees fetched successfully",
      data: employees
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// ✅ Get all attendance records (Only HR can access this)
router.get("/attendance", verifyToken, requireHR, async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All attendance records fetched successfully",
      data: records
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
});

module.exports = router;
