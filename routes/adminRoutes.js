// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');

// Multer for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/admins/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/register', upload.single('profilePicture'), adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.put('/update/:id', upload.single('profilePicture'), adminController.updateAdminProfile);

module.exports = router;
