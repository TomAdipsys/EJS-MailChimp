const sequelize = require('./db');
const Admin = require('../../admin');

async function init() {
  await sequelize.sync({ alter: true });
  console.log('Tables synchronisées');
}

init();
