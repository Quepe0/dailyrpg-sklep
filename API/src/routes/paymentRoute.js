const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')

router.post('/create/przelew', paymentController.przelewPayment);
router.post('/create/sms', paymentController.smsPayment);
router.post('/webhook', paymentController.webhookPayment);
router.post('/promo', paymentController.checkPromoCode);
module.exports = router;