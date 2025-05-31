const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

router.post('/', feedbackController.createFeedback);
router.get('/product', feedbackController.getFeedbacksByProduct);
router.patch('/', feedbackController.updateFeedback)

module.exports = router;
