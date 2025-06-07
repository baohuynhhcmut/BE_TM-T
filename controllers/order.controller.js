const { Order, Product, User, Voucher, sequelize } = require("../models");

module.exports = {
  // Tạo order mới
  async createOrder(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { products, voucherCodes } = req.body;
      const userId = req.user.id;

      console.log("=== CREATE ORDER DEBUG ===");
      console.log("User ID:", userId);
      console.log("Products:", products);
      console.log("Voucher Codes:", voucherCodes);

      if (!products || products.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cần có ít nhất 1 sản phẩm trong order",
        });
      }

      let totalPrice = 0;
      const orderProducts = [];

      // Kiểm tra và tính tổng giá từ products
      for (const item of products) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `Sản phẩm ID ${item.productId} không tồn tại`,
          });
        }

        if (product.total < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Sản phẩm ${product.name} không đủ số lượng`,
          });
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;

        orderProducts.push({
          product: product,
          quantity: item.quantity,
          price: product.price,
          itemTotal: itemTotal,
        });
      }

      console.log("Total price before vouchers:", totalPrice);

      // Xử lý vouchers và tính discount
      let totalDiscount = 0;
      const validVouchers = [];

      if (voucherCodes && voucherCodes.length > 0) {
        for (const code of voucherCodes) {
          const voucher = await Voucher.findOne({
            where: {
              code: code,
              status: "active",
            },
          });

          if (voucher) {
            let discount = 0;

            if (voucher.type === "fixed") {
              discount = voucher.discount;
            } else if (voucher.type === "percentage") {
              discount = (totalPrice * voucher.discount) / 100;
            }

            totalDiscount += discount;
            validVouchers.push(voucher);

            console.log(
              `Voucher ${code}: type=${voucher.type}, discount=${voucher.discount}, calculated=${discount}`
            );
          } else {
            console.log(`Voucher ${code} không hợp lệ hoặc đã hết hạn`);
          }
        }
      }

      // Tính giá cuối cùng
      const finalPrice = Math.max(5000, totalPrice - totalDiscount);

      console.log("Total discount:", totalDiscount);
      console.log("Final price:", finalPrice);

      // Tạo order với giá đã tính
      const order = await Order.create(
        {
          UserId: userId,
          total_price: finalPrice,
          date: new Date(),
          status: "pending",
        },
        { transaction }
      );

      console.log("Created order with ID:", order.id);

      // Thêm sản phẩm vào order thông qua OrderProduct
      for (const item of orderProducts) {
        await order.addProduct(item.product, {
          through: {
            quantity: item.quantity,
            price: item.price,
          },
          transaction,
        });

        // Giảm số lượng sản phẩm trong kho
        item.product.total -= item.quantity;
        await item.product.save({ transaction });
      }

      // Thêm voucher vào order thông qua OrderVoucher
      if (validVouchers.length > 0) {
        for (const voucher of validVouchers) {
          await order.addVoucher(voucher, { transaction });
        }
      }

      await transaction.commit();

      // Lấy order với đầy đủ thông tin để trả về (sau khi commit)
      const orderWithDetails = await Order.findByPk(order.id, {
        include: [
          {
            model: Product,
            through: {
              attributes: ["quantity", "price"],
            },
          },
          {
            model: Voucher,
            through: {
              attributes: [],
            },
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: "Tạo order thành công",
        data: {
          order: orderWithDetails,
          priceDetails: {
            originalPrice: totalPrice,
            totalDiscount: totalDiscount,
            finalPrice: finalPrice,
            vouchersUsed: validVouchers.map((v) => ({
              code: v.code,
              type: v.type,
              discount: v.discount,
            })),
          },
        },
      });
    } catch (error) {
      // Chỉ rollback nếu transaction chưa được commit hoặc rollback
      if (!transaction.finished) {
        await transaction.rollback();
      }
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy tất cả order của user
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;

      console.log("=== GET USER ORDERS DEBUG ===");
      console.log("User ID:", userId);

      const orders = await Order.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Product,
            through: {
              attributes: ["quantity", "price"],
            },
          },
          {
            model: Voucher,
            through: {
              attributes: [],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "Lấy danh sách order thành công",
        data: orders,
      });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy chi tiết 1 order của user
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      console.log("=== GET ORDER BY ID DEBUG ===");
      console.log("Order ID:", id);
      console.log("User ID:", userId);

      const order = await Order.findOne({
        where: {
          id: id,
          UserId: userId,
        },
        include: [
          {
            model: Product,
            through: {
              attributes: ["quantity", "price"],
            },
          },
          {
            model: Voucher,
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order không tồn tại hoặc không thuộc về bạn",
        });
      }

      res.status(200).json({
        success: true,
        message: "Lấy chi tiết order thành công",
        data: order,
      });
    } catch (error) {
      console.error("Get order by ID error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Cập nhật trạng thái order (chỉ cho phép cancel)
  async updateOrderStatus(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      console.log("=== UPDATE ORDER STATUS DEBUG ===");
      console.log("Order ID:", id);
      console.log("New Status:", status);
      console.log("User ID:", userId);

      const allowedStatuses = ["cancelled"];

      if (!allowedStatuses.includes(status)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Chỉ được phép hủy order",
        });
      }

      const order = await Order.findOne({
        where: {
          id: id,
          UserId: userId,
        },
        include: [
          {
            model: Product,
            through: {
              attributes: ["quantity", "price"],
            },
          },
        ],
        transaction,
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Order không tồn tại hoặc không thuộc về bạn",
        });
      }

      if (order.status !== "pending") {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Chỉ có thể hủy order đang pending",
        });
      }

      order.status = status;
      await order.save({ transaction });

      // Nếu cancel thì hoàn lại số lượng sản phẩm
      if (status === "cancelled") {
        for (const product of order.Products) {
          const orderProduct = product.OrderProduct;
          product.total += orderProduct.quantity;
          await product.save({ transaction });
        }
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái order thành công",
        data: order,
      });
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      console.error("Update order status error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Admin: Lấy tất cả orders
  async getAllOrders(req, res) {
    try {
      console.log("=== GET ALL ORDERS (ADMIN) DEBUG ===");
      console.log("Admin User:", req.user.role);

      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "email"],
          },
          {
            model: Product,
            through: {
              attributes: ["quantity", "price"],
            },
          },
          {
            model: Voucher,
            through: {
              attributes: [],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "Lấy tất cả order thành công",
        data: orders,
      });
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Admin: Cập nhật trạng thái order
  async adminUpdateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log("=== ADMIN UPDATE ORDER STATUS DEBUG ===");
      console.log("Order ID:", id);
      console.log("New Status:", status);

      const validStatuses = [
        "pending",
        "confirmed",
        "shipping",
        "completed",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order không tồn tại",
        });
      }

      order.status = status;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái order thành công",
        data: order,
      });
    } catch (error) {
      console.error("Admin update order status error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
