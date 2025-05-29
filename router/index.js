const productRoutes = require('./product.routes');

module.exports = (app) => {
  app.use('/Products', productRoutes);
  

};
