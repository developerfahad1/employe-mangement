const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // ✅ Using bcryptjs for hashing & comparing
const jwt = require("jsonwebtoken");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //  Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    //  Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //  provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //jwt token generate karo or login karo
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    
    res.status(200).json({
      message: "Login successful",
      token : token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
