// models/industryModel.js
const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  industryName: {
    type: String,
    required: [true, 'Industry name is required'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Industry', industrySchema);
