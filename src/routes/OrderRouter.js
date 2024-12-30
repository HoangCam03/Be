const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const OrderController = require('../controllers/OrderController');


router.post('/create', authMiddleware , OrderController.createOrder);
router.get('/get-orders-detail/:id', authMiddleware, OrderController.getOrderOfUser);
router.delete('/delete-order/:id', authMiddleware, OrderController.deleteOrder);
router.put('/update-status-order/:id', authMiddleware, OrderController.updatePaymentStatus);

module.exports = router;