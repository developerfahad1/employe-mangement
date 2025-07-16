const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
    // ✅ This must be here
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["hr", "employee"],
    default: "employee",
  },

  position: String,
  department: String,
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
