import express from "express";
import cors from "cors";
// require("dotenv").config();

import sequelize from "./config/database.js";

// adminjs imports
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import authProvider from "./middleware/authProvider.js";
import session from "express-session";
import { DefaultAuthProvider } from "adminjs";
import { ComponentLoader } from "adminjs";
import { dark, light } from "@adminjs/themes";

import bcrypt from "bcryptjs";
import Admin from "./models/admin.js";
import Notice from "./models/notice.js";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";

const app = express();
const PORT = 5000;

// MIDDLEWARE: allowing frontend to get resources from backend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5000", // to accept request from backend server too
    ],
  })
); // must REMOVE port 5173 from here before deploying.
app.use(express.json()); //parse incoming JSON bodies

app.use(express.urlencoded({ extended: true })); // HTML form translator for adminsjs

//configuring adminjs

// auth function
// the defaultAuthProvider sends the email and password as an opject so we destructure it in the arguement of authenticate function
const authenticate = async ({ email, password }) => {
  console.log(`Trying to authenticate user: ${email}`);

  try {
    const admin = await Admin.findOne({ where: { username: email } });

    if (admin) {
      console.log(`Admin found in the database.`);
      const matched = await bcrypt.compare(password, admin.password);

      if (matched) {
        console.log(`Password match: SUCCESS`);
        return admin;
      } else {
        console.log(`Password match: FAILED`);
      }
    } else {
      console.log(`Admin not found in the database.`);
    }
  } catch (err) {
    console.error(`Error during authentication process:`, err);
  }

  return false; // no user found
};

const componentLoader = new ComponentLoader();
const authprovider = new DefaultAuthProvider({
  componentLoader,
  authenticate,
  defaultTheme: dark.id,
  availableThemes: [dark, light],
});

// setting up adminjs
const start = async () => {
  const applet = express();

  //creating user session
  applet.use(
    session({
      secret: "a-very-long-32-char-string-top-secret-for-cookie-signing",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  // registering adminjs adapter orm
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
            password: { isVisible: true },
          },
        },
      },
    ],
    rootPath: "/admin",
    branding: {
      companyName: "Technology Students' Gymkhana",
      softwareBrothers: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light],
  };

  // initializing admin
  const adminJs = new AdminJS(adminJsOptions);
  const secret = "very-very-secret";

  // creating the admin router
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      // "authenticate" was here
      provider: authprovider,
      cookiePassword:
        "a-very-long-32-char-string-top-secret-for-cookie-signing",
    },
    null,
    {
      secret,
      resave: true,
      saveUninitialized: true,
    }
  );
  applet.use(adminJs.options.rootPath, adminRouter);
  applet.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${adminJs.options.rootPath}`
    );
  });
};
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
    await start();
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
