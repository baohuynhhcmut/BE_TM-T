const productRoutes = require('./product.routes');
const feedbackRoutes = require('./feedback.routes');

module.exports = (app) => {
  app.use('/Products', productRoutes);
  app.use('/Feedbacks', feedbackRoutes);

};
