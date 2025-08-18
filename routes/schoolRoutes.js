// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.post('/create', schoolController.createSchool);
router.get('/', schoolController.getAllSchools);
router.put('/update/:id', schoolController.updateSchool);
router.delete('/delete/:id', schoolController.deleteSchool);
router.get('/count', schoolController.countSchools);

module.exports = router;
