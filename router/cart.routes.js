const express = require('express');
const  CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/jwt').authMiddleware;
const router = express.Router();

// router.use(authMiddleware);
router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.delete('/:productId', CartController.removeProductFromCart);
router.patch('/:productId', CartController.decreaseQuantity);

module.exports = router;
