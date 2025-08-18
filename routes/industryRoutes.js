// routes/industryRoutes.js
const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');

router.post('/create', industryController.createIndustry);
router.get('/', industryController.getAllIndustries);
router.put('/update/:id', industryController.updateIndustry);
router.delete('/delete/:id', industryController.deleteIndustry);
router.get('/count', industryController.countIndustries);

module.exports = router;
