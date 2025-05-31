const productRoutes = require('./product.routes');
const feedbackRoutes = require('./feedback.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require("./order.routes");
const userRoutes = require("./user.routes");

module.exports = (app) => {
  app.use('/Products', productRoutes);
  app.use('/Feedbacks', feedbackRoutes);
  app.use('/cart', cartRoutes);
  app.use("/Users", userRoutes);
  app.use("/Orders", orderRoutes);
};
