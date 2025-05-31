const productRoutes = require("./product.routes");
const feedbackRoutes = require("./feedback.routes");
const orderRoutes = require("./order.routes");

module.exports = (app) => {
  app.use("/Products", productRoutes);
  app.use("/Feedbacks", feedbackRoutes);
  app.use("/Users", require("./user.routes"));
  app.use("/Orders", orderRoutes);
};
