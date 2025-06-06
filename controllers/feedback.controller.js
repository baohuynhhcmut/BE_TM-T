const { Op } = require('sequelize');
const { sequelize, Feedback, User } = require('../models'); 

module.exports = {
  async createFeedback(req, res) {
    try {

      const userId = req?.user?.dataValues.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized", error_code: 401 });
      }

      const { productId, comment, rate_star } = req.body;

      if ( !productId || !comment || rate_star === undefined) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết.', error_code: 400 });
      }

    // Raw SQL: kiểm tra user có từng mua productId chưa
    const results = await sequelize.query(`
      SELECT o.id AS orderId
      FROM Orders o
      JOIN OrderProduct op ON o.id = op.OrderId
      WHERE o.UserId = :userId AND op.ProductId = :productId AND o.status = 'completed'
      LIMIT 1
    `, {
      replacements: { userId, productId },
      type: sequelize.QueryTypes.SELECT
    });

    if (results.length === 0) {
      return res.status(400).json({ message: 'User chưa mua hoàn tất sản phẩm này.', error_code: 400 });
    }

    const orderId = results[0].orderId;

    // Kiểm tra user đã feedback cho product chưa
      const existingFeedback = await Feedback.findOne({
        where: {
          UserId: userId,
          ProductId: productId
        }
      });

      if (existingFeedback) {
        return res.status(400).json({ message: 'User đã feedback sản phẩm này rồi.', error_code: 400  });
      }

    // Thêm feedback
    const feedback = await Feedback.create({
      comment,
      rate_star,
      UserId: userId,
      ProductId: productId,
      OrderId: orderId
    });

    return res.status(201).json({
      code: 201,
      message: "Tạo feedback thành công",
      data: feedback
    });

    } catch (err) {
      console.error('Error: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getFeedbacksByProduct(req, res) {
    try {
        const { productId, rate_star } = req.query;

        if (!productId) {
        return res.status(400).json({ message: 'Thiếu productId.', error_code: 400 });
        }

        const productCheckQuery = `
          SELECT id FROM Products WHERE id = :productId LIMIT 1
        `;

        const productCheckResult = await sequelize.query(productCheckQuery, {
          replacements: { productId },
          type: sequelize.QueryTypes.SELECT
        });

        if (productCheckResult.length === 0) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.', error_code: 404 });
        }

        // Tạo câu SQL động
        let query = `
        SELECT 
            f.id AS feedbackId,
            f.comment,
            f.rate_star,
            f.createdAt,
            u.id AS userId,
            u.fullname,
            u.avatar
        FROM Feedbacks f
        JOIN Users u ON f.UserId = u.id
        WHERE f.ProductId = :productId
        `;

        // Nếu có lọc theo rate_star
        const replacements = { productId };
        if (rate_star !== undefined) {
        query += ` AND f.rate_star = :rate_star`;
        replacements.rate_star = rate_star;
        }

        query += ` ORDER BY f.createdAt DESC`;

        const feedbacks = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT
        });

        // return res.status(200).json(feedbacks);
        return res.status(200).json({
          code: 200,
          message: "Truy vấn feedback cho sản phẩm thành công",
          data: feedbacks
        });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getFeedbacksByUser(req, res) {
    try {

      const userId = req?.user?.dataValues.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized", error_code: 401 });
      }

      const query = `
        SELECT p.id, p.name, p.image, f.rate_star, f.comment, f.updatedAt
        FROM Products AS p
        JOIN Feedbacks AS f ON p.id = f.ProductId
        WHERE f.UserId = :userId
      `;

      const feedbacks = await sequelize.query(query, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      });

      return res.status(200).json({
        code: 200,
        message: "Lấy feedback của user thành công",
        data: feedbacks,
      });
        
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  },


  async updateFeedback(req, res) {
    try {
        const userId = req?.user?.dataValues.id;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized", error_code: 401 });
        }

        const { productId, rate_star, comment } = req.body;

        if (rate_star === undefined && comment === undefined) {
        return res.status(400).json({ message: 'Cần cung cấp rate_star hoặc comment để cập nhật.', error_code: 400 });
        }

        // Tìm feedback
        const feedback = await Feedback.findOne({
        where: {
            UserId: userId,
            ProductId: productId
        }
        });

        if (!feedback) {
        return res.status(404).json({ message: 'Feedback không tồn tại.', error_code: 404 });
        }

        const results = await sequelize.query(`
        SELECT TIMESTAMPDIFF(DAY, o.createdAt, NOW()) AS days_since_order
        FROM Feedbacks f 
        JOIN Orders o ON f.OrderId = o.id
        WHERE f.UserId = :userId AND f.ProductId = :productId
        LIMIT 1
        `, {
        replacements: { userId, productId },
        type: sequelize.QueryTypes.SELECT
        });

        const days = results[0]?.days_since_order;

        if (days > 7) {
        return res.status(400).json({ message: 'Chỉ có thể cập nhật feedback trong vòng 7 ngày kể từ khi mua hàng.' });
        }

        // Cập nhật chỉ 2 trường
        if (rate_star !== undefined) feedback.rate_star = rate_star;
        if (comment !== undefined) feedback.comment = comment;

        await feedback.save();

        return res.status(200).json({ 
          code: 200,
          message: 'Cập nhật feedback thành công.', 
          data: feedback});
        
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
};