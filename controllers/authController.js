const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  console.log('POST /login appelé');
  const emailInput = req.body.email.trim().toLowerCase();
  const password = req.body.password;
  console.log('Tentative de connexion avec :', emailInput);

  if (!req.session.loginAttempts) req.session.loginAttempts = 0;
  if (!req.session.lastAttempt) req.session.lastAttempt = Date.now();

  // (0.5s, 1s, 2s, 5s, etc.)
  const delays = [500, 1000, 2000, 5000, 10000]; // en ms
  const delay = delays[Math.min(req.session.loginAttempts, delays.length - 1)];
  const now = Date.now();

  // if (now - req.session.lastAttempt < delay) {
  //   return res.status(429).send(`Trop de tentatives. Réessayez dans ${Math.ceil((delay - (now - req.session.lastAttempt))/1000)}s`);
  // }
  req.session.lastAttempt = now;

  const admin = await Admin.findOne({ where: { email: emailInput } });
  console.log('Admin trouvé :', admin);

  if (!admin) {
    return res.status(401).send('Tentative de connexion : Admin non trouvé');
  }
  const isValid = await bcrypt.compare(password, admin.passwordHash);

  if (isValid) {
    req.session.user = {
      id: admin.id,
      email: admin.email,
      prenom: admin.prenom,
      nom: admin.nom,
      role: admin.role
    };
    console.log('User data:', req.session.user);
    req.session.loginAttempts = 0;

    if (admin.role === 'SUPERADMIN') {
      return res.redirect('/admins');
    }
    return res.redirect('/dashboard');
  } else {
    req.session.loginAttempts += 1;
    return res.status(401).send('Identifiants invalides');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};