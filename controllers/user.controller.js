const authService = require("../services/auth.js");
const { User } = require("../models");

module.exports = {
  async register(req, res) {
    try {
      const { fullname, email, password, phone_num, dob, role } = req.body;

      if (!fullname || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Tên, email và mật khẩu là bắt buộc",
        });
      }

      const result = await authService.register({
        fullname,
        email,
        password,
        phone_num,
        dob,
        role,
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email và mật khẩu là bắt buộc",
        });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getProfile(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { fullname, phone_num, dob, avatar } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);

      if (fullname) user.fullname = fullname;
      if (phone_num) user.phone_num = phone_num;
      if (dob) user.dob = dob;
      if (avatar) user.avatar = avatar;

      await user.save();

      const { password, ...userWithoutPassword } = user.toJSON();

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc",
        });
      }

      const user = await User.findByPk(userId);

      const isValidPassword = await authService.verifyPassword(
        user.password,
        currentPassword
      );

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng",
        });
      }

      const hashedNewPassword = await authService.hashPassword(newPassword);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "Lấy danh sách người dùng thành công",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
