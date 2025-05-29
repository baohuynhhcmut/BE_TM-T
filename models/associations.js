// models/associations.js
module.exports = (db) => {
  const {
      User, Product, Category, Material,
      Cart, Order, Payment, Voucher, Feedback,
      Return, Shipping
  } = db;

  // User relations
  User.hasOne(Cart, { unique: true }); // 1 User has 1 Cart
  Cart.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasMany(Payment);
  Payment.belongsTo(User);

  User.belongsToMany(Voucher, { through: 'UserVoucher' });
  Voucher.belongsToMany(User, { through: 'UserVoucher' });

  // Product 
  Product.belongsTo(Category);
  Category.hasMany(Product);

  Product.belongsTo(Material);
  Material.hasMany(Product);

  //(1 User, 1 Product -> 1 Feedback, linked to Order)
  User.belongsToMany(Product, { through: 'Feedback', unique: true });
  Product.belongsToMany(User, { through: 'Feedback', unique: true });
  Feedback.belongsTo(Order); 

  // Cart 
  Cart.belongsToMany(Product, { through: 'CartProduct' });
  Product.belongsToMany(Cart, { through: 'CartProduct' });

  // Order 
  Order.belongsToMany(Product, { through: 'OrderProduct' });
  Product.belongsToMany(Order, { through: 'OrderProduct' });

  // Voucher 
  Voucher.belongsToMany(Order, { through: 'OrderVoucher' });
  Order.belongsToMany(Voucher, { through: 'OrderVoucher' });

  //  (1 Payment  to 1 Order)
  Payment.belongsTo(Order, { unique: true });
  Order.hasMany(Payment);

  // Return 
  Return.belongsTo(Payment);
  Payment.hasOne(Return);

  Return.belongsTo(Order);
  Order.hasMany(Return);

  // Shipping 
  Shipping.belongsTo(Order);
  Order.hasOne(Shipping);
};