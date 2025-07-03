const apService = require('../services/apService');

exports.list = async (req, res) => {
  const aps = await apService.findAll();
  res.render('aps/aps', { aps, activePage: 'aps' });
};

exports.newForm = (req, res) => {
  res.render('aps/new', { activePage: 'aps', csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {
  try {
    await apService.create({
      nom: req.body.nom,
    });
    res.redirect('/aps');
  } catch (err) {
    res.status(500).send('Erreur création ap: ' + err.message);
  }
};

exports.editForm = async (req, res) => {
  const ap = await apService.findById(req.params.id);
  if (!ap) return res.status(404).send('ap non trouvée');
  res.render('aps/edit', { ap, activePage: 'aps', csrfToken: req.csrfToken() });
};

exports.update = async (req, res) => {
  try {
    await apService.update(req.params.id, {
      nom: req.body.nom,
    });
    res.redirect('/aps');
  } catch (err) {
    res.status(500).send('Erreur mise à jour ap: ' + err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await apService.delete(req.params.id);
    res.redirect('/aps');
  } catch (err) {
    res.status(500).send('Erreur suppression ap: ' + err.message);
  }
};