const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
  res.render('login');
});

const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt'); // si tu utilises le hash

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });
  if (admin && password === admin.passwordHash) { // ou bcrypt.compare(password, admin.passwordHash)
    req.session.user = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };
    return res.redirect('/dashboard');
  }
  res.status(401).send('Identifiants invalides');
});

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;



// router.post('/login', async (req, res) => {
//   // Initialisation des variables de session si besoin
//   if (!req.session.loginAttempts) req.session.loginAttempts = 0;
//   if (!req.session.lastAttempt) req.session.lastAttempt = Date.now();

//   // Calcul du délai à appliquer (0.5s, 1s, 2s, 5s, etc.)
//   const delays = [500, 1000, 2000, 5000, 10000]; // en ms
//   const delay = delays[Math.min(req.session.loginAttempts, delays.length - 1)];
//   const now = Date.now();

//   if (now - req.session.lastAttempt < delay) {
//     return res.status(429).send(`Trop de tentatives. Réessaie dans ${Math.ceil((delay - (now - req.session.lastAttempt))/1000)}s`);
//   }

//   req.session.lastAttempt = now;

//   // ... logique de login ...
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ where: { email } });
//   const isValid = admin && await bcrypt.compare(password, admin.passwordHash);

//   if (isValid) {
//     req.session.user = { id: admin.id, email: admin.email, role: admin.role };
//     req.session.loginAttempts = 0; // reset
//     return res.redirect('/dashboard');
//   } else {
//     req.session.loginAttempts += 1;
//     return res.status(401).send('Identifiants invalides');
//   }
// });