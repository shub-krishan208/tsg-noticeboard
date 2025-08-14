import express from "express";
import cors from "cors";
// require("dotenv").config();

import sequelize from "./config/database.js";

// adminjs imports
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import bcrypt from "bcryptjs";

import Admin from "./models/admin.js";
import Notice from "./models/notice.js";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";

const app = express();
const PORT = 5000;

// MIDDLEWARE: allowing frontend to get resources from backend
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] })); // must REMOVE port 5173 from here before deploying.
app.use(express.json()); //parse incoming JSON bodies

app.use(express.urlencoded({ extended: true })); // HTML form translator for adminsjs

// setting up adminjs

// registering adminjs adapter
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

// adminjs config
const adminJsOptions = {
  database: sequelize,
  resources: [
    // adding sequeslize models here
    {
      resource: Notice,
      options: {
        properties: {
          content: { type: "richtext" },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
      },
    },
    {
      resource: Admin,
      options: {
        properties: {
          password: { isVisible: false },
        },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Technology Students' Gymkhana",
    softwareBrothers: false,
  },
};

const adminJs = new AdminJS(adminJsOptions);

// creating the admin router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    // auth function
    authenticate: async (email, password) => {
      const admin = await Admin.findOne({ where: { username: email } });

      if (admin) {
        const matched = await bcrypt.compare(password, admin.password);
        if (matched) {
          return admin;
        }
      }

      return false; // no user found
    },
    cookieName: "adminjs-session",
    cookiePassword: "a-super-secret-password-for-cookie-signing-32-chars",
  },
  null,
  {
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  }
);

app.use(adminJs.options.rootPath, adminRouter);

// -- END --

// API routes
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
