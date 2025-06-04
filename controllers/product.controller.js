const { Op } = require('sequelize');
const { Product, Category, sequelize } = require('../models'); 

module.exports = {
  // GET /products
  async getAllProducts(req, res) {
    try {
      const products = await sequelize.query(`
          SELECT p.id, p.name, p.price, p.cost, p.description, p.image, p.total, c.name AS categoryName, m.name AS materialName
          FROM Products AS p
          JOIN Categories AS c ON p.categoryId = c.id
          JOIN Materials AS m ON p.materialId = m.id;
        `, {
          type: sequelize.QueryTypes.SELECT
        });
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
      const product = await sequelize.query(`
          SELECT p.id, p.name, p.price, p.cost, p.description, p.image, p.total, c.name AS categoryName, m.name AS materialName
          FROM Products AS p
          JOIN Categories AS c ON p.categoryId = c.id
          JOIN Materials AS m ON p.materialId = m.id
          WHERE p.id = :id;
        `, {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT
        });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async searchProducts(req, res) {
    const { name } = req.query;
    const q = name ? name.trim() : '';
    console.log('Search query:', q);
    try {
      let products;

      if (!q) {
        products = await sequelize.query(`
          SELECT p.id, p.name, p.price, p.cost, p.description, p.image, p.total, c.name AS categoryName, m.name AS materialName
          FROM Products AS p
          JOIN Categories AS c ON p.categoryId = c.id
          JOIN Materials AS m ON p.materialId = m.id;
        `, {
          type: sequelize.QueryTypes.SELECT
        });
      } else {
        products = await sequelize.query(`
          SELECT p.id, p.name, p.price, p.cost, p.description, p.image, p.total, c.name AS categoryName, m.name AS materialName
          FROM Products AS p JOIN Categories AS c ON p.categoryId = c.id
          JOIN Materials AS m ON p.materialId = m.id
          WHERE LOWER(p.name) LIKE :searchTerm;
        `, {
          replacements: { searchTerm: `%${q.toLowerCase()}%` },
          type: sequelize.QueryTypes.SELECT
        });
      }
      res.json(products);
    } catch (err) {
      console.error('Error searching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async filterProducts(req, res) {
    const { minPrice, maxPrice, categoryId, materialId } = req.query;

    try {
      let conditions = [];
      let replacements = {};

      if (minPrice) {
        conditions.push(`p.price >= :minPrice`);
        replacements.minPrice = parseFloat(minPrice);
      }

      if (maxPrice) {
        conditions.push(`p.price <= :maxPrice`);
        replacements.maxPrice = parseFloat(maxPrice);
      }

      if (categoryId) {
        conditions.push(`p.categoryId = :categoryId`);
        replacements.categoryId = categoryId;
      }

      if (materialId) {
        conditions.push(`p.materialId = :materialId`);
        replacements.materialId = materialId;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const products = await sequelize.query(`
        SELECT p.id, p.name, p.price, p.cost, p.description, p.image, p.total,
              c.name AS categoryName, m.name AS materialName
        FROM Products AS p
        JOIN Categories AS c ON p.categoryId = c.id
        JOIN Materials AS m ON p.materialId = m.id
        ${whereClause};
      `, {
        replacements,
        type: sequelize.QueryTypes.SELECT
      });

      res.json(products);
    } catch (err) {
      console.error('Error filtering products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  async getHotProducts(req, res) {
    try {
      const hotProducts = await sequelize.query(`
        SELECT 
          p.id, p.name, p.price, p.cost, p.description, p.image, p.total,
          c.name AS categoryName, m.name AS materialName, SUM(op.quantity) AS totalQuantity
        FROM Products p 
          JOIN OrderProduct op ON op.ProductId = p.id
          JOIN Categories c ON p.categoryId = c.id
          JOIN Materials m ON p.materialId = m.id
        GROUP BY 
          p.id, p.name, p.price, p.cost, p.description, p.image, p.total,
          c.name, m.name
        ORDER BY totalQuantity DESC
        LIMIT 10;
      `, {
        type: sequelize.QueryTypes.SELECT
      });

      res.json(hotProducts);
    } catch (err) {
      console.error('Error getting hot products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAllCategory(req, res) {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
      });
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAllMaterial(req, res) {
    try {
      const materials = await sequelize.query(`
        SELECT id, name FROM Materials ORDER BY name ASC;
      `, {
        type: sequelize.QueryTypes.SELECT
      });
      res.json(materials);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
