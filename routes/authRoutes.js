const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router;