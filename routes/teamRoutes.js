// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/create', teamController.createTeamMember);
router.get('/', teamController.getAllTeamMembers);
router.post('/login', teamController.loginTeamMember);
router.put('/update/:id', teamController.updateTeamMember);
router.delete('/delete/:id', teamController.deleteTeamMember);

module.exports = router;
