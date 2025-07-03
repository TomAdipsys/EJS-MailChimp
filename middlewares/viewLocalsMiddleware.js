// Middleware pour rendre user/csrfToken accessibles partout
function viewLocals(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.csrfToken = (typeof req.csrfToken === 'function') ? req.csrfToken() : null;
  next();
}
module.exports = viewLocals; 