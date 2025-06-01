const express = require("express");
const FeedbackController = require("../controllers/feedback.controller");
const router = express.Router();
const { authMiddleware } = require("../middlewares/jwt");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API quản lý phản hồi người dùng
 */

/**
 * @swagger
 * /Feedbacks:
 *   post:
 *     summary: Gửi phản hồi từ người dùng sau khi mua sản phẩm
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - comment
 *               - rate_star
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               comment:
 *                 type: string
 *                 example: Sản phẩm rất tốt!
 *               rate_star:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Gửi phản hồi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 comment:
 *                   type: string
 *                   example: Sản phẩm rất tốt!
 *                 rate_star:
 *                   type: integer
 *                   example: 5
 *                 UserId:
 *                   type: integer
 *                   example: 2
 *                 ProductId:
 *                   type: integer
 *                   example: 101
 *                 OrderId:
 *                   type: integer
 *                   example: 1001
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Thông tin không hợp lệ hoặc user chưa mua sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu thông tin cần thiết.
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 error_code:
 *                   type: integer
 *                   example: 401
 */
router.post("/", FeedbackController.createFeedback);

/**
 * @swagger
 * /Feedbacks/product:
 *   get:
 *     summary: Lấy danh sách phản hồi của một sản phẩm, có thể lọc theo điểm đánh giá (rate_star)
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm cần lấy phản hồi
 *         example: 101
 *       - in: query
 *         name: rate_star
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         required: false
 *         description: Lọc phản hồi theo số sao đánh giá (1-5)
 *         example: 5
 *     responses:
 *       200:
 *         description: Lấy danh sách phản hồi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Truy vấn feedback cho sản phẩm thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       feedbackId:
 *                         type: integer
 *                         example: 1
 *                       comment:
 *                         type: string
 *                         example: Sản phẩm rất tốt!
 *                       rate_star:
 *                         type: integer
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-01T14:00:00.000Z"
 *                       userId:
 *                         type: integer
 *                         example: 2
 *                       fullname:
 *                         type: string
 *                         example: Nguyễn Văn A
 *                       avatar:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *       400:
 *         description: Thiếu productId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu productId.
 *                 error_code:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Sản phẩm không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sản phẩm không tồn tại.
 *                 error_code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/product", FeedbackController.getFeedbacksByProduct);

/**
 * @swagger
 * /Feedbacks:
 *   patch:
 *     summary: Cập nhật phản hồi của người dùng cho một sản phẩm
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               comment:
 *                 type: string
 *                 example: Cập nhật nhận xét về sản phẩm
 *               rate_star:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *             description: Cần cung cấp productId và ít nhất một trong hai trường comment hoặc rate_star để cập nhật.
 *     responses:
 *       200:
 *         description: Cập nhật feedback thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cập nhật feedback thành công.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     comment:
 *                       type: string
 *                       example: Cập nhật nhận xét về sản phẩm
 *                     rate_star:
 *                       type: integer
 *                       example: 4
 *                     UserId:
 *                       type: integer
 *                       example: 2
 *                     ProductId:
 *                       type: integer
 *                       example: 101
 *                     OrderId:
 *                       type: integer
 *                       example: 1001
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Thiếu thông tin hoặc không thể cập nhật (ví dụ quá 7 ngày)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cần cung cấp rate_star hoặc comment để cập nhật.
 *                 error_code:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized - chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 error_code:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Feedback không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedback không tồn tại.
 *                 error_code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.patch("/", FeedbackController.updateFeedback);

/**
 * @swagger
 * /Feedbacks/user:
 *   get:
 *     summary: Lấy danh sách feedback của người dùng hiện tại
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy feedback của user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy feedback của user thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       name:
 *                         type: string
 *                         example: "Tên sản phẩm"
 *                       image:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       rate_star:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "Sản phẩm rất tốt"
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 error_code:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/user", FeedbackController.getFeedbacksByUser);

module.exports = router;