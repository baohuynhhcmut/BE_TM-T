require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./router");
const db = require("./config/database");
const seedData = require("./DataScript/dataseed");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

async function startServer() {

    try {

    
      
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });

    } catch (error) {
      console.error('Error starting server:', error);
    }

}

startServer();
