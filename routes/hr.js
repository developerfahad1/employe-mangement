const express = require('express');
const router = express.Router();
const User = require("../models/user")
const { verifyToken, requireHR } = require('../middleware/authMiddleware'); // ✅ Import both middleware

// ✅ Only HR can access this
router.get("/dashboard", verifyToken, requireHR, (req, res) => {
  res.status(200).json({
    message: "Welcome HR!",
    user: req.user
  });
});


// ✅ Get all employees (Only HR can access this)
router.get("/employees", verifyToken, requireHR, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password"); // password hide
    res.status(200).json({
      message: "All employees fetched successfully",
      data: employees
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

module.exports = router;