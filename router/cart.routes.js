const express = require('express');
const  CartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.delete('/:productId', CartController.removeProductFromCart);
router.patch('/:productId', CartController.decreaseQuantity);

module.exports = router;
