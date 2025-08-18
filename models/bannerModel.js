// models/bannerModel.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: [true, 'Banner image is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
