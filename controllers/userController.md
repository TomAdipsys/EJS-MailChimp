const userService = require('../services/userService');

exports.list = async (req, res) => {
  const users = await userService.findAll();
  res.render('users/users', { users, activePage: 'users' });
};

exports.newForm = (req, res) => {
  res.render('users/new', { activePage: 'users', csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {
  try {
    await userService.create({
      nom: req.body.nom,
    });
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur création user: ' + err.message);
  }
};

exports.editForm = async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) return res.status(404).send('user non trouvée');
  res.render('users/edit', { user, activePage: 'users', csrfToken: req.csrfToken() });
};

exports.update = async (req, res) => {
  try {
    await userService.update(req.params.id, {
      nom: req.body.nom,
    });
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur mise à jour user: ' + err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur suppression user: ' + err.message);
  }
};