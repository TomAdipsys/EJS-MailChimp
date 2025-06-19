const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role === 'SUPERADMIN') {
    return res.redirect('/admins');
  }
});
module.exports = router;