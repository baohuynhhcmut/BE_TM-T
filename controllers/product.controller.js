const { Op } = require('sequelize');
const { Product, Category } = require('../models'); 

module.exports = {
  // GET /products
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /products/:id
  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async searchProducts(req, res) {
    const { q } = req.query;
    try {
      const products = await Product.findAll({
        where: {
          name: { [Op.iLike]: `%${q}%` } 
        }
      });
      res.json(products);
    } catch (err) {
      console.error('Error searching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async filterProducts(req, res) {
    const { minPrice, maxPrice, categoryId } = req.query;
    let whereClause = {};

    if (minPrice) whereClause.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) {
      whereClause.price = {
        ...(whereClause.price || {}),
        [Op.lte]: parseFloat(maxPrice)
      };
    }
    if (categoryId) {
      whereClause.categoryId = categoryId; 
    }

    try {
      const products = await Product.findAll({ where: whereClause });
      res.json(products);
    } catch (err) {
      console.error('Error filtering products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async getHotProducts(req, res) {
    try {
      const products = await Product.findAll({
        order: [['total', 'DESC']],
        limit: 10
      });
      res.json(products);
    } catch (err) {
      console.error('Error fetching hot products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
