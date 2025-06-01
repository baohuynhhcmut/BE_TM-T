const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authMiddleware, authorize } = require("../middlewares/jwt");

// User routes - cần đăng nhập
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         total:
 *           type: integer
 *         image:
 *           type: string
 *     Voucher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         discount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *         status:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         total_price:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipping, completed, cancelled]
 *         UserId:
 *           type: integer
 *         User:
 *           $ref: '#/components/schemas/User'
 *         Products:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/Product'
 *               - type: object
 *                 properties:
 *                   OrderProduct:
 *                     type: object
 *                     properties:
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *         Vouchers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Voucher'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateOrder:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID của sản phẩm
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Số lượng sản phẩm
 *         voucherCodes:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách mã voucher (optional)
 *     UpdateOrderStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [cancelled]
 *           description: Trạng thái mới (user chỉ được cancel)
 *     AdminUpdateOrderStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipping, completed, cancelled]
 *           description: Trạng thái mới
 */

/**
 * @swagger
 * /Orders:
 *   post:
 *     summary: Tạo order mới
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *           examples:
 *             with_vouchers:
 *               summary: Order với voucher
 *               value:
 *                 products:
 *                   - productId: 1
 *                     quantity: 2
 *                   - productId: 2
 *                     quantity: 1
 *                 voucherCodes: ["DISCOUNT10", "SUMMER2024"]
 *             without_vouchers:
 *               summary: Order không có voucher
 *               value:
 *                 products:
 *                   - productId: 1
 *                     quantity: 2
 *                   - productId: 3
 *                     quantity: 1
 *     responses:
 *       201:
 *         description: Tạo order thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tạo order thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *                     priceDetails:
 *                       type: object
 *                       properties:
 *                         originalPrice:
 *                           type: number
 *                         totalDiscount:
 *                           type: number
 *                         finalPrice:
 *                           type: number
 *                         vouchersUsed:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               code:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                               discount:
 *                                 type: number
 *       400:
 *         description: Lỗi validation hoặc sản phẩm không đủ số lượng
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Sản phẩm không tồn tại
 */

/**
 * @swagger
 * /Orders/my-orders:
 *   get:
 *     summary: Lấy danh sách order của user hiện tại
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách order thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Chưa đăng nhập
 */

/**
 * @swagger
 * /Orders/{id}:
 *   get:
 *     summary: Lấy chi tiết order theo ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của order
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy chi tiết order thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Order không tồn tại hoặc không thuộc về user
 */

/**
 * @swagger
 * /Orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái order (User chỉ được cancel)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatus'
 *           example:
 *             status: "cancelled"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái order thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Chỉ có thể hủy order đang pending hoặc trạng thái không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Order không tồn tại hoặc không thuộc về user
 */

/**
 * @swagger
 * /Orders/admin/all:
 *   get:
 *     summary: Lấy tất cả orders (Admin only)
 *     tags: [Order - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy tất cả order thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 */

/**
 * @swagger
 * /Orders/admin/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái order (Admin)
 *     tags: [Order - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateOrderStatus'
 *           examples:
 *             confirm:
 *               summary: Xác nhận order
 *               value:
 *                 status: "confirmed"
 *             shipping:
 *               summary: Chuyển sang trạng thái shipping
 *               value:
 *                 status: "shipping"
 *             completed:
 *               summary: Hoàn thành order
 *               value:
 *                 status: "completed"
 *             cancelled:
 *               summary: Hủy order
 *               value:
 *                 status: "cancelled"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái order thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Trạng thái không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       404:
 *         description: Order không tồn tại
 */
router.post("/", authMiddleware, orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.patch("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Admin routes
router.get(
  "/admin/all",
  authMiddleware,
  authorize("admin"),
  orderController.getAllOrders
);
router.patch(
  "/admin/:id/status",
  authMiddleware,
  authorize("admin"),
  orderController.adminUpdateOrderStatus
);

module.exports = router;
