import { DefaultAuthProvider } from "adminjs";
import bcrypt from "bcryptjs";

import Admin from "../models/admin.js";
import componentLoader from "./componentLoader.js";

// auth function
const authenticate = async (email, password) => {
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

const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate,
});

export default provider;
