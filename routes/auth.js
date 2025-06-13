const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // À remplacer par une vraie vérification en base de données
  if (email === 'admin@example.com' && password === 'password') {
    req.session.user = {
      id: 1,
      email,
      role: 'SUPERADMIN'
    };
    return res.redirect('/dashboard');
  }
  res.status(401).send('Identifiants invalides');
});

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;