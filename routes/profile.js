const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, (req, res) => {
  res.render('profile', { activePage: 'profile' });
});

module.exports = router;