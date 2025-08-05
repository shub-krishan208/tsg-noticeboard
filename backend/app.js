const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const Admin = require("./models/admin");
const Notice = require("./models/notice");

const app = express();
const PORT = 5000;

// allowing frontend to get resources from backend
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); //parse incoming JSON bodies

// routes
app.get("/", (req, res) => {
  res.send("Backend API is now connected to the database!");
});

const startServer = async () => {
  try {
    console.log("Connecting to the database ... ");
    await sequelize.authentication();
    console.log("Database connection has been established successfully.");

    console.log("Synchronizing models with the database ... ");
    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    //start the server after the database is connected
    app.listen(PORT, () => {
      console.log(`Backend server is listening on port: ${PORT}`);
    });
  } catch (err) {
    console.log("Error connecting to the database: ", err);
  }
};

// run the server starting function
startServer();
