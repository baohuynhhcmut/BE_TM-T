const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: API lấy voucher
 */

/**
 * @swagger
 * /vouchers:
 *   get:
 *     summary: Retrieve voucher by code
 *     description: Trả về thông tin voucher nếu `code` hợp lệ và còn hoạt động.
 *     tags:
 *       - Voucher
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: "Mã voucher cần truy xuất (ví dụ: WELCOME10)"
 *     responses:
 *       '200':
 *         description: Voucher retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Voucher retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     code:
 *                       type: string
 *                       example: WELCOME10
 *                     discount:
 *                       type: integer
 *                       example: 10000
 *                     type:
 *                       type: string
 *                       example: fixed
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-04T06:39:31.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-04T06:39:31.000Z
 *       '400':
 *         description: Missing voucher code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Voucher code is required
 *                 error_code:
 *                   type: integer
 *                   example: 400
 *       '404':
 *         description: Voucher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Voucher not found
 *                 error_code:
 *                   type: integer
 *                   example: 404
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error_code:
 *                   type: integer
 *                   example: 500
 */
router.get("/", voucherController.getVoucher);

module.exports = router;

