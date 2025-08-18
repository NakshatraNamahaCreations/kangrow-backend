// routes/instituteRoutes.js
const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');

router.post('/create', instituteController.createInstitute);
router.get('/', instituteController.getAllInstitutes);
router.put('/update/:id', instituteController.updateInstitute);
router.delete('/delete/:id', instituteController.deleteInstitute);
router.get('/count', instituteController.countInstitutes);

module.exports = router;
