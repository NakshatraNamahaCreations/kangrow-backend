// models/userReportModel.js
const mongoose = require('mongoose');

const userReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userUniqueId: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    enum: ['Blood Test and Urine Analysis', 'Physical Characteristics'],
    required: true,
  },
    category: { type: String, required: true }, // ✅ added
  entity: { type: String, required: true },   // ✅ added
  fileName: String,   
 filePath: {
    type: String,
    get: (filePath) => filePath.replace(/\\/g, '/'), 
  },
  mimeType: String,
  size: Number,
}, { timestamps: true });

module.exports = mongoose.model('UserReport', userReportSchema);
