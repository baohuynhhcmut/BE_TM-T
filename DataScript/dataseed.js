const db = require('../models/index');

async function seedData() {
  //await db.sequelize.sync({ force: true });

  // Tạo Categories
  const electronics = await db.Category.create({ name: 'Electronics', description: 'Electronic devices' });
  const accessories = await db.Category.create({ name: 'Accessories', description: 'Tech accessories' });

  // Tạo Materials
  const plastic = await db.Material.create({ name: 'Plastic', description: 'Durable plastic' });
  const metal = await db.Material.create({ name: 'Metal', description: 'Sturdy metal' });

  // Tạo Users
  const users = await db.User.bulkCreate([
    {
      fullname: 'Ngo Minh Hiep',
      email: 'hiep@example.com',
      phone_num: '0123456789',
      dob: new Date(1990, 1, 1),
      avatar: 'hiep.png',
      role: 'customer'
    },
    {
      fullname: 'Tran Thi Mai',
      email: 'mai@example.com',
      phone_num: '0987654321',
      dob: new Date(1995, 5, 15),
      avatar: 'mai.png',
      role: 'customer'
    },
    {
      fullname: 'Le Van An',
      email: 'an@example.com',
      phone_num: '0911222333',
      dob: new Date(1988, 9, 30),
      avatar: 'an.png',
      role: 'customer'
    },
    {
      fullname: 'Pham Thi Hoa',
      email: 'hoa@example.com',
      phone_num: '0933444555',
      dob: new Date(1992, 3, 22),
      avatar: 'hoa.png',
      role: 'customer'
    },
    {
      fullname: 'Do Minh Tuan',
      email: 'tuan@example.com',
      phone_num: '0966778899',
      dob: new Date(1997, 11, 10),
      avatar: 'tuan.png',
      role: 'customer'
    }
  ]);

  // Tạo 10 sản phẩm cụ thể
  const products = await db.Product.bulkCreate([
    {
      name: 'iPhone 14',
      price: 999.99,
      description: 'Apple smartphone',
      total: 50,
      image: 'iphone14.png',
      CategoryId: electronics.id,
      MaterialId: metal.id
    },
    {
      name: 'Samsung Galaxy S22',
      price: 899.99,
      description: 'Samsung flagship',
      total: 40,
      image: 'galaxy_s22.png',
      CategoryId: electronics.id,
      MaterialId: metal.id
    },
    {
      name: 'Sony WH-1000XM4',
      price: 349.99,
      description: 'Noise-canceling headphones',
      total: 30,
      image: 'sony_headphones.png',
      CategoryId: electronics.id,
      MaterialId: plastic.id
    },
    {
      name: 'iPad Pro',
      price: 1099.99,
      description: 'Apple tablet',
      total: 20,
      image: 'ipad_pro.png',
      CategoryId: electronics.id,
      MaterialId: metal.id
    },
    {
      name: 'Dell XPS 13',
      price: 1299.99,
      description: 'Compact ultrabook',
      total: 15,
      image: 'dell_xps13.png',
      CategoryId: electronics.id,
      MaterialId: metal.id
    },
    {
      name: 'Wireless Mouse',
      price: 29.99,
      description: 'Compact wireless mouse',
      total: 100,
      image: 'mouse.png',
      CategoryId: accessories.id,
      MaterialId: plastic.id
    },
    {
      name: 'Mechanical Keyboard',
      price: 89.99,
      description: 'RGB mechanical keyboard',
      total: 60,
      image: 'keyboard.png',
      CategoryId: accessories.id,
      MaterialId: plastic.id
    },
    {
      name: 'USB-C Hub',
      price: 49.99,
      description: 'Multiport hub',
      total: 80,
      image: 'usb_hub.png',
      CategoryId: accessories.id,
      MaterialId: metal.id
    },
    {
      name: 'Laptop Sleeve',
      price: 19.99,
      description: 'Protective laptop sleeve',
      total: 70,
      image: 'sleeve.png',
      CategoryId: accessories.id,
      MaterialId: plastic.id
    },
    {
      name: 'Portable SSD',
      price: 129.99,
      description: '500GB USB 3.1 SSD',
      total: 40,
      image: 'ssd.png',
      CategoryId: accessories.id,
      MaterialId: metal.id
    }
  ]);

  // Tạo Vouchers
  const vouchers = await db.Voucher.bulkCreate([
    {
      code: 'WELCOME10',
      discount: 10,
      type: 'fixed',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      code: 'SUMMER20',
      discount: 20,
      type: 'percentage',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Tạo Cart, Order, Payment, Feedback... cho từng user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const cart = await db.Cart.create({ UserId: user.id, total_quantity: 2 });

    const product1 = products[i];
    const product2 = products[i + 5];

    await cart.addProduct(product1);
    await cart.addProduct(product2);

    const order = await db.Order.create({
      UserId: user.id,
      total_price: product1.price + product2.price,
      date: new Date(),
      status: 'pending'
    });

    await order.addProduct(product1, { through: { quantity: 1, price: product1.price } });
    await order.addProduct(product2, { through: { quantity: 1, price: product2.price } });

    const payment = await db.Payment.create({
      UserId: user.id,
      OrderId: order.id,
      method: 'credit_card',
      amount: order.total_price,
      date: new Date()
    });

    await order.addVoucher(vouchers[i % 2]);

    await db.Feedback.create({
      comment: 'Rất hài lòng!',
      rate_star: 5 - i % 2,
      UserId: user.id,
      ProductId: product1.id,
      OrderId: order.id
    });

    await db.Shipping.create({
      OrderId: order.id,
      tracking_number: `TRACK${i + 1000}`,
      address: `Số ${i + 1} Nguyễn Trãi, Hà Nội`,
      ship_date: new Date(),
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 ngày sau
      status: 'processing'
    });

    if (i % 2 === 0) {
      await db.Return.create({
        PaymentId: payment.id,
        OrderId: order.id,
        reason: 'Lỗi kỹ thuật',
        status: 'pending',
        date: new Date()
      });
    }
  }

  console.log('Dữ liệu mẫu đã được chèn thành công!');
}

module.exports = seedData ;
