const AdminModel = require('../models/adminModel');

module.exports = {
  findAll: () => AdminModel.findAll(),
  findById: (id) => AdminModel.findByPk(id),
  findByEmail: (email) => AdminModel.findOne({ where: { email } }),
  create: (data) => AdminModel.create(data),
  update: (id, data) => AdminModel.update(data, { where: { id } }),
  delete: (id) => AdminModel.destroy({ where: { id } }),
};