const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án E-commerce',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: process.env?.SWAGGER_PRODUCTION || process.env.SWAGGER_LOCAL, // URL của server
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./router/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;