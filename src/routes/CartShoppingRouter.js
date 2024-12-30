const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const CartShoppingController = require('../controllers/CartShoppingController');


router.post('/add-cartshopping', authMiddleware , CartShoppingController.AddCartShopping);
router.get('/get-orders-cartshopping/:id', authMiddleware, CartShoppingController.getCartShopping);
// router.delete('/delete-order-cartshopping/:id', authMiddleware, CartShoppingController.deleteOrder);


module.exports = router;