// models/instituteModel.js
const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: [true, 'Institute name is required'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Institute', instituteSchema);
