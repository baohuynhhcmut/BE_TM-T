const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API thanh toán
 */

/**
 * @swagger
 * /payment/checkout:
 *   post:
 *     summary: Thanh toán đơn hàng
 *     tags: [Payment]
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *             type: object
 *             required:
 *               - amount
 *               - orderId
 *               - bankCode
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 158000
 *               orderId:
 *                 type: string
 *                 example: "7"
 *               bankCode:
 *                  type: string
 *                  enum:
 *                    - VNBANK
 *                    - INTCARD
 *                  description: |
 *                    Mã ngân hàng thanh toán:
 *                    * VNBANK - Thanh toán qua ATM-Tài khoản ngân hàng nội địa
 *                    * INTCARD - Thanh toán qua thẻ quốc tế
 *                  example: VNBANK
 *     description: Tạo URL thanh toán cho đơn hàng
 *     responses:
 *       200:
 *         description: Tạo URL thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      example: success
 *                  code:
 *                      type: string
 *                      example: '0'
 *                  data:
 *                   type: string
 *                   example: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=15800000&vnp_BankCode=VNBANK&vnp_Command=pay&vnp_CreateDate=20250607063523&vnp_CurrCode=VND&vnp_IpAddr=27.65.136.234%2C+104.23.160.88%2C+10.220.254.144&vnp_Locale=vn&vnp_OrderInfo=Thanh+to%C3%A1n+%C4%91%C6%A1n+h%C3%A0ng+7&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5174%2Fcallback%2Fpayment&vnp_TmnCode=VAL8S1OH&vnp_TxnRef=7&vnp_Version=2.1.0&vnp_SecureHash=7b03d5c266656f67fccf7b85cb9222a1cc925d923e9a76ce3d32b2e6b68d30e618ccc24dcae0e6f4ba25677b219d4bcd44164f22be5daba4d3e5b00333e218e4
 */
router.post("/checkout", paymentController.create_url);

router.get("/vnpay_return", paymentController.vnpay_return);

module.exports = router;
