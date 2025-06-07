const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

class AuthService {
  async hashPassword(password) {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new Error("Error hashing password");
    }
  }

  async verifyPassword(hashedPassword, plainPassword) {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      return false;
    }
  }

  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET ||
        "thuongmaidientu2sdfsdfsdfsdfsfsdfsdfd31324234234324234324234sdfsdfsdfsdf025ddddd",
      {
        expiresIn: "24h",
      }
    );
  }

  async register(userData) {
    const { fullname, email, password, phone_num, dob, role } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phone_num,
      dob,
      role: role || "customer",
    });

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        phone_num: user.phone_num,
        dob: user.dob,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const isValidPassword = await this.verifyPassword(user.password, password);

    if (!isValidPassword) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        phone_num: user.phone_num,
        dob: user.dob,
        avatar: user.avatar,
      },
      token,
    };
  }
}

module.exports = new AuthService();
