const express = require('express');
const userController = require('../../controllers/user');

const router = express.Router();

// Ендпоінт для верифікації електронної пошти
router.get('/verify/:verificationToken', userController.verifyEmail);

// Повторна відправка електронного листа для верифікації
router.post('/verify', userController.resendVerificationEmail);

module.exports = router;
