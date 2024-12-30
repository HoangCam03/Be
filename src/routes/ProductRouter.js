const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const productController = require('../controllers/ProductController');


router.post('/create', productController.createProduct);
router.put('/update-product/:id', authMiddleware, productController.updateProduct);
router.get('/get-product-detail/:id', productController.getDetailProduct);
router.delete('/delete-product/:id', authMiddleware, productController.deleteProduct);
router.get('/getallproduct/', productController.getAllProduct);

router.get('/get-products-by-type', productController.getProductsByType);
router.delete('/delete-many-product/', authMiddleware, productController.deleteManyProduct);
router.get('/getalltype/', productController.getAllType);



module.exports = router;