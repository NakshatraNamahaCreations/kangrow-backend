// routes/userReportRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userReportController = require('../controllers/reportController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post(
  '/bulk-upload',
  upload.array('files', 20), 
  userReportController.bulkUploadUserReports
);
router.get("/", userReportController.getAllReports); // New endpoint
router.put("/update/:id", userReportController.updateReport);
router.get("/user/:userUniqueId", userReportController.getLatestReportByUserUniqueId);

router.delete('/:id', userReportController.deleteUserReport);


module.exports = router;
