const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetController');

router.get('/reset-password/:resetToken', resetController.renderResetPasswordPage);
router.post('/reset-password', resetController.resetPassword);
router.post('/forgot-password', resetController.forgotPassword); 

module.exports = router;
