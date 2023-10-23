const express = require('express');
const userController = require('../../controllers/user');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.patch('/avatars', authMiddleware, userController.updateUserAvatar);

module.exports = router;
