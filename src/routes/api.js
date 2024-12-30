const UserRouter = require('./UserRouter');
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');
const PaymentRouter = require('./PaymentRouter');
const CartShoppingRouter = require('./CartShoppingRouter')





const routes = (app) => {
  app.use('/api/user', UserRouter);///
  app.use('/api/product', ProductRouter);
  app.use('/api/order-product', OrderRouter);
  app.use('/api/payment', PaymentRouter);
  app.use('/api/cart-shopping', CartShoppingRouter);





};

module.exports = routes;