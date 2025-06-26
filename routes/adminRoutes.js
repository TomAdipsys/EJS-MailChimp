const express = require('express');
const router = express.Router();

// Middlewares
const isAuthenticated = require('../middlewares/isAuthenticated');
const isSuperAdmin = require('../middlewares/isSuperAdmin');

const accountController = require('../controllers/accountController');
const zoneController = require('../controllers/zoneController');
const apController = require('../controllers/apController');
const tagController = require('../controllers/tagController');
const userController = require('../controllers/userController');
const apiConfigController = require('../controllers/apiConfigController');
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/dashboard', isAuthenticated, accountController.dashboard);

// Account
router.get('/account', isAuthenticated, accountController.view);
router.post('/account/password', isAuthenticated, accountController.changePassword);

// Zones
router.get('/zones', isAuthenticated, zoneController.list);
router.post('/zones', isAuthenticated, zoneController.create);
router.put('/zones/:id', isAuthenticated, zoneController.update);
router.delete('/zones/:id', isAuthenticated, zoneController.delete);

// APs per zone
router.get('/zones/:zoneId/aps', isAuthenticated, apController.list);
router.post('/zones/:zoneId/aps', isAuthenticated, apController.create);
router.put('/zones/:zoneId/aps/:id', isAuthenticated, apController.update);
router.delete('/zones/:zoneId/aps/:id', isAuthenticated, apController.delete);
router.post('/zones/:zoneId/aps/import', isAuthenticated, apController.importCSV);

// Tags (Balises)
router.get('/zones/:zoneId/tags', isAuthenticated, tagController.list);
router.post('/zones/:zoneId/tags', isAuthenticated, tagController.create);
router.put('/zones/:zoneId/tags/:id', isAuthenticated, tagController.update);
router.delete('/zones/:zoneId/tags/:id', isAuthenticated, tagController.delete);

// Users per zone
router.get('/zones/:zoneId/users', isAuthenticated, userController.list);
router.delete('/zones/:zoneId/users/:mac', isAuthenticated, userController.delete);

// API Config per zone
router.get('/zones/:zoneId/api', isAuthenticated, apiConfigController.view);
router.post('/zones/:zoneId/api/unifi', isAuthenticated, apiConfigController.updateUnifi);
router.post('/zones/:zoneId/api/hm', isAuthenticated, apiConfigController.updateHM);
router.post('/zones/:zoneId/api/mailchimp', isAuthenticated, apiConfigController.updateMailchimp);

// Admins (only SUPERADMIN)
router.get('/admins', isSuperAdmin, adminController.list);
router.post('/admins', isSuperAdmin, adminController.create);
router.put('/admins/:id', isSuperAdmin, adminController.update);
router.delete('/admins/:id', isSuperAdmin, adminController.delete);

module.exports = router;
