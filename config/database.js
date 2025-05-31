const { Sequelize } = require('sequelize');
//thay bằng sql

const db_host = process.env.DB_HOST;
const db_password = process.env.DB_PASSWORD;
console.log(db_host);

const sequelize = new Sequelize('defaultdb', 'avnadmin', db_password, {
  host: db_host,
  port: 14694,
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối database thành công!');
  })
  .catch(err => {
    console.error('❌ Kết nối thất bại:', err);
  });

module.exports = sequelize;