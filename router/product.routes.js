const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

//swagger docs
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của sản phẩm
 *         name:
 *           type: string
 *           description: Tên sản phẩm
 *         price:
 *           type: number
 *           format: float
 *           description: Giá sản phẩm
 *         cost:
 *           type: number
 *           format: float
 *           description: Giá vốn sản phẩm
 *         description:
 *           type: string
 *           description: Mô tả sản phẩm
 *         total:
 *           type: integer
 *           description: Số lượng tồn kho
 *         image:
 *           type: string
 *           description: Link ảnh sản phẩm
 *         CategoryName:
 *           type: string
 *           description: Tên danh mục sản phẩm
 *         MaterialName:
 *           type: string
 *           description: Tên chất liệu sản phẩm
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật cuối
 *       example:
 *         id: 1
 *         name: "Áo sơ mi nam"
 *         price: 299000
 *         description: "Áo sơ mi nam chất liệu cotton cao cấp"
 *         total: 50
 *         image: "https://example.com/product1.jpg"
 *         CategoryName: "Shirt"
 *         MaterialId: "Cotton"
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 *     ProductError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Thông báo lỗi
 *       example:
 *         error: "Product not found"
 */

/**
 * @swagger
 * /Products/material/:
 *   get:
 *     summary: Lấy danh sách tất cả chất liệu sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lấy danh sách chất liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách chất liệu thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Gỗ tự nhiên
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/material", productController.getAllMaterial);

/**
 * @swagger
 * /Products/category/:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách danh mục thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Gỗ tự nhiên
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/category", productController.getAllCategory);

/**
 * @swagger
 * /Products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Product]
 *     security: []
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /Products/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm theo ID
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy thông tin sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Product not found"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /Products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tên
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên sản phẩm)
 *         example: "áo sơ mi"
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /Products/filter:
 *   get:
 *     summary: Lọc sản phẩm theo giá và danh mục
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *         description: Giá tối thiểu
 *         example: 100000
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *         description: Giá tối đa
 *         example: 500000
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID danh mục sản phẩm
 *         example: 1
 *     responses:
 *       200:
 *         description: Lọc sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /Products/hot:
 *   get:
 *     summary: Lấy danh sách sản phẩm hot (bán chạy nhất)
 *     tags: [Product]
 *     security: []
 *     description: Lấy top 10 sản phẩm có số lượng tồn kho cao nhất (sắp xếp theo trường total giảm dần)
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm hot thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *               maxItems: 10
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *             example:
 *               error: "Internal server error"
 */

router.get("/", productController.getAllProducts);
router.get("/hot", productController.getHotProducts);
router.get("/search", productController.searchProducts);
router.get("/filter", productController.filterProducts);
router.get("/:id", productController.getProductById);



module.exports = router;
