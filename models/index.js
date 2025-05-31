const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require('./user.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Category = require('./category.model')(sequelize, Sequelize);
db.Material = require('./material.model')(sequelize, Sequelize);
db.Cart = require('./cart.model')(sequelize, Sequelize);
db.Order = require('./order.model')(sequelize, Sequelize);
db.Payment = require('./payment.model')(sequelize, Sequelize);
db.Voucher = require('./voucher.model')(sequelize, Sequelize);
db.Feedback = require('./feedback.model')(sequelize, Sequelize);
//db.Shipping = require('./shipping.model')(sequelize, Sequelize);
//db.Return = require('./return.model')(sequelize, Sequelize);
// Load associations
require('./associations')(db);

module.exports = db;
