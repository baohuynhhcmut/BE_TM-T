const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');


router.post('/checkout', paymentController.create_url);

router.get('/vnpay_return', paymentController.vnpay_return);

module.exports = router;

