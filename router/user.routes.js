const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authMiddleware, authorize } = require("../middlewares/jwt");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của user
 *         fullname:
 *           type: string
 *           description: Họ tên đầy đủ
 *         email:
 *           type: string
 *           format: email
 *           description: Email của user
 *         phone_num:
 *           type: string
 *           description: Số điện thoại
 *         dob:
 *           type: string
 *           format: date
 *           description: Ngày sinh
 *         avatar:
 *           type: string
 *           description: Link ảnh đại diện
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           description: Vai trò của user
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserRegister:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *       properties:
 *         fullname:
 *           type: string
 *           description: Họ tên đầy đủ
 *         email:
 *           type: string
 *           format: email
 *           description: Email của user
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Mật khẩu
 *         phone_num:
 *           type: string
 *           description: Số điện thoại
 *         dob:
 *           type: string
 *           format: date
 *           description: Ngày sinh
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           default: customer
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     UserUpdate:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *         phone_num:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         avatar:
 *           type: string
 *     ChangePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *           minLength: 6
 */

/**
 * @swagger
 * /Users/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *           example:
 *             fullname: "Nguyen Van A"
 *             email: "nguyenvana@example.com"
 *             password: "123456"
 *             phone_num: "0123456789"
 *             dob: "1990-01-01"
 *             role: "customer"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
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
 *                   example: "Đăng ký thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Lỗi validation hoặc email đã tồn tại
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
 *                   example: "Email đã được sử dụng"
 */

/**
 * @swagger
 * /Users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           example:
 *             email: "user1"
 *             password: "123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       401:
 *         description: Email hoặc mật khẩu không đúng
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
 *                   example: "Email hoặc mật khẩu không đúng"
 */

/**
 * @swagger
 * /Users/profile:
 *   get:
 *     summary: Lấy thông tin profile của user hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                   example: "Lấy thông tin thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập
 *   put:
 *     summary: Cập nhật thông tin profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           example:
 *             fullname: "Nguyen Van B"
 *             phone_num: "0987654321"
 *             dob: "1995-05-05"
 *             avatar: "https://example.com/avatar.jpg"
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
 *                   example: "Cập nhật thông tin thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Lỗi validation
 *       401:
 *         description: Chưa đăng nhập
 */

/**
 * @swagger
 * /Users/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *           example:
 *             currentPassword: "123"
 *             newPassword: "123456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
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
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Mật khẩu hiện tại không đúng
 *       401:
 *         description: Chưa đăng nhập
 */

/**
 * @swagger
 * /Users/all:
 *   get:
 *     summary: Lấy danh sách tất cả users (Admin only)
 *     tags: [User]
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
 *                   example: "Lấy danh sách người dùng thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 */

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/change-password", authMiddleware, userController.changePassword);

// Admin only routes
router.get(
  "/all",
  authMiddleware,
  authorize("admin"),
  userController.getAllUsers
);

module.exports = router;
