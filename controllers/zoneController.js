const zoneService = require('../services/zoneService');

exports.list = async (req, res) => {
  const zones = await zoneService.findAll();
  res.render('zones/zones', { zones, activePage: 'zones' });
};

exports.newForm = (req, res) => {
  res.render('zones/new', { activePage: 'zones', csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {
  try {
    await zoneService.create({
      nom: req.body.nom,
    });
    res.redirect('/zones');
  } catch (err) {
    res.status(500).send('Erreur création zone: ' + err.message);
  }
};

exports.editForm = async (req, res) => {
  const zone = await zoneService.findById(req.params.id);
  if (!zone) return res.status(404).send('Zone non trouvée');
  res.render('zones/edit', { zone, activePage: 'zones', csrfToken: req.csrfToken() });
};

exports.update = async (req, res) => {
  try {
    await zoneService.update(req.params.id, {
      nom: req.body.nom,
    });
    res.redirect('/zones');
  } catch (err) {
    res.status(500).send('Erreur mise à jour zone: ' + err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await zoneService.delete(req.params.id);
    res.redirect('/zones');
  } catch (err) {
    res.status(500).send('Erreur suppression zone: ' + err.message);
  }
};