const productRoutes = require('./product.routes');
const feedbackRoutes = require('./feedback.routes');
const cartRoutes = require('./cart.routes');
module.exports = (app) => {
  app.use('/Products', productRoutes);
  app.use('/Feedbacks', feedbackRoutes);
  app.use('/cart', cartRoutes);
};
