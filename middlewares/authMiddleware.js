function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function isSuperAdmin(req, res, next) {
  console.log('isSuperAdmin:', req.session.user);
  if (req.session.user && req.session.user.role === 'SUPERADMIN') {
    return next();
  }
  res.status(403).send('Accès interdit');
}

module.exports = { isAuthenticated, isSuperAdmin };