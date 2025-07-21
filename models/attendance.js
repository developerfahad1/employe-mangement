const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true
  }
}, { timestamps: true }); // ✅ yeh line add ki gayi hai

module.exports = mongoose.model('Attendance', attendanceSchema);
