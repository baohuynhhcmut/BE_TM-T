const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/hot', productController.getHotProducts);
router.get('/search', productController.searchProducts);
router.get('/filter', productController.filterProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
