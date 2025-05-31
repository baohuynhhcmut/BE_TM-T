const express = require("express");
const CartController = require("../controllers/cart.controller");
const router = express.Router();
const { authMiddleware, authorize } = require("../middlewares/jwt");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API quản lý giỏ hàng
 */

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm trong giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         total_quantity:
 *                           type: integer
 *                           example: 2
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-31T11:18:04.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-31T11:18:04.000Z"
 *                         UserId:
 *                           type: integer
 *                           example: 2
 *                         Products:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 2
 *                               name:
 *                                 type: string
 *                                 example: Samsung Galaxy S22
 *                               price:
 *                                 type: number
 *                                 format: float
 *                                 example: 899.99
 *                               description:
 *                                 type: string
 *                                 example: Samsung flagship
 *                               total:
 *                                 type: integer
 *                                 example: 33
 *                               image:
 *                                 type: string
 *                                 example: galaxy_s22.png
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-05-31T11:18:04.000Z"
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-05-31T13:49:04.000Z"
 *                               CategoryId:
 *                                 type: integer
 *                                 example: 1
 *                               MaterialId:
 *                                 type: integer
 *                                 example: 2
 *                               quantity:
 *                                 type: integer
 *                                 example: 1
 *                               totalPrice:
 *                                 type: number
 *                                 format: float
 *                                 example: 899.99
 *                     totalCart:
 *                       type: number
 *                       format: float
 *                       example: 989.98
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token không hợp lệ
 */
router.get("/", CartController.getCart);

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm sản phẩm vào giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart successfully
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token không hợp lệ
 */
router.post("/", CartController.addToCart);

/**
 * @swagger
 * /carts/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm cần xóa khỏi giỏ hàng
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product removed from cart successfully
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Thiếu productId hoặc productId không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product ID is required
 *                 error_code:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token không hợp lệ
 *       404:
 *         description: Sản phẩm không tồn tại trong giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Product not found in cart
 *       405:
 *         description: Giỏ hàng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart not found
 */
router.delete("/:productId", CartController.removeProductFromCart);

/**
 * @swagger
 * /carts/{productId}:
 *   patch:
 *     summary: Giảm số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm cần giảm số lượng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Giảm số lượng sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quantity decreased successfully
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found in cart
 *                 error_code:
 *                   type: integer
 *                   example: 404
 */
router.patch("/:productId", CartController.decreaseQuantity);

module.exports = router;
