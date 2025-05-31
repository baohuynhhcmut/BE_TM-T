const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authMiddleware, authorize } = require("../middlewares/jwt");

// User routes - cần đăng nhập
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
