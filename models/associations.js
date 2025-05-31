// models/associations.js
module.exports = (db) => {
  const {
    User,
    Product,
    Category,
    Material,
    Cart,
    Order,
    Payment,
    Voucher,
    Feedback,
    OrderProduct,
    OrderVoucher,
    UserVoucher,
    CartProduct,
  } = db;

  // User relations
  User.hasOne(Cart, { unique: true }); // 1 User has 1 Cart
  Cart.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasMany(Payment);
  Payment.belongsTo(User);

  User.belongsToMany(Voucher, {
    through: UserVoucher,
    foreignKey: "UserId",
    otherKey: "VoucherId",
  });
  Voucher.belongsToMany(User, {
    through: UserVoucher,
    foreignKey: "VoucherId",
    otherKey: "UserId",
  });

  // Product
  Product.belongsTo(Category);
  Category.hasMany(Product);

  Product.belongsTo(Material);
  Material.hasMany(Product);

  //(1 User, 1 Product -> 1 Feedback, linked to Order)
  User.belongsToMany(Product, { through: "Feedback", unique: true });
  Product.belongsToMany(User, { through: "Feedback", unique: true });
  Feedback.belongsTo(Order);

  // Cart
  Cart.belongsToMany(Product, { through: CartProduct });
  Product.belongsToMany(Cart, { through: CartProduct });

  // Order
  Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: "OrderId",
    otherKey: "ProductId",
  });
  Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: "ProductId",
    otherKey: "OrderId",
  });

  // Voucher
  Voucher.belongsToMany(Order, {
    through: OrderVoucher,
    foreignKey: "VoucherId",
    otherKey: "OrderId",
  });
  Order.belongsToMany(Voucher, {
    through: OrderVoucher,
    foreignKey: "OrderId",
    otherKey: "VoucherId",
  });

  //  (1 Payment  to 1 Order)
  Payment.belongsTo(Order, { unique: true });
  Order.hasMany(Payment);

  // Return
  // Return.belongsTo(Payment);
  // Payment.hasOne(Return);

  // Return.belongsTo(Order);
  // Order.hasMany(Return);

  // Shipping
  //Shipping.belongsTo(Order);
  // Order.hasOne(Shipping);
};
