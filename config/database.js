const { Sequelize } = require('sequelize');
//thay bằng sql
const sequelize = new Sequelize('E-com', 'postgres', '29012004', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;