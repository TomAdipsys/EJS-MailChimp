const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});
module.exports = router;