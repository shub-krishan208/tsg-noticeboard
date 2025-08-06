const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const sequelize = require("./config/database");

const Admin = require("./models/admin");
const Notice = require("./models/notice");

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();
const PORT = 5000;

// allowing frontend to get resources from backend
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] })); // must REMOVE port 5173 from here before deploying.
app.use(express.json()); //parse incoming JSON bodies

// routes
app.get("/", (req, res) => {
  //this message is shown on the webpage for now
  res.send("Backend API is now connected to the database!");
});

// to accept POST requests also, we use .use() instead of .get
app.use("/api/auth", authRoutes);

app.use("/api/notices", noticeRoutes);

const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        username: "admin",
        password: "password123",
      });
      console.log(
        "Default Admin created for testing, remove this before deployment."
      );
    } else {
      console.log("Admin already exists.");
    }
  } catch (err) {
    console.log("Error while creating admin: ", err);
  }
};

const startServer = async () => {
  try {
    console.log("Connecting to the database ... ");
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    console.log("Synchronizing models with the database ... ");
    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    await createDefaultAdmin();

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
