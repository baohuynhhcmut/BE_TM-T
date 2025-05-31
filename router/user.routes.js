const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authMiddleware, authorize } = require("../middlewares/jwt");

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
