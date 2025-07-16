const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1️⃣ Token get karo request ke header se
  const authHeader = req.header("Authorization");

  // 2️⃣ Check karo ke token available hai ya nahi
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // 3️⃣ Token ko extract karo
  const token = authHeader.split(" ")[1]; // 👈 Only the actual token

  try {
    // 4️⃣ Token ko verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Decoded data ko req.user me save karo
    req.user = decoded;

    // 6️⃣ Next middleware ya route handler chalao
    next();

  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// ✅ HR role check karne wala middleware
const requireHR = (req, res, next) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied. HRs only." });
  }
  next();
};

module.exports = { verifyToken, requireHR };
