// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const bannerController = require('../controllers/bannerController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/banners/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), bannerController.uploadBanner);
router.get('/', bannerController.getBanners);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
