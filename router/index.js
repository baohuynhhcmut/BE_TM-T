const productRoutes = require('./product.routes');
const feedbackRoutes = require('./feedback.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require("./order.routes");
const userRoutes = require("./user.routes");
const paymentRoutes = require("./payment.route");
const voucherRoutes = require("./voucher.routes");

module.exports = (app) => {
  app.use('/products', productRoutes);
  app.use('/feedbacks', feedbackRoutes);
  app.use('/carts', cartRoutes);
  app.use("/users", userRoutes);
  app.use("/orders", orderRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/vouchers", voucherRoutes);
};
