const { Cart, Product, CartProduct } = require("../models");

const getCart = async (req, res) => {
  try {
    const userId = 1;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", error_code: 401 });
    }

    const cartInstance = await Cart.findOne({
      where: { UserId: userId },
      include: [
        {
          model: Product,
          through: {
            attributes: ["quantity"],
          },
        },
      ],
      raw: false,
    });

    if (!cartInstance) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let cart = cartInstance.get({ plain: true });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", error_code: 404 });
    }

    // Tính tổng tiền
    let totalCart = 0;

    // tính tổng tiền và chuẩn hóa field
    cart.Products = cart.Products.map((item) => {
      const quantity = item.CartProduct?.quantity || 0;
      const price = parseFloat(item.price || 0);
      const totalPrice = price * quantity;

      totalCart += totalPrice;

      return {
        ...item,
        quantity,
        totalPrice,
        CartProduct: undefined,
      };
    });

    res.status(200).json({
      message: "Cart retrieved successfully",
      data: {
        cart,
        totalCart,
      },
      code: 200,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error", error_code: 500 });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = 1; // Replace with: req.user.id if using JWT
    let { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", error_code: 401 });
    }

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
        error_code: 400,
      });
    }

    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
        error_code: 400,
      });
    }

    // Kiểm tra product có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error_code: 404,
      });
    }

    // Lấy cart của user, nếu chưa có thì tạo mới
    let cart = await Cart.findOne({ where: { UserId: userId } });
    if (!cart) {
      cart = await Cart.create({ UserId: userId, total_quantity: 0 });
    }

    // Kiểm tra sản phẩm đã có trong cart chưa
    let cartProduct = await CartProduct.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    let quantityDiff = quantity;
    if (cartProduct) {
      quantityDiff = quantity; // Nếu muốn cộng dồn: quantityDiff = quantity; nếu muốn set quantity mới: quantityDiff = quantity - cartProduct.quantity;
      cartProduct.quantity += quantity;
      await cartProduct.save();
    } else {
      await CartProduct.create({
        CartId: cart.id,
        ProductId: productId,
        quantity,
      });
    }

    // Cập nhật lại total_quantity của cart
    const cartProducts = await CartProduct.findAll({
      where: { CartId: cart.id },
    });
    const totalQuantity = cartProducts.reduce(
      (sum, cp) => sum + cp.quantity,
      0
    );
    cart.total_quantity = totalQuantity;
    await cart.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      code: 200,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: "Internal server error",
      error_code: 500,
    });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const userId = 1;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", error_code: 401 });
    }

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Product ID is required", error_code: 400 });
    }

    // Tìm cart của user
    const cart = await Cart.findOne({ where: { UserId: userId } });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", error_code: 404 });
    }

    // Kiểm tra product có trong cart không
    const product = await cart.getProducts({ where: { id: productId } });
    if (product.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found in cart", error_code: 404 });
    }

    // Xóa product khỏi cart
    await cart.removeProduct(productId);

    // Cập nhật total_quantity của cart
    const cartProducts = await cart.getProducts();
    let totalQuantity = 0;
    cartProducts.forEach((p) => {
      totalQuantity += p.CartProduct.quantity;
    });

    await cart.update({ total_quantity: totalQuantity });

    res.status(200).json({
      message: "Product removed from cart successfully",
      code: 200,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Internal server error", error_code: 500 });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const userId = 1; // Thay đổi cho phù hợp với xác thực thực tế
    const { productId } = req.params;
    let { quantity } = req.body;
    console.log(productId, quantity);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", error_code: 401 });
    }

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Product ID và quantity là bắt buộc",
        error_code: 400,
      });
    }

    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "quantity phải là số nguyên dương",
        error_code: 400,
      });
    }

    // Tìm cart của user
    const cart = await Cart.findOne({ where: { UserId: userId } });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", error_code: 404 });
    }

    // Kiểm tra product có trong cart không
    const cartProduct = await CartProduct.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });
    if (!cartProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in cart", error_code: 404 });
    }

    cartProduct.quantity -= quantity;
    if (cartProduct.quantity <= 0) {
      // Xóa sản phẩm khỏi cart
      await cart.removeProduct(productId);
    } else {
      await cartProduct.save();
    }

    // Cập nhật lại tổng số lượng sản phẩm trong cart
    const updatedCartProducts = await CartProduct.findAll({
      where: { CartId: cart.id },
    });
    let totalQuantity = 0;
    updatedCartProducts.forEach((cp) => {
      totalQuantity += cp.quantity;
    });
    await cart.update({ total_quantity: totalQuantity });

    res.status(200).json({
      message: "Quantity decreased successfully",
      code: 200,
    });
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ message: "Internal server error", error_code: 500 });
  }
};

module.exports = {
  addToCart,
  removeProductFromCart,
  getCart,
  decreaseQuantity,
};
