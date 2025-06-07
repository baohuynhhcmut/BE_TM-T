
const db = require('../models/index');
const argon2 = require("argon2");

async function seedData() {
//await db.sequelize.sync({ force: true });

  // Tạo Categories
  const notebooks = await db.Category.create({ name: 'Notebooks', description: 'Sổ tay và sổ ghi chép' });
  const pens = await db.Category.create({ name: 'Pens', description: 'Bút viết các loại' });
  const bags = await db.Category.create({ name: 'Bags', description: 'Túi đựng tài liệu' });
  const bottles = await db.Category.create({ name: 'Bottles', description: 'Bình nước và ống hút' });

  // Tạo Materials
  const kraft = await db.Material.create({ name: 'Kraft Paper', description: 'Giấy Kraft tái chế' });
  const bamboo = await db.Material.create({ name: 'Bamboo wood', description: 'Gỗ làm từ tre' });
  const canvas = await db.Material.create({ name: 'Canvas', description: 'Vải canvas bền' });
  const inox = await db.Material.create({ name: 'Inox', description: 'Thép không gỉ' });

  // Tạo Users
  const users = await db.User.bulkCreate([
    {
      fullname: 'Ngo Minh Hiep',
      email: 'hiep@example.com',
      password: await argon2.hash('123'),
      phone_num: '0123456789',
      dob: new Date(1990, 1, 1),
      avatar: 'hiep.png',
      role: 'customer'
    },
    {
      fullname: 'Tran Thi Mai',
      email: 'mai@example.com',
      password: await argon2.hash('123'),
      phone_num: '0987654321',
      dob: new Date(1995, 5, 15),
      avatar: 'mai.png',
      role: 'customer'
    },
    {
      fullname: 'Le Van An',
      email: 'an@example.com',
      password: await argon2.hash('123'),
      phone_num: '0911222333',
      dob: new Date(1988, 9, 30),
      avatar: 'an.png',
      role: 'customer'
    },
    {
      fullname: 'Pham Thi Hoa',
      email: 'hoa@example.com',
      password: '123',
      phone_num: '0933444555',
      dob: new Date(1992, 3, 22),
      avatar: 'hoa.png',
      role: 'customer'
    },
    {
      fullname: 'Do Minh Tuan',
      email: 'tuan@example.com',
      password: '123',
      phone_num: '0966778899',
      dob: new Date(1997, 11, 10),
      avatar: 'tuan.png',
      role: 'customer'
    }
  ]);

  // Tạo 10 sản phẩm cụ thể
  const products = await db.Product.bulkCreate([
    {
      name: 'Sổ tay giấy tái chế',
      price: 89000,
      description: 'Kích thước: A4, 10 1/2" x 7 3/4" (20 x 27cm) \n Chất liệu bìa: Giấy Kraft tổng hợp \n Màu sắc: Vàng, trắng\n Đường may chất lượng caođược may.\n Chất liệu tinh tế giống da với giá trị cao.',
      total: 50,
      image: 'https://cdn.ready-market.com.tw/64d58f48/Templates/pic/PUNDY-hardcover_notebook_255-02.jpg?v=a52322ef',
      CategoryId: notebooks.id,
      MaterialId: kraft.id,
      cost: 70000
    },
    {
      name: 'Sổ tay vẽ chì tái chế',
      price: 69000,
      description: 'Chất liệu: giấy Kraft ( giấy tái chế ), nhựa PVC\nBút sử dụng chất liệu giấy tái chế đặc biệt an toàn, dễ bị phân hủy, không gây ô nhiễm môi trường.\nSản phẩm nhỏ, gọn, tiện lợi\nIn trực tiếp logo thông điệp lên sản phẩm \nKích thước: A4',
      total: 40,
      image: 'https://quatangnamviet.com.vn/wp-content/uploads/2019/02/So-tay-ve-chi-Sketchbook-2-1-768x768.jpg',
      CategoryId: notebooks.id,
      MaterialId: kraft.id,
      cost: 50000
    },
    {
      name: 'Sổ tay hoa lá cỏ handmade Limart',
      price: 199000,
      description: 'Sổ hoàn toàn được làm thủ công, không in ấn.\nGiấy được làm hoàn toàn từ giấy Kraft có khả năng tái chế, thân thiện với môi trường, bền và chắc chắn không dễ bị rách\nCó khả năng chống thấm, hút ẩm cao.\nBìa sổ cũng được làm hoàn toàn từ giấy Kraft với các họa tiết lá được thu nhặt và ép tay một cách thủ công.\nBìa sổ được làm hoàn toàn thủ công đảm bảo cuốn sổ 100% thân thiện với môi trường và không sử dụng bất kỳ thủ thuật in ấn nào.',
      total: 30,
      image: 'https://limartvn.com/wp-content/uploads/2022/05/So-Tay-Hoa-La-Co-Thu-Cong-1-1-scaled.jpg',
      CategoryId: notebooks.id,
      MaterialId: kraft.id,
      cost: 195000
    },
    {
      name: 'Sổ Tay Giấy Kraft \"Saigon In My Heart\"',
      price: 59000,
      description: 'Sổ tay có mặt giấy mềm mịn, bám mực tốt sẽ giúp lưu giữ nét chữ của bạn mãi về sau.\nSản phẩm cũng thích hợp làm quà tặng trong những dịp đặc biệt.',
      total: 100,
      image: 'https://cdn.chus.vn/images/thumbnails/767/767/detailed/282/bitexco_master.jpg',
      CategoryId: notebooks.id,
      MaterialId: kraft.id,
      cost: 48000
    },
    {
      name: 'Bút Bi Giấy Tái Chế Thân Thiện Môi Trường',
      price: 6000,
      description: 'Bút bi giấy tái chế thân thiện với môi trường, có thể tái sử dụng nhiều lần.\nChất liệu: Giấy tái chế, mực xanh.\n Kiểu dáng: Bút bi dạng bấm, có thể thay thế ruột bút khi hết mực.\nKích thước: 14cm x 0.8cm.',
      total: 150,
      image: 'https://quatangphuocan.vn/uploads/news/653da041a9e25.jpg',
      CategoryId: pens.id,
      MaterialId: kraft.id,
      cost: 3000
    },
    {
      name: 'Ống cắm bút để bàn bằng tre tự nhiên, cốc đựng bút tre bàn làm việc',
      price: 69000,
      description: 'Ống cắm bút được làm hoàn toàn bằng gỗ tre tự nhiên, với công nghệ sản xuất hiện đại mang đến mẫu cốc đựng bút để bàn đẹp và thân thiện môi trường.',
      total: 100,
      image: 'https://huhipro.com/api/uploads/2021/06/Ong-dung-but-bang-tre-huhipro-4.jpg',
      CategoryId: pens.id,
      MaterialId: bamboo.id,
      cost: 52000
    },
    {
      name: 'Túi đựng tài liệu Canvas Dung lượng cao - màu xanh',
      price: 59000,
      description: 'Loại: Túi tài liệu A4\nMàu: Xanh đen\nChất liệu: canvas \nKích thước: Khoảng 36cm * 30cm \nĐóng gói: 1 túi tài liệu A4',
      total: 40,
      image: 'https://huyphu.com/cdn/720/Product/5XMxMzCXCji/1574651930095.jpg',
      CategoryId: bags.id,
      MaterialId: canvas.id,
      cost: 44000
    },
    {
      name: 'Túi đựng tài liệu Canvas Dung lượng cao - màu hồng',
      price: 59000,
      description: 'Loại: Túi tài liệu A4\nMàu: Hồng\nChất liệu: canvas \nKích thước: Khoảng 36cm * 30cm \nĐóng gói: 1 túi tài liệu A4',
      total: 40,
      image: 'https://bizweb.dktcdn.net/thumb/medium/100/212/177/products/2-2-220bd1c8-0cd6-4252-a2da-4ceea064ad84.jpg?v=1619593795967',
      CategoryId: bags.id,
      MaterialId: canvas.id,
      cost: 44000
    },
    {
      name: 'LY GIỮ NHIỆT INOX TRƠN 750ML MÀU BẠC',
      price: 199000,
      description: 'LY GIỮ NHIỆT INOX TRƠN 750ML MÀU BẠC dung tích lớn, đáp ứng được nhu cầu uống nước suốt thời gian dài làm việc và lao động. Thiết kế đơn giản, năng động phù hợp với thẩm mỹ số đông.\nChất liệu: inox 304 cao cấp.\nDung tích: 750ml.\nKhả năng giữ nhiệt lên đến 12 giờ.',
      total: 80,
      image: 'https://vinaly.vn/wp-content/uploads/2024/01/ly-giu-nhiet-inox-tron-750ml-mau-bac-5.jpg',
      CategoryId: bottles.id,
      MaterialId: inox.id,
      cost: 164000
    },
    {
      name: 'Ống hút inox 304',
      price: 35000,
      description: 'Ống hút inox 304 cao cấp, bền đẹp, an toàn cho sức khỏe.\nChất liệu: inox 304.\nKích thước: 21cm x 0.6cm.\nCó thể tái sử dụng nhiều lần, dễ dàng vệ sinh.\n Lợi ích: Giảm thiểu rác thải nhựa, bảo vệ môi trường.',
      total: 70,
      image: 'https://laxanh.net/wp-content/uploads/2019/07/in1-768x768.jpg',
      CategoryId: bottles.id,
      MaterialId: inox.id,
      cost: 25000
    },
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

   /* await db.Shipping.create({
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
    } */
  }

  console.log('Dữ liệu mẫu đã được chèn thành công!');
}

module.exports = seedData ;
