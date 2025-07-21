const jwt = require("jsonwebtoken");

// ✅ Token Verify Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// ✅ Only HR Role Access Middleware
const requireHR = (req, res, next) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied. HRs only." });
  }
  next();
};

module.exports = {
  verifyToken,
  requireHR
};
