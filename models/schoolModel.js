// models/schoolModel.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
