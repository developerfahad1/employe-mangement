const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ fixed import

// 🔐 Protected route
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected dashboard accessed",
    user: req.user // 👈 JWT decoded data
  });
});

module.exports = router;
