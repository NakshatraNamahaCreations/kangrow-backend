// controllers/bannerController.js
const fs = require('fs');
const Banner = require('../models/bannerModel');

exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const relativePath = `uploads/banners/${req.file.filename}`; // ✅ Always relative

    const banner = new Banner({
      imagePath: relativePath,
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: 'Banner uploaded successfully',
      banner: {
        ...banner.toObject(),
        imageUrl: `${req.protocol}://${req.get('host')}/${relativePath}`, // ✅ Return full URL
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    const bannersWithUrl = banners.map((b) => ({
      ...b.toObject(),
      imageUrl: `${req.protocol}://${req.get('host')}/${b.imagePath}`, // ✅ Add URL
    }));
    res.status(200).json({ success: true, banners: bannersWithUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    // Delete file from uploads
    if (fs.existsSync(banner.imagePath)) {
      fs.unlinkSync(banner.imagePath);
    }

    await Banner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
