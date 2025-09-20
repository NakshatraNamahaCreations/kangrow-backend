const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/get', userController.getAllUsers);
router.post('/bulk-upload', upload.single('file'), userController.bulkUploadUsers);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.get("/status/:userId", userController.getUserStatus);

module.exports = router;