require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./router");
const db = require("./config/database");
const seedData = require("./DataScript/dataseed");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


async function startServer() {

    try {

      // Sync the database
      // await db.sync({ force: true});
      // await seedData();
      
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      }); 

    } catch (error) {
      console.error('Error starting server:', error);
    }
}

startServer();
